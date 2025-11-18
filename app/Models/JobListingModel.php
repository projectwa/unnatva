<?php

namespace App\Models;

use CodeIgniter\Model;

class JobListingModel extends Model
{
    protected $table            = 'job_listings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'title',
        'description',
        'location',
        'experience',
        'category',
        'deadline',
        'is_active',
        'sort_order',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [
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
     * Get active jobs ordered by sort_order
     * Only returns jobs where deadline is in the future or null
     */
    public function getActive(): array
    {
        $today = date('Y-m-d');
        
        // Use SQL to filter directly - more efficient and reliable
        // Show jobs where:
        // 1. is_active = 1 AND
        // 2. (deadline IS NULL OR deadline >= today)
        $jobs = $this->where('is_active', 1)
                    ->groupStart()
                        ->where('deadline', null)
                        ->orWhere('deadline >=', $today)
                    ->groupEnd()
                    ->orderBy('sort_order', 'ASC')
                    ->findAll();
        
        // Debug logging
        log_message('error', "JobListingModel::getActive - Today: {$today}, Found " . count($jobs) . " jobs");
        foreach ($jobs as $job) {
            log_message('error', "  - Job ID {$job->id}: '{$job->title}', deadline: " . ($job->deadline ?? 'NULL'));
        }
        
        return $jobs;
    }
}

