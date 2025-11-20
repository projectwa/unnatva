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
     * List all success stories with filtering
     */
    public function index()
    {
        try {
            $category = $this->request->getGet('category');
            $search = $this->request->getGet('search');
            
            // Build query using model methods
            $query = $this->storiesModel;
            
            // Apply category filter
            if (!empty($category)) {
                $query = $query->where('category', $category);
            }
            
            // Apply search filter (name, course, place)
            if (!empty($search)) {
                $query = $query->groupStart()
                    ->like('name', $search)
                    ->orLike('course', $search)
                    ->orLike('place', $search)
                    ->groupEnd();
            }
            
            // Use builder to get raw data and handle metadata manually
            $builder = $this->storiesModel->builder();
            
            // Apply filters
            if (!empty($category)) {
                $builder->where('category', $category);
            }
            if (!empty($search)) {
                $builder->groupStart()
                    ->like('name', $search)
                    ->orLike('course', $search)
                    ->orLike('place', $search)
                    ->groupEnd();
            }
            
            $results = $builder->orderBy('created_at', 'DESC')->get()->getResultArray();
            
            // Process results and handle metadata
            $stories = [];
            foreach ($results as $row) {
                // Handle metadata - check if double-encoded
                if (!empty($row['metadata'])) {
                    try {
                        $decoded = json_decode($row['metadata'], true);
                        // If decoded value is still a string, it was double-encoded
                        if (is_string($decoded)) {
                            $decoded = json_decode($decoded, true);
                        }
                        $row['metadata'] = $decoded ?: null;
                    } catch (\Exception $e) {
                        $row['metadata'] = null;
                    }
                } else {
                    $row['metadata'] = null;
                }
                
                // Convert boolean fields
                $row['is_featured'] = (bool)($row['is_featured'] ?? false);
                $row['is_published'] = (bool)($row['is_published'] ?? true);
                $row['sort_order'] = (int)($row['sort_order'] ?? 0);
                
                $stories[] = (object)$row;
            }
            
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
        // Use builder to get raw data and handle metadata manually
        $builder = $this->storiesModel->builder();
        $result = $builder->where('id', $id)->get()->getRowArray();
        
        if (!$result) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Story not found']);
        }
        
        // Handle metadata - check if double-encoded
        if (!empty($result['metadata'])) {
            try {
                $decoded = json_decode($result['metadata'], true);
                // If decoded value is still a string, it was double-encoded
                if (is_string($decoded)) {
                    $decoded = json_decode($decoded, true);
                }
                $result['metadata'] = $decoded ?: null;
            } catch (\Exception $e) {
                $result['metadata'] = null;
            }
        } else {
            $result['metadata'] = null;
        }
        
        // Convert boolean fields
        $result['is_featured'] = (bool)($result['is_featured'] ?? false);
        $result['is_published'] = (bool)($result['is_published'] ?? true);
        $result['sort_order'] = (int)($result['sort_order'] ?? 0);

        return $this->response->setJSON([
            'success' => true,
            'data' => (object)$result
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

    /**
     * Upload image file
     */
    public function uploadImage()
    {
        try {
            $file = $this->request->getFile('image');
            
            if (!$file) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'No file uploaded']);
            }
            
            if (!$file->isValid()) {
                $error = $file->getErrorString();
                log_message('error', 'SuccessStories::uploadImage - File invalid: ' . $error);
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Invalid file: ' . $error]);
            }

            // Validate file type (JPEG, PNG, WEBP only)
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
            
            $mimeType = $file->getMimeType();
            $extension = strtolower(pathinfo($file->getName(), PATHINFO_EXTENSION));
            
            if (!in_array($mimeType, $allowedTypes) && !in_array($extension, $allowedExtensions)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Invalid file type. Only JPEG, PNG, and WEBP images are allowed.']);
            }

            // Validate file size (max 850KB)
            if ($file->getSize() > 850 * 1024) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'File size exceeds 850KB limit']);
            }

            // Generate unique filename
            $originalName = $file->getName();
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);
            if (empty($extension)) {
                // Fallback: try to get extension from MIME type
                $mimeType = $file->getMimeType();
                $mimeToExt = [
                    'image/jpeg' => 'jpg',
                    'image/jpg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                    'image/webp' => 'webp'
                ];
                $extension = $mimeToExt[$mimeType] ?? 'jpg';
            }
            $baseName = pathinfo($originalName, PATHINFO_FILENAME);
            // Sanitize base name
            $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $baseName);
            $newName = 'success_story_' . $baseName . '_' . time() . '.' . $extension;
            
            // Move file to public/img directory
            $uploadPath = FCPATH . 'img' . DIRECTORY_SEPARATOR;
            
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            if (!$file->hasMoved()) {
                if ($file->move($uploadPath, $newName)) {
                    log_message('error', 'SuccessStories::uploadImage - File moved successfully: ' . $newName);
                    return $this->response->setJSON([
                        'success' => true,
                        'filename' => $newName,
                        'url' => base_url('img/' . $newName),
                        'message' => 'Image uploaded successfully'
                    ]);
                } else {
                    $errors = $file->getErrors();
                    log_message('error', 'SuccessStories::uploadImage - Move failed: ' . json_encode($errors));
                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON(['error' => 'Failed to move uploaded file']);
                }
            } else {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'File already moved']);
            }
        } catch (\Throwable $e) {
            log_message('error', 'Error in SuccessStories::uploadImage: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }
}

