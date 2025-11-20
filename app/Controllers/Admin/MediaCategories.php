<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\MediaCategoryModel;
use App\Models\MediaItemModel;

class MediaCategories extends BaseController
{
    protected $categoryModel;
    protected $mediaModel;

    public function __construct()
    {
        $this->categoryModel = new MediaCategoryModel();
        $this->mediaModel = new MediaItemModel();
    }

    /**
     * List all categories
     */
    public function index()
    {
        try {
            $categories = $this->categoryModel->orderBy('sort_order', 'ASC')
                ->orderBy('name', 'ASC')
                ->findAll();
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in MediaCategories::index: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Get single category
     */
    public function show($id)
    {
        $category = $this->categoryModel->find($id);
        
        if (!$category) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Category not found']);
        }

        // Check if category has media
        $hasMedia = $this->categoryModel->hasMedia($id);

        return $this->response->setJSON([
            'success' => true,
            'data' => $category,
            'has_media' => $hasMedia
        ]);
    }

    /**
     * Create new category
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Get max sort_order and add 1
            $maxOrder = $this->categoryModel->selectMax('sort_order')->first();
            $data['sort_order'] = ($maxOrder->sort_order ?? 0) + 1;

            if (!$this->categoryModel->insert($data)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Validation failed',
                        'errors' => $this->categoryModel->errors()
                    ]);
            }

            return $this->response
                ->setStatusCode(201)
                ->setJSON([
                    'success' => true,
                    'message' => 'Category created successfully',
                    'data' => $this->categoryModel->find($this->categoryModel->getInsertID())
                ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in MediaCategories::create: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Update category
     */
    public function update($id)
    {
        try {
            $category = $this->categoryModel->find($id);
            
            if (!$category) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Category not found']);
            }

            $data = $this->request->getJSON(true);

            if (!$this->categoryModel->update($id, $data)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Validation failed',
                        'errors' => $this->categoryModel->errors()
                    ]);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $this->categoryModel->find($id)
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in MediaCategories::update: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Delete category
     */
    public function delete($id)
    {
        try {
            $category = $this->categoryModel->find($id);
            
            if (!$category) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Category not found']);
            }

            // Check if category has media
            if ($this->categoryModel->hasMedia($id)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Cannot delete category. It contains media items.'
                    ]);
            }

            $this->categoryModel->delete($id);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Category deleted successfully'
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in MediaCategories::delete: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Toggle category active status
     */
    public function toggleActive($id)
    {
        try {
            $category = $this->categoryModel->find($id);
            
            if (!$category) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Category not found']);
            }

            $newStatus = $category->is_active ? 0 : 1;
            $this->categoryModel->update($id, ['is_active' => $newStatus]);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Category status updated successfully',
                'data' => $this->categoryModel->find($id)
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in MediaCategories::toggleActive: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }
}

