<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\SettingModel;

class Settings extends BaseController
{
    protected $settingModel;

    public function __construct()
    {
        $this->settingModel = new SettingModel();
    }

    /**
     * List all settings (grouped by group)
     */
    public function index()
    {
        try {
            $settings = $this->settingModel->orderBy('group', 'ASC')->orderBy('key', 'ASC')->findAll();
            
            // Group settings by group
            $grouped = [];
            foreach ($settings as $setting) {
                $group = $setting->group ?: 'general';
                if (!isset($grouped[$group])) {
                    $grouped[$group] = [];
                }
                $grouped[$group][] = $setting;
            }
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $settings,
                'grouped' => $grouped
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Settings::index: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Get single setting
     */
    public function show($id)
    {
        $setting = $this->settingModel->find($id);
        
        if (!$setting) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Setting not found']);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => $setting
        ]);
    }

    /**
     * Create new setting
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$this->settingModel->insert($data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->settingModel->errors()
                ]);
        }

        return $this->response
            ->setStatusCode(201)
            ->setJSON([
                'success' => true,
                'message' => 'Setting created successfully',
                'data' => $this->settingModel->find($this->settingModel->getInsertID())
            ]);
    }

    /**
     * Update setting
     */
    public function update($id)
    {
        $setting = $this->settingModel->find($id);
        
        if (!$setting) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Setting not found']);
        }

        $data = $this->request->getJSON(true);

        if (!$this->settingModel->update($id, $data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->settingModel->errors()
                ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Setting updated successfully',
            'data' => $this->settingModel->find($id)
        ]);
    }

    /**
     * Bulk update settings
     */
    public function bulkUpdate()
    {
        $data = $this->request->getJSON(true);
        
        if (!isset($data['settings']) || !is_array($data['settings'])) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON(['error' => 'Invalid data format']);
        }

        $updated = 0;
        $errors = [];

        foreach ($data['settings'] as $settingData) {
            if (!isset($settingData['id'])) {
                $errors[] = 'Setting ID is required';
                continue;
            }

            $id = $settingData['id'];
            unset($settingData['id']);

            if (!$this->settingModel->update($id, $settingData)) {
                $errors[] = "Failed to update setting ID {$id}: " . implode(', ', $this->settingModel->errors());
            } else {
                $updated++;
            }
        }

        return $this->response->setJSON([
            'success' => count($errors) === 0,
            'message' => "Updated {$updated} setting(s)",
            'updated' => $updated,
            'errors' => $errors
        ]);
    }

    /**
     * Delete setting
     */
    public function delete($id)
    {
        $setting = $this->settingModel->find($id);
        
        if (!$setting) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Setting not found']);
        }

        $this->settingModel->delete($id);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Setting deleted successfully'
        ]);
    }
}

