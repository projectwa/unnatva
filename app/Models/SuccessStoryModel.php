<?php

namespace App\Models;

use CodeIgniter\Model;

class SuccessStoryModel extends Model
{
    protected $table            = 'success_stories';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'slug',
        'category',
        'name',
        'quote',
        'story',
        'image',
        'place',
        'course',
        'profession',
        'turnover',
        'employment_generated',
        'metadata',
        'is_featured',
        'is_published',
        'sort_order',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [
        'metadata' => '?json', // Allow null values - ? must come before type
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
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
        'slug' => 'required|max_length[191]|is_unique[success_stories.slug,id,{id}]',
        'category' => 'required|max_length[100]',
        'name' => 'required|max_length[255]',
        'quote' => 'required',
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
     * Get story by slug
     */
    public function getBySlug(string $slug): ?object
    {
        return $this->where('slug', $slug)
                    ->where('is_published', 1)
                    ->first();
    }

    /**
     * Get stories by category
     */
    public function getByCategory(string $category): array
    {
        return $this->where('category', $category)
                    ->where('is_published', 1)
                    ->orderBy('sort_order', 'ASC')
                    ->findAll();
    }

    /**
     * Get featured stories
     */
    public function getFeatured(): array
    {
        return $this->where('is_featured', 1)
                    ->where('is_published', 1)
                    ->orderBy('sort_order', 'ASC')
                    ->findAll();
    }
}



