<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\MediaItemModel;
use CodeIgniter\Files\File;

class ImportMediaData extends BaseCommand
{
    protected $group       = 'Media';
    protected $name        = 'media:import';
    protected $description = 'Import media data from media/content.php view file';

    public function run(array $params)
    {
        CLI::write('Starting media data import...', 'green');
        
        $mediaModel = new MediaItemModel();
        
        // Path to the media content file
        $contentFile = APPPATH . 'Views/media/content.php';
        
        if (!file_exists($contentFile)) {
            CLI::error("Media content file not found: {$contentFile}");
            return;
        }
        
        $content = file_get_contents($contentFile);
        
        // Extract categories and images
        // Pattern to match: <a class="d-flex py-2 rounded-pill" ... href="#tab-X">Category Name</a>
        // Then find all images in that tab section
        
        // Map folder names to category names (based on actual folder structure in media/content.php)
        $folderToCategory = [
            'prs_images_webp' => 'Practical Sessions',
            'cobst_images_webp' => 'Community Based Skill Trainings',
            'cbst_images_webp' => 'Centre Based Skill Trainings',
            'edu_images_webp' => 'Eduskilling',
            'ojt_images_webp' => 'On Job Trainings',
            'pls_images_webp' => 'Placement Support',
            'oe_images_webp' => 'Office Events',
            'm_images_webp' => 'Mobilisation',
            'et_images_webp' => 'Entrepreneurship Trainings',
            'wd_images_webp' => 'Women Empowerment',
            'iv_images_webp' => 'Industrial Visits',
            'proe_images_webp' => 'Programmatic Events',
            'mm_images_webp' => 'Memorable Moments',
        ];
        
        $imported = 0;
        $skipped = 0;
        $errors = 0;
        
        // Pattern to match img_path('media/...') calls
        preg_match_all("/img_path\(['\"](media\/[^'\"]+)['\"]\)/", $content, $matches);
        
        if (empty($matches[1])) {
            CLI::write('No media images found in content file.', 'yellow');
            return;
        }
        
        $imagePaths = array_unique($matches[1]);
        CLI::write("Found " . count($imagePaths) . " unique image paths", 'cyan');
        
        // Group images by category based on path
        $imagesByCategory = [];
        foreach ($imagePaths as $imagePath) {
            $category = null;
            
            // Extract folder name from path (e.g., media/prs_images_webp/image.webp -> prs_images_webp)
            if (preg_match('/media\/([^\/]+)/', $imagePath, $pathMatch)) {
                $folderName = $pathMatch[1];
                
                // Check if folder name matches any known category folder
                if (isset($folderToCategory[$folderName])) {
                    $category = $folderToCategory[$folderName];
                } else {
                    // Try partial match (e.g., cobst -> Community Based Skill Trainings)
                    foreach ($folderToCategory as $folder => $catName) {
                        if (stripos($folderName, str_replace('_', '', $folder)) !== false || 
                            stripos($folder, $folderName) !== false) {
                            $category = $catName;
                            break;
                        }
                    }
                }
            }
            
            if (!$category) {
                $category = 'Uncategorized';
            }
            
            if (!isset($imagesByCategory[$category])) {
                $imagesByCategory[$category] = [];
            }
            
            $imagesByCategory[$category][] = $imagePath;
        }
        
        CLI::write("\nCategories found: " . implode(', ', array_keys($imagesByCategory)), 'cyan');
        
        // Import each image
        foreach ($imagesByCategory as $category => $imagePaths) {
            CLI::write("\nProcessing category: {$category}", 'yellow');
            
            foreach ($imagePaths as $imagePath) {
                // Extract filename from path
                $filename = basename($imagePath);
                $originalFilename = $filename;
                
                // Check if already exists
                $existing = $mediaModel->where('file_path', $imagePath)->first();
                if ($existing) {
                    // Update category if it's different
                    if ($existing->category !== $category) {
                        try {
                            $mediaModel->update($existing->id, ['category' => $category]);
                            CLI::write("  ↻ Updated category for: {$filename}", 'yellow');
                            $imported++;
                        } catch (\Exception $e) {
                            CLI::write("  ✗ Error updating {$filename}: " . $e->getMessage(), 'red');
                            $errors++;
                        }
                    } else {
                        $skipped++;
                    }
                    continue;
                }
                
                // Determine file type
                $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                $fileType = 'image';
                $mimeType = $this->getMimeType($extension);
                
                // Check if file exists
                $fullPath = FCPATH . 'img/' . $imagePath;
                if (!file_exists($fullPath)) {
                    CLI::write("  Warning: File not found: {$fullPath}", 'yellow');
                    $errors++;
                    continue;
                }
                
                // Get file size
                $fileSize = filesize($fullPath);
                
                // Get image dimensions if it's an image
                $width = null;
                $height = null;
                if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $imageInfo = @getimagesize($fullPath);
                    if ($imageInfo) {
                        $width = $imageInfo[0];
                        $height = $imageInfo[1];
                    }
                }
                
                // Prepare data
                $data = [
                    'filename' => $filename,
                    'original_filename' => $originalFilename,
                    'file_path' => $imagePath,
                    'file_type' => $fileType,
                    'mime_type' => $mimeType,
                    'file_size' => $fileSize,
                    'width' => $width,
                    'height' => $height,
                    'category' => $category,
                    'alt_text' => $this->generateAltText($filename, $category),
                ];
                
                // Insert into database
                try {
                    if ($mediaModel->insert($data)) {
                        $imported++;
                        CLI::write("  ✓ Imported: {$filename}", 'green');
                    } else {
                        CLI::write("  ✗ Failed to import: {$filename} - " . implode(', ', $mediaModel->errors()), 'red');
                        $errors++;
                    }
                } catch (\Exception $e) {
                    CLI::write("  ✗ Error importing {$filename}: " . $e->getMessage(), 'red');
                    $errors++;
                }
            }
        }
        
        CLI::write("\n" . str_repeat('=', 50), 'cyan');
        CLI::write("Import Summary:", 'cyan');
        CLI::write("  Imported: {$imported}", 'green');
        CLI::write("  Skipped: {$skipped}", 'yellow');
        CLI::write("  Errors: {$errors}", $errors > 0 ? 'red' : 'green');
        CLI::write(str_repeat('=', 50), 'cyan');
    }
    
    private function getMimeType($extension)
    {
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        
        return $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
    }
    
    private function generateAltText($filename, $category)
    {
        // Remove extension
        $name = pathinfo($filename, PATHINFO_FILENAME);
        // Replace underscores and hyphens with spaces
        $name = str_replace(['_', '-'], ' ', $name);
        // Capitalize words
        $name = ucwords($name);
        
        return "{$category} - {$name}";
    }
}

