<?php

namespace App\Models;

use CodeIgniter\Model;

class ContentBlockModel extends Model
{
    protected $table            = 'content_blocks';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'block_type',
        'title',
        'content',
        'image',
        'video_url',
        'external_link',
        'metadata',
        'is_active',
        'sort_order',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [
        'metadata' => '?json', // Allow null values - ? must come before type
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = null;

    // Validation
    protected $validationRules = [
        'block_type' => 'required|max_length[100]',
    ];
    protected $validationMessages = [];
    protected $skipValidation     = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    /**
     * Get blocks by type
     */
    public function getByType(string $type): array
    {
        // Query for active blocks of the specified type
        $results = $this->where('block_type', $type)
                    ->where('is_active', 1)
                    ->orderBy('sort_order', 'ASC')
                    ->findAll();
        
        // Log for debugging
        log_message('error', 'ContentBlockModel::getByType - Type: ' . $type . ', Found: ' . count($results));
        if (!empty($results)) {
            foreach ($results as $result) {
                log_message('error', 'ContentBlockModel::getByType - Block ID: ' . $result->id . ', Title: ' . ($result->title ?? 'no title'));
            }
        } else {
            // Check if any blocks exist at all for this type
            $allBlocks = $this->where('block_type', $type)->findAll();
            log_message('error', 'ContentBlockModel::getByType - Total blocks of type ' . $type . ': ' . count($allBlocks));
            if (!empty($allBlocks)) {
                foreach ($allBlocks as $block) {
                    log_message('error', 'ContentBlockModel::getByType - Block ID: ' . $block->id . ', is_active: ' . var_export($block->is_active, true));
                }
            }
        }
        
        return $results;
    }

    /**
     * Get active blocks ordered by sort_order
     */
    public function getActive(): array
    {
        return $this->where('is_active', 1)
                    ->orderBy('sort_order', 'ASC')
                    ->findAll();
    }
}



