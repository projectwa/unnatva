<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\SuccessStoryModel;

class SuccessStories extends BaseController
{
    protected $storiesModel;

    public function __construct()
    {
        $this->storiesModel = new SuccessStoryModel();
    }

    /**
     * List all success stories
     */
    public function index()
    {
        try {
            $stories = $this->storiesModel->orderBy('created_at', 'DESC')->findAll();
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $stories
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in SuccessStories::index: ' . $e->getMessage());
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
     * Get single story
     */
    public function show($id)
    {
        $story = $this->storiesModel->find($id);
        
        if (!$story) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Story not found']);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => $story
        ]);
    }

    /**
     * Create new story
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$this->storiesModel->insert($data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->storiesModel->errors()
                ]);
        }

        return $this->response
            ->setStatusCode(201)
            ->setJSON([
                'success' => true,
                'message' => 'Story created successfully',
                'data' => $this->storiesModel->find($this->storiesModel->getInsertID())
            ]);
    }

    /**
     * Update story
     */
    public function update($id)
    {
        $story = $this->storiesModel->find($id);
        
        if (!$story) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Story not found']);
        }

        $data = $this->request->getJSON(true);

        if (!$this->storiesModel->update($id, $data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->storiesModel->errors()
                ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Story updated successfully',
            'data' => $this->storiesModel->find($id)
        ]);
    }

    /**
     * Delete story
     */
    public function delete($id)
    {
        $story = $this->storiesModel->find($id);
        
        if (!$story) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Story not found']);
        }

        $this->storiesModel->delete($id);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Story deleted successfully'
        ]);
    }
}

