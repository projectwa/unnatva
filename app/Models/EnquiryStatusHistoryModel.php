<?php

namespace App\Models;

use CodeIgniter\Model;

class EnquiryStatusHistoryModel extends Model
{
    protected $table            = 'enquiry_status_history';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'enquiry_id',
        'old_status',
        'new_status',
        'changed_at',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    // Dates
    protected $useTimestamps = false; // We use changed_at instead
    protected $dateFormat    = 'datetime';
    protected $createdField  = null;
    protected $updatedField  = null;
    protected $deletedField  = null;

    // Validation
    protected $validationRules = [
        'enquiry_id' => 'required|integer',
        'new_status' => 'required|max_length[50]',
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
}

