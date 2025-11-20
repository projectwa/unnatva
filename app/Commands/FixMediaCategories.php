<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\MediaItemModel;

class FixMediaCategories extends BaseCommand
{
    protected $group       = 'Media';
    protected $name        = 'media:fix-categories';
    protected $description = 'Fix category assignments for existing media items based on folder structure';

    public function run(array $params)
    {
        CLI::write('Fixing media categories...', 'green');
        
        $mediaModel = new MediaItemModel();
        
        // Map folder names to category names (based on actual folder structure)
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
        
        // Get all media items
        $mediaItems = $mediaModel->findAll();
        
        $updated = 0;
        $skipped = 0;
        $errors = 0;
        
        CLI::write("Found " . count($mediaItems) . " media items to check", 'cyan');
        
        foreach ($mediaItems as $item) {
            $category = null;
            
            // Extract folder name from path (e.g., media/prs_images_webp/image.webp -> prs_images_webp)
            if (preg_match('/media\/([^\/]+)/', $item->file_path, $pathMatch)) {
                $folderName = $pathMatch[1];
                
                // Check if folder name matches any known category folder
                if (isset($folderToCategory[$folderName])) {
                    $category = $folderToCategory[$folderName];
                } else {
                    // Try partial match
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
            
            // Update if category is different
            if ($item->category !== $category) {
                try {
                    $mediaModel->update($item->id, ['category' => $category]);
                    CLI::write("  ✓ Updated: {$item->filename} -> {$category}", 'green');
                    $updated++;
                } catch (\Exception $e) {
                    CLI::write("  ✗ Error updating {$item->filename}: " . $e->getMessage(), 'red');
                    $errors++;
                }
            } else {
                $skipped++;
            }
        }
        
        CLI::write("\n" . str_repeat('=', 50), 'cyan');
        CLI::write("Fix Summary:", 'cyan');
        CLI::write("  Updated: {$updated}", 'green');
        CLI::write("  Skipped: {$skipped}", 'yellow');
        CLI::write("  Errors: {$errors}", $errors > 0 ? 'red' : 'green');
        CLI::write(str_repeat('=', 50), 'cyan');
    }
}

