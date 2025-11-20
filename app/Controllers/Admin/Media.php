<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\MediaItemModel;
use App\Models\MediaCategoryModel;

class Media extends BaseController
{
    protected $mediaModel;
    protected $categoryModel;

    public function __construct()
    {
        $this->mediaModel = new MediaItemModel();
        $this->categoryModel = new MediaCategoryModel();
    }

    /**
     * List all media items
     */
    public function index()
    {
        try {
            $category = $this->request->getGet('category');
            
            $query = $this->mediaModel->orderBy('created_at', 'DESC');
            
            if ($category && $category !== 'all') {
                $query->where('category', $category);
            }
            
            $media = $query->findAll();
            
            // Get active categories from media_categories table
            $activeCategories = $this->categoryModel->getActive();
            $categoryList = array_map(function($item) {
                return $item->name;
            }, $activeCategories);
            
            // Also include categories from media_items that might not be in media_categories yet
            // This ensures backward compatibility during migration
            $mediaCategories = $this->mediaModel->select('category')
                ->distinct()
                ->where('category IS NOT NULL')
                ->where('category !=', '')
                ->findAll();
            
            $mediaCategoryNames = array_map(function($item) {
                return $item->category;
            }, $mediaCategories);
            
            // Merge and deduplicate
            $categoryList = array_unique(array_merge($categoryList, $mediaCategoryNames));
            sort($categoryList);
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $media,
                'categories' => $categoryList
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
        try {
            $media = $this->mediaModel->find($id);
            
            if (!$media) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Media item not found']);
            }

            // Delete physical file if it exists
            if (!empty($media->file_path)) {
                // Construct full file path
                // file_path is stored as 'media/filename.webp' or similar
                $filePath = FCPATH . 'img/' . $media->file_path;
                
                // Normalize path separators for Windows
                $filePath = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $filePath);
                
                // Check if file exists and delete it
                if (file_exists($filePath) && is_file($filePath)) {
                    if (@unlink($filePath)) {
                        log_message('info', "Media::delete - Deleted file: {$filePath}");
                    } else {
                        log_message('warning', "Media::delete - Failed to delete file: {$filePath}");
                    }
                } else {
                    log_message('warning', "Media::delete - File not found: {$filePath}");
                }
            }

            // Delete database record
            $this->mediaModel->delete($id);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Media item deleted successfully'
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Media::delete: ' . $e->getMessage());
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
     * Upload multiple images
     */
    public function uploadMultiple()
    {
        try {
            $category = $this->request->getPost('category');
            $files = $this->request->getFiles();
            
            // Log for debugging
            log_message('error', 'Media::uploadMultiple - All files keys: ' . json_encode(array_keys($files)));
            
            if (empty($files)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'No files uploaded']);
            }

            $uploadedFiles = [];
            $errors = [];
            
            // Get multiple files using CodeIgniter's getFileMultiple method
            // This handles 'images[]' format from FormData
            $imageFiles = $this->request->getFileMultiple('images');
            
            // If getFileMultiple returns empty, try alternative methods
            if (empty($imageFiles)) {
                // Check if files are in the files array directly
                if (isset($files['images']) && is_array($files['images'])) {
                    $imageFiles = $files['images'];
                } elseif (isset($files['images'])) {
                    // Single file
                    $imageFiles = [$files['images']];
                } else {
                    // Log available keys for debugging
                    log_message('error', 'Media::uploadMultiple - No files found. Available keys: ' . json_encode(array_keys($files)));
                    return $this->response
                        ->setStatusCode(400)
                        ->setJSON(['error' => 'No image files found in upload']);
                }
            }

            foreach ($imageFiles as $file) {
                // Check if file object is valid
                if (!$file || !($file instanceof \CodeIgniter\Files\File)) {
                    $errors[] = 'Invalid file object received';
                    log_message('error', 'Media::uploadMultiple - Invalid file object: ' . gettype($file));
                    continue;
                }
                
                if (!$file->isValid()) {
                    $errors[] = $file->getName() . ': ' . $file->getErrorString();
                    continue;
                }

                // Validate file type (jpeg, png, webp only)
                $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                
                $originalName = $file->getName();
                $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
                $mimeType = $file->getMimeType();
                
                if (!in_array($extension, $allowedExtensions) || !in_array($mimeType, $allowedTypes)) {
                    $errors[] = $originalName . ': Invalid file type. Only JPEG, PNG, and WEBP images are allowed.';
                    continue;
                }

                // Validate file size (max 850KB)
                if ($file->getSize() > 850 * 1024) {
                    $errors[] = $originalName . ': File size exceeds 850KB limit.';
                    continue;
                }

                // Generate unique filename manually
                $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
                $newName = uniqid('img_', true) . '.' . $extension;
                $uploadPath = FCPATH . 'img/media/';
                
                // Create directory if it doesn't exist
                if (!is_dir($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }

                // Move file
                if ($file->move($uploadPath, $newName)) {
                    $filePath = 'media/' . $newName;
                    
                    // Get image dimensions
                    $imageInfo = @getimagesize($uploadPath . $newName);
                    $width = $imageInfo ? $imageInfo[0] : null;
                    $height = $imageInfo ? $imageInfo[1] : null;
                    
                    // Create media item record
                    $mediaData = [
                        'filename' => $newName,
                        'original_filename' => $originalName,
                        'file_path' => $filePath,
                        'file_type' => 'image',
                        'mime_type' => $mimeType,
                        'file_size' => $file->getSize(),
                        'width' => $width,
                        'height' => $height,
                        'category' => $category ?: null,
                    ];
                    
                    if ($this->mediaModel->insert($mediaData)) {
                        $uploadedFiles[] = $this->mediaModel->find($this->mediaModel->getInsertID());
                    } else {
                        $dbErrors = $this->mediaModel->errors();
                        $errorMsg = $originalName . ': Failed to save to database.';
                        if (!empty($dbErrors)) {
                            $errorMsg .= ' ' . json_encode($dbErrors);
                        }
                        $errors[] = $errorMsg;
                        log_message('error', 'Media::uploadMultiple - Database insert failed: ' . json_encode($dbErrors));
                        // Delete uploaded file if database insert failed
                        @unlink($uploadPath . $newName);
                    }
                } else {
                    $errors[] = $originalName . ': Failed to upload file.';
                }
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => count($uploadedFiles) . ' file(s) uploaded successfully',
                'data' => $uploadedFiles,
                'errors' => $errors
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Media::uploadMultiple: ' . $e->getMessage());
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
     * Update caption and alt text only
     */
    public function updateCaptionAlt($id)
    {
        try {
            $media = $this->mediaModel->find($id);
            
            if (!$media) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Media item not found']);
            }

            $data = $this->request->getJSON(true);
            
            // Only allow updating caption and alt_text
            $updateData = [];
            if (isset($data['caption'])) {
                $updateData['caption'] = $data['caption'];
            }
            if (isset($data['alt_text'])) {
                $updateData['alt_text'] = $data['alt_text'];
            }

            if (empty($updateData)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'No valid fields to update']);
            }

            if (!$this->mediaModel->update($id, $updateData)) {
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
        } catch (\Throwable $e) {
            log_message('error', 'Error in Media::updateCaptionAlt: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }
}

