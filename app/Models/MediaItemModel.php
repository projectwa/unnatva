<?php

namespace App\Models;

use CodeIgniter\Model;

class MediaItemModel extends Model
{
    protected $table            = 'media_items';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'filename',
        'original_filename',
        'file_path',
        'file_type',
        'mime_type',
        'file_size',
        'width',
        'height',
        'alt_text',
        'caption',
        'category',
        'tags',
        'uploaded_by',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [
        'tags' => '?json', // Allow null values - ? must come before type
        'file_size' => 'integer',
        'width' => '?integer', // Allow null
        'height' => '?integer', // Allow null
        'uploaded_by' => '?integer', // Allow null
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
        'filename' => 'required|max_length[255]',
        'file_path' => 'required|max_length[500]',
        'file_type' => 'required|max_length[50]',
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
     * Get media by category
     */
    public function getByCategory(?string $category = null): array
    {
        $builder = $this->builder();
        if ($category) {
            $builder->where('category', $category);
        }
        return $builder->orderBy('created_at', 'DESC')->get()->getResult();
    }

    /**
     * Get media by file type
     */
    public function getByFileType(string $fileType): array
    {
        return $this->where('file_type', $fileType)
                    ->orderBy('created_at', 'DESC')
                    ->findAll();
    }
}



