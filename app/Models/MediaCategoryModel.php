<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Models\MediaItemModel;

class MediaCategoryModel extends Model
{
    protected $table            = 'media_categories';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'name',
        'is_active',
        'sort_order',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = null;

    // Validation
    protected $validationRules = [
        'name' => 'required|max_length[100]|is_unique[media_categories.name,id,{id}]',
    ];
    protected $validationMessages = [];
    protected $skipValidation     = false;
    protected $cleanValidationRules = true;

    /**
     * Get active categories
     */
    public function getActive()
    {
        return $this->where('is_active', 1)
                    ->orderBy('sort_order', 'ASC')
                    ->orderBy('name', 'ASC')
                    ->findAll();
    }

    /**
     * Check if category has media items
     */
    public function hasMedia($categoryId)
    {
        $category = $this->find($categoryId);
        if (!$category) {
            return false;
        }
        
        $mediaModel = new MediaItemModel();
        $count = $mediaModel->where('category', $category->name)->countAllResults();
        
        return $count > 0;
    }
}

