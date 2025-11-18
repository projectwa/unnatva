<?php

namespace App\Models;

use CodeIgniter\Model;

class PageModel extends Model
{
    protected $table            = 'pages';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'slug',
        'title',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'body_class',
        'content',
        'is_published',
        'sort_order',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [
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
        'slug' => 'required|max_length[191]|is_unique[pages.slug,id,{id}]',
        'title' => 'required|max_length[255]',
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
     * Get page by slug
     */
    public function getBySlug(string $slug): ?object
    {
        return $this->where('slug', $slug)
                    ->where('is_published', 1)
                    ->first();
    }

    /**
     * Get all published pages ordered by sort_order
     */
    public function getPublished(): array
    {
        return $this->where('is_published', 1)
                    ->orderBy('sort_order', 'ASC')
                    ->findAll();
    }
}



