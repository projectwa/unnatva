<?php

namespace App\Models;

use CodeIgniter\Model;

class SettingModel extends Model
{
    protected $table            = 'settings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'key',
        'value',
        'type',
        'group',
        'description',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = null;
    protected $updatedField  = 'updated_at';
    protected $deletedField  = null;

    // Validation
    protected $validationRules = [
        'key' => 'required|max_length[100]|is_unique[settings.key,id,{id}]',
        'type' => 'required|max_length[50]',
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
     * Get setting by key
     */
    public function getByKey(string $key): ?object
    {
        return $this->where('key', $key)->first();
    }

    /**
     * Get setting value by key (returns just the value)
     */
    public function getValue(string $key, $default = null)
    {
        $setting = $this->getByKey($key);
        if (!$setting) {
            return $default;
        }

        // Cast value based on type
        switch ($setting->type) {
            case 'boolean':
                return filter_var($setting->value, FILTER_VALIDATE_BOOLEAN);
            case 'number':
            case 'integer':
                return (int) $setting->value;
            case 'json':
                return json_decode($setting->value, true);
            default:
                return $setting->value;
        }
    }

    /**
     * Set setting value by key
     */
    public function setValue(string $key, $value, string $type = 'text'): bool
    {
        $setting = $this->getByKey($key);
        
        // Convert value to string if needed
        if ($type === 'json' && is_array($value)) {
            $value = json_encode($value);
        } elseif ($type === 'boolean') {
            $value = $value ? '1' : '0';
        } else {
            $value = (string) $value;
        }

        if ($setting) {
            return $this->update($setting->id, [
                'value' => $value,
                'type' => $type,
            ]);
        } else {
            return $this->insert([
                'key' => $key,
                'value' => $value,
                'type' => $type,
            ]);
        }
    }

    /**
     * Get settings by group
     */
    public function getByGroup(string $group): array
    {
        return $this->where('group', $group)->findAll();
    }
}



