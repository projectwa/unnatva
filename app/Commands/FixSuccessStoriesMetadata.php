<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\SuccessStoryModel;

class FixSuccessStoriesMetadata extends BaseCommand
{
    protected $group       = 'Migration';
    protected $name        = 'stories:fix-metadata';
    protected $description = 'Fix double-encoded JSON metadata in success stories';

    public function run(array $params)
    {
        CLI::write('Fixing double-encoded metadata...', 'green');
        
        $storiesModel = new SuccessStoryModel();
        
        // Use builder to get raw data, bypassing model casts
        $builder = $storiesModel->builder();
        $stories = $builder->get()->getResultArray();
        
        $fixed = 0;
        $skipped = 0;
        $errors = 0;
        
        foreach ($stories as $story) {
            try {
                $storyId = $story['id'];
                $storyName = isset($story['name']) ? $story['name'] : 'Unknown';
                $metadata = isset($story['metadata']) ? $story['metadata'] : null;
                
                // Skip if metadata is null or empty
                if (empty($metadata)) {
                    $skipped++;
                    continue;
                }
                
                // Check if metadata is a string (needs decoding)
                if (is_string($metadata)) {
                    // Try to decode it
                    $decoded = json_decode($metadata, true);
                    
                    // If decoding succeeds and result is still a string, it was double-encoded
                    if (is_string($decoded)) {
                        $decoded = json_decode($decoded, true);
                        if (is_array($decoded)) {
                            // Update with properly encoded JSON (let CodeIgniter encode it)
                            $builder->where('id', $storyId)->update([
                                'metadata' => json_encode($decoded)
                            ]);
                            $fixed++;
                            CLI::write("  ✓ Fixed double-encoded metadata for: {$storyName}", 'green');
                        } else {
                            CLI::write("  ↻ Skipping (invalid format): {$storyName}", 'yellow');
                            $skipped++;
                        }
                    } elseif (is_array($decoded)) {
                        // It was single-encoded, which is correct - no need to update
                        CLI::write("  ↻ Skipping (already correct): {$storyName}", 'yellow');
                        $skipped++;
                    } else {
                        CLI::write("  ↻ Skipping (null after decode): {$storyName}", 'yellow');
                        $skipped++;
                    }
                } else {
                    // Not a string, skip
                    CLI::write("  ↻ Skipping (not a string): {$storyName}", 'yellow');
                    $skipped++;
                }
            } catch (\Exception $e) {
                $name = isset($story['name']) ? $story['name'] : 'Unknown';
                CLI::write("  ✗ Error fixing {$name}: " . $e->getMessage(), 'red');
                $errors++;
            }
        }
        
        CLI::write("\n" . str_repeat('=', 50), 'cyan');
        CLI::write("Fix Summary:", 'cyan');
        CLI::write("  Fixed: {$fixed}", 'green');
        CLI::write("  Skipped: {$skipped}", 'yellow');
        CLI::write("  Errors: {$errors}", $errors > 0 ? 'red' : 'green');
        CLI::write(str_repeat('=', 50), 'cyan');
        
        if ($fixed > 0) {
            CLI::write("\nMetadata fix completed! The API should now work correctly.", 'green');
        }
    }
}

