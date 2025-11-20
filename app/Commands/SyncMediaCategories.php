<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\MediaItemModel;
use App\Models\MediaCategoryModel;

class SyncMediaCategories extends BaseCommand
{
    protected $group       = 'Media';
    protected $name        = 'media:sync-categories';
    protected $description = 'Sync categories from media_items to media_categories table';

    public function run(array $params)
    {
        CLI::write('Syncing categories from media_items to media_categories...', 'yellow');
        
        $mediaModel = new MediaItemModel();
        $categoryModel = new MediaCategoryModel();
        
        // Get all distinct categories from media_items
        $categories = $mediaModel->select('category')
            ->distinct()
            ->where('category IS NOT NULL')
            ->where('category !=', '')
            ->findAll();
        
        $categoryNames = array_map(function($item) {
            return $item->category;
        }, $categories);
        
        $categoryNames = array_unique($categoryNames);
        
        CLI::write('Found ' . count($categoryNames) . ' unique categories', 'green');
        
        $created = 0;
        $skipped = 0;
        
        foreach ($categoryNames as $categoryName) {
            // Check if category already exists
            $existing = $categoryModel->where('name', $categoryName)->first();
            
            if ($existing) {
                CLI::write("  ⊘ Skipped (already exists): {$categoryName}", 'yellow');
                $skipped++;
                continue;
            }
            
            // Create new category
            $data = [
                'name' => $categoryName,
                'is_active' => 1,
                'sort_order' => 0,
            ];
            
            if ($categoryModel->insert($data)) {
                CLI::write("  ✓ Created: {$categoryName}", 'green');
                $created++;
            } else {
                CLI::write("  ✗ Failed: {$categoryName}", 'red');
                CLI::error('Errors: ' . json_encode($categoryModel->errors()));
            }
        }
        
        CLI::write('', '');
        CLI::write("Summary:", 'yellow');
        CLI::write("  Created: {$created}", 'green');
        CLI::write("  Skipped: {$skipped}", 'yellow');
        CLI::write('Sync completed!', 'green');
    }
}

