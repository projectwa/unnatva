<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\CarouselSlideModel;

class Carousel extends BaseController
{
    protected $carouselModel;

    public function __construct()
    {
        $this->carouselModel = new CarouselSlideModel();
    }

    /**
     * List all carousel slides
     */
    public function index()
    {
        $slides = $this->carouselModel->orderBy('sort_order', 'ASC')->findAll();
        
        return $this->response->setJSON([
            'success' => true,
            'data' => $slides
        ]);
    }

    /**
     * Get single slide
     */
    public function show($id)
    {
        $slide = $this->carouselModel->find($id);
        
        if (!$slide) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Slide not found']);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => $slide
        ]);
    }

    /**
     * Create new slide
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$this->carouselModel->insert($data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->carouselModel->errors()
                ]);
        }

        return $this->response
            ->setStatusCode(201)
            ->setJSON([
                'success' => true,
                'message' => 'Slide created successfully',
                'data' => $this->carouselModel->find($this->carouselModel->getInsertID())
            ]);
    }

    /**
     * Update slide
     */
    public function update($id)
    {
        $slide = $this->carouselModel->find($id);
        
        if (!$slide) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Slide not found']);
        }

        $data = $this->request->getJSON(true);

        if (!$this->carouselModel->update($id, $data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->carouselModel->errors()
                ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Slide updated successfully',
            'data' => $this->carouselModel->find($id)
        ]);
    }

    /**
     * Delete slide
     */
    public function delete($id)
    {
        $slide = $this->carouselModel->find($id);
        
        if (!$slide) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Slide not found']);
        }

        $this->carouselModel->delete($id);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Slide deleted successfully'
        ]);
    }

    /**
     * Upload carousel image
     */
    public function uploadImage()
    {
        try {
            $file = $this->request->getFile('image');
            
            if (!$file || !$file->isValid()) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'No valid file uploaded']);
            }

            // Validate file type (images only)
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            
            $originalName = $file->getName();
            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
            $mimeType = $file->getMimeType();
            
            if (!in_array($extension, $allowedExtensions) || !in_array($mimeType, $allowedTypes)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Invalid file type. Only JPG, PNG, GIF, and WEBP images are allowed.']);
            }

            // Validate file size (max 5MB)
            if ($file->getSize() > 5 * 1024 * 1024) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'File size exceeds 5MB limit']);
            }

            // Generate unique filename
            $baseName = pathinfo($originalName, PATHINFO_FILENAME);
            $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $baseName);
            $newName = 'carousel_' . $baseName . '_' . time() . '.' . $extension;
            
            // Move file to public/img directory
            $uploadPath = FCPATH . 'img' . DIRECTORY_SEPARATOR;
            
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            if (!$file->hasMoved()) {
                if ($file->move($uploadPath, $newName)) {
                    return $this->response->setJSON([
                        'success' => true,
                        'filename' => $newName,
                        'url' => base_url('img/' . $newName),
                        'message' => 'Image uploaded successfully'
                    ]);
                } else {
                    $errors = $file->getErrors();
                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON([
                            'error' => 'Failed to save file',
                            'errors' => $errors
                        ]);
                }
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON(['error' => 'File already processed']);
            }
        } catch (\Throwable $e) {
            log_message('error', 'Error in Carousel::uploadImage: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }
}



