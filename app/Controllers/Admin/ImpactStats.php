<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\ImpactStatModel;

class ImpactStats extends BaseController
{
    protected $statsModel;

    public function __construct()
    {
        $this->statsModel = new ImpactStatModel();
    }

    /**
     * List all impact stats
     */
    public function index()
    {
        $stats = $this->statsModel->orderBy('sort_order', 'ASC')->findAll();
        
        return $this->response->setJSON([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get single stat
     */
    public function show($id)
    {
        $stat = $this->statsModel->find($id);
        
        if (!$stat) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Stat not found']);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => $stat
        ]);
    }

    /**
     * Create new stat
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$this->statsModel->insert($data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->statsModel->errors()
                ]);
        }

        return $this->response
            ->setStatusCode(201)
            ->setJSON([
                'success' => true,
                'message' => 'Stat created successfully',
                'data' => $this->statsModel->find($this->statsModel->getInsertID())
            ]);
    }

    /**
     * Update stat
     */
    public function update($id)
    {
        $stat = $this->statsModel->find($id);
        
        if (!$stat) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Stat not found']);
        }

        $data = $this->request->getJSON(true);

        if (!$this->statsModel->update($id, $data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->statsModel->errors()
                ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Stat updated successfully',
            'data' => $this->statsModel->find($id)
        ]);
    }

    /**
     * Delete stat
     */
    public function delete($id)
    {
        $stat = $this->statsModel->find($id);
        
        if (!$stat) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Stat not found']);
        }

        $this->statsModel->delete($id);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Stat deleted successfully'
        ]);
    }
}



