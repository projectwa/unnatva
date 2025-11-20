<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\SuccessStoryModel;

class MigrateSuccessStories extends BaseCommand
{
    protected $group       = 'Migration';
    protected $name        = 'stories:migrate';
    protected $description = 'Migrate success stories data from http://lhunnatva/success-stories category-wise into database';

    public function run(array $params)
    {
        CLI::write('Starting success stories migration...', 'green');
        
        $storiesModel = new SuccessStoryModel();
        
        // Read the view file directly
        $viewFile = APPPATH . 'Views/success-stories/content.php';
        
        if (!file_exists($viewFile)) {
            CLI::error("View file not found: {$viewFile}");
            return;
        }
        
        CLI::write("Reading data from: {$viewFile}", 'cyan');
        
        // Read HTML content from view file
        $html = file_get_contents($viewFile);
        
        if (!$html) {
            CLI::error('Failed to read view file.');
            return;
        }
        
        // Parse HTML to extract success stories
        $stories = $this->parseSuccessStories($html);
        
        if (empty($stories)) {
            CLI::write('No success stories found in the HTML. The page structure may have changed.', 'yellow');
            CLI::write('You may need to manually adjust the parsing logic.', 'yellow');
            return;
        }
        
        CLI::write("\nFound " . count($stories) . " success stories to migrate", 'cyan');
        
        $imported = 0;
        $skipped = 0;
        $errors = 0;
        
        foreach ($stories as $story) {
            // Check if story already exists (by slug or name)
            $existing = null;
            if (!empty($story['slug'])) {
                $existing = $storiesModel->where('slug', $story['slug'])->first();
            }
            if (!$existing && !empty($story['name'])) {
                $existing = $storiesModel->where('name', $story['name'])->first();
            }
            
            if ($existing) {
                CLI::write("  ↻ Skipping existing story: {$story['name']}", 'yellow');
                $skipped++;
                continue;
            }
            
            // Ensure required fields
            if (empty($story['slug'])) {
                $story['slug'] = $this->generateSlug($story['name'] ?? 'story-' . time() . '-' . rand(1000, 9999));
            }
            
            if (empty($story['category'])) {
                $story['category'] = 'uncategorized';
            }
            
            // Set defaults
            $story['is_published'] = $story['is_published'] ?? true;
            $story['is_featured'] = $story['is_featured'] ?? false;
            $story['sort_order'] = $story['sort_order'] ?? 0;
            
            // Don't encode metadata - let CodeIgniter model handle it via cast
            // The model has 'metadata' => '?json' cast which will handle encoding/decoding
            
            // Insert into database
            try {
                if ($storiesModel->insert($story)) {
                    $imported++;
                    CLI::write("  ✓ Imported: {$story['name']} ({$story['category']})", 'green');
                } else {
                    $errorsList = $storiesModel->errors();
                    CLI::write("  ✗ Failed to import: {$story['name']} - " . implode(', ', $errorsList), 'red');
                    $errors++;
                }
            } catch (\Exception $e) {
                CLI::write("  ✗ Error importing {$story['name']}: " . $e->getMessage(), 'red');
                $errors++;
            }
        }
        
        CLI::write("\n" . str_repeat('=', 50), 'cyan');
        CLI::write("Migration Summary:", 'cyan');
        CLI::write("  Imported: {$imported}", 'green');
        CLI::write("  Skipped: {$skipped}", 'yellow');
        CLI::write("  Errors: {$errors}", $errors > 0 ? 'red' : 'green');
        CLI::write(str_repeat('=', 50), 'cyan');
        
        if ($imported > 0) {
            CLI::write("\nMigration completed! Check CMS > Success Stories module to view imported data.", 'green');
        }
    }
    
    /**
     * Fetch HTML content from URL
     */
    private function fetchUrl($url)
    {
        // Try using cURL first
        if (function_exists('curl_init')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $html = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200 && $html) {
                return $html;
            }
        }
        
        // Fallback to file_get_contents
        $context = stream_context_create([
            'http' => [
                'timeout' => 30,
                'follow_location' => true,
                'ignore_errors' => true
            ]
        ]);
        
        $html = @file_get_contents($url, false, $context);
        return $html ?: false;
    }
    
    /**
     * Parse HTML to extract success stories from tab panes
     */
    private function parseSuccessStories($html)
    {
        $stories = [];
        
        // Create DOMDocument
        libxml_use_internal_errors(true);
        $dom = new \DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        libxml_clear_errors();
        
        $xpath = new \DOMXPath($dom);
        
        // Find all tab panes (categories)
        $tabPanes = $xpath->query("//div[contains(@class, 'tab-pane')]");
        
        foreach ($tabPanes as $tabPane) {
            // Extract category from tab pane ID
            $tabId = $tabPane->getAttribute('id');
            $category = $this->extractCategoryFromTabId($tabId);
            
            // Find all quote-box containers (each is a story)
            $storyContainers = $xpath->query(".//div[contains(@class, 'quote-box')]", $tabPane);
            
            foreach ($storyContainers as $container) {
                $story = $this->extractStoryData($container, $xpath);
                if ($story) {
                    $story['category'] = $category;
                    $stories[] = $story;
                }
            }
        }
        
        return $stories;
    }
    
    /**
     * Extract category from tab pane ID
     */
    private function extractCategoryFromTabId($tabId)
    {
        // Map tab IDs to category slugs
        $categoryMap = [
            'pills-entrepreneurship-development' => 'entrepreneurship-development',
            'pills-skill-development' => 'skill-development',
            'pills-women-empowerment' => 'women-empowerment',
            'pills-education' => 'education',
        ];
        
        return $categoryMap[$tabId] ?? 'uncategorized';
    }
    
    /**
     * Extract story data from DOM element
     */
    private function extractStoryData($element, $xpath)
    {
        $story = [];
        
        // Extract quote (first bold paragraph)
        $quoteNode = $xpath->query(".//p[contains(@class, 'text-dark') and contains(@class, 'fw-bold')]", $element);
        if ($quoteNode->length > 0) {
            $story['quote'] = trim($quoteNode->item(0)->textContent);
        }
        
        // Extract story text (all small paragraphs except the first one which is quote)
        $storyParagraphs = $xpath->query(".//p[contains(@class, 'small')]", $element);
        if ($storyParagraphs->length > 0) {
            $storyText = [];
            foreach ($storyParagraphs as $node) {
                $text = trim($node->textContent);
                if (!empty($text) && strlen($text) > 20) {
                    $storyText[] = $text;
                }
            }
            $story['story'] = implode("\n\n", $storyText);
        }
        
        // Extract image from photo-content section
        $photoContent = $xpath->query(".//div[contains(@class, 'photo-content')]", $element);
        if ($photoContent->length > 0) {
            $photoDiv = $photoContent->item(0);
            
            // Extract image
            $imgNode = $xpath->query(".//img", $photoDiv);
            if ($imgNode->length > 0) {
                $imgSrc = $imgNode->item(0)->getAttribute('src');
                if ($imgSrc) {
                    // Extract filename from img_path() function call or direct path
                    if (preg_match("/img_path\(['\"]([^'\"]+)['\"]\)/", $imgSrc, $matches)) {
                        $story['image'] = basename($matches[1]);
                    } else {
                        $story['image'] = basename($imgSrc);
                    }
                }
            }
            
            // Extract details from paragraphs in photo-content
            $detailParagraphs = $xpath->query(".//p[@class='mb-0'] | .//p[@class='mb-1']", $photoDiv);
            foreach ($detailParagraphs as $para) {
                $text = trim($para->textContent);
                
                // Parse Name
                if (preg_match('/^Name:\s*(.+)$/i', $text, $matches)) {
                    $story['name'] = trim($matches[1]);
                }
                // Parse Place
                elseif (preg_match('/^Place:\s*(.+)$/i', $text, $matches)) {
                    $story['place'] = trim($matches[1]);
                }
                // Parse Course
                elseif (preg_match('/^Course:\s*(.+)$/i', $text, $matches)) {
                    $story['course'] = trim($matches[1]);
                }
                // Parse Profession
                elseif (preg_match('/^(Current\s+)?Profession:\s*(.+)$/i', $text, $matches)) {
                    $story['profession'] = trim($matches[2]);
                }
                // Parse Turnover
                elseif (preg_match('/^Turnover:\s*(.+)$/i', $text, $matches)) {
                    $story['turnover'] = trim($matches[1]);
                }
                // Parse Employment Generated
                elseif (preg_match('/^Employment\s+Generation:\s*(.+)$/i', $text, $matches)) {
                    $story['employment_generated'] = trim($matches[1]);
                }
                // Parse Employment (alternative format)
                elseif (preg_match('/^Employment:\s*(.+)$/i', $text, $matches)) {
                    // This might be profession info, skip or handle differently
                }
                // Parse Salary (for skill development stories)
                elseif (preg_match('/^(Current\s+)?(Monthly|Annual)\s+Salary[^:]*:\s*(.+)$/i', $text, $matches)) {
                    // Store as metadata or in a custom field
                    if (!isset($story['metadata'])) {
                        $story['metadata'] = [];
                    }
                    $story['metadata']['salary'] = trim($matches[3]);
                    $story['metadata']['salary_type'] = strtolower(trim($matches[2]));
                }
                // Parse Employed at
                elseif (preg_match('/^Employed\s+at:\s*(.+)$/i', $text, $matches)) {
                    if (!isset($story['metadata'])) {
                        $story['metadata'] = [];
                    }
                    $story['metadata']['employed_at'] = trim($matches[1]);
                }
                // Parse Before Training
                elseif (preg_match('/^Before\s+Training:\s*(.+)$/i', $text, $matches)) {
                    if (!isset($story['metadata'])) {
                        $story['metadata'] = [];
                    }
                    $story['metadata']['before_training'] = trim($matches[1]);
                }
            }
        }
        
        // Generate slug from name or container ID
        if (!empty($story['name'])) {
            $story['slug'] = $this->generateSlug($story['name']);
        } elseif ($element->hasAttribute('id')) {
            $story['slug'] = $element->getAttribute('id');
        }
        
        // Only return if we have at least name and quote
        if (!empty($story['name']) && !empty($story['quote'])) {
            return $story;
        }
        
        return null;
    }
    
    /**
     * Normalize category name
     */
    private function normalizeCategory($category)
    {
        $category = strtolower(trim($category));
        $category = preg_replace('/[^a-z0-9\s-]/', '', $category);
        $category = preg_replace('/\s+/', '-', $category);
        return $category;
    }
    
    /**
     * Generate URL-friendly slug
     */
    private function generateSlug($text)
    {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
        $text = preg_replace('/\s+/', '-', $text);
        $text = preg_replace('/-+/', '-', $text);
        $text = trim($text, '-');
        
        // Ensure uniqueness by appending timestamp if needed
        $storiesModel = new SuccessStoryModel();
        $baseSlug = $text;
        $counter = 1;
        
        while ($storiesModel->where('slug', $text)->first()) {
            $text = $baseSlug . '-' . $counter;
            $counter++;
        }
        
        return $text;
    }
}

