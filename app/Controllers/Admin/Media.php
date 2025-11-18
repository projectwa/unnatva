<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\MediaItemModel;

class Media extends BaseController
{
    protected $mediaModel;

    public function __construct()
    {
        $this->mediaModel = new MediaItemModel();
    }

    /**
     * List all media items
     */
    public function index()
    {
        try {
            $media = $this->mediaModel->orderBy('created_at', 'DESC')->findAll();
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $media
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Media::index: ' . $e->getMessage());
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
     * Get single media item
     */
    public function show($id)
    {
        $media = $this->mediaModel->find($id);
        
        if (!$media) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Media item not found']);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => $media
        ]);
    }

    /**
     * Create new media item
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$this->mediaModel->insert($data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->mediaModel->errors()
                ]);
        }

        return $this->response
            ->setStatusCode(201)
            ->setJSON([
                'success' => true,
                'message' => 'Media item created successfully',
                'data' => $this->mediaModel->find($this->mediaModel->getInsertID())
            ]);
    }

    /**
     * Update media item
     */
    public function update($id)
    {
        $media = $this->mediaModel->find($id);
        
        if (!$media) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Media item not found']);
        }

        $data = $this->request->getJSON(true);

        if (!$this->mediaModel->update($id, $data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->mediaModel->errors()
                ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Media item updated successfully',
            'data' => $this->mediaModel->find($id)
        ]);
    }

    /**
     * Delete media item
     */
    public function delete($id)
    {
        $media = $this->mediaModel->find($id);
        
        if (!$media) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Media item not found']);
        }

        $this->mediaModel->delete($id);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Media item deleted successfully'
        ]);
    }
}

