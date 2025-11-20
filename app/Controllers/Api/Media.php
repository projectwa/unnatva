<?php

namespace App\Controllers\Api;

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
     * Get all categories
     */
    public function getCategories()
    {
        try {
            $categories = $this->mediaModel->select('category')
                ->distinct()
                ->where('category IS NOT NULL')
                ->where('category !=', '')
                ->orderBy('category', 'ASC')
                ->findAll();
            
            $categoryList = array_map(function($item) {
                return $item->category;
            }, $categories);
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $categoryList
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Media::getCategories: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Get media items by category (public API)
     */
    public function getByCategory()
    {
        try {
            // Ensure we return JSON
            $this->response->setContentType('application/json');
            
            $category = $this->request->getGet('category');
            
            if (!$category) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'error' => 'Category parameter is required'
                    ]);
            }
            
            $query = $this->mediaModel
                ->where('category', $category)
                ->where('file_type', 'image') // Only images
                ->orderBy('created_at', 'DESC');
            
            $media = $query->findAll();
            
            // Format response with full image URLs
            $formattedMedia = array_map(function($item) {
                return [
                    'id' => $item->id,
                    'filename' => $item->filename,
                    'file_path' => $item->file_path,
                    'alt_text' => $item->alt_text,
                    'caption' => $item->caption,
                    'category' => $item->category,
                    'image_url' => base_url('img/' . $item->file_path)
                ];
            }, $media);
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $formattedMedia
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Media::getByCategory: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setContentType('application/json')
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }
}

