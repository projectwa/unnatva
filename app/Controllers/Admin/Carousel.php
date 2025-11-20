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
        try {
            $data = $this->request->getJSON(true);
            
            // Log received data for debugging
            log_message('error', 'Carousel::create - Received data: ' . json_encode($data));
            
            // Handle highlighted_words - ensure it's properly formatted
            if (isset($data['highlighted_words'])) {
                if (is_array($data['highlighted_words'])) {
                    // If it's already an array, keep it as is
                    // The model should handle JSON encoding if needed
                } elseif (is_string($data['highlighted_words'])) {
                    // If it's a string, try to decode it or convert to array
                    $decoded = json_decode($data['highlighted_words'], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $data['highlighted_words'] = $decoded;
                    } else {
                        // If not JSON, treat as comma-separated string
                        $data['highlighted_words'] = array_filter(array_map('trim', explode(',', $data['highlighted_words'])));
                    }
                }
            }

            if (!$this->carouselModel->insert($data)) {
                $errors = $this->carouselModel->errors();
                log_message('error', 'Carousel::create - Validation failed: ' . json_encode($errors));
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Validation failed',
                        'errors' => $errors
                    ]);
            }

            $insertId = $this->carouselModel->getInsertID();
            log_message('error', 'Carousel::create - Slide created with ID: ' . $insertId);

            return $this->response
                ->setStatusCode(201)
                ->setJSON([
                    'success' => true,
                    'message' => 'Slide created successfully',
                    'data' => $this->carouselModel->find($insertId)
                ]);
        } catch (\Throwable $e) {
            log_message('error', 'Carousel::create - Exception: ' . $e->getMessage());
            log_message('error', 'Carousel::create - Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]);
        }
    }

    /**
     * Update slide
     */
    public function update($id)
    {
        try {
            $slide = $this->carouselModel->find($id);
            
            if (!$slide) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Slide not found']);
            }

            $data = $this->request->getJSON(true);
            
            // Log received data for debugging
            log_message('error', 'Carousel::update - Received data: ' . json_encode($data));
            
            // Handle highlighted_words - ensure it's properly formatted
            if (isset($data['highlighted_words'])) {
                if (is_array($data['highlighted_words'])) {
                    // If it's already an array, keep it as is
                    // The model should handle JSON encoding if needed
                } elseif (is_string($data['highlighted_words'])) {
                    // If it's a string, try to decode it or convert to array
                    $decoded = json_decode($data['highlighted_words'], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $data['highlighted_words'] = $decoded;
                    } else {
                        // If not JSON, treat as comma-separated string
                        $data['highlighted_words'] = array_filter(array_map('trim', explode(',', $data['highlighted_words'])));
                    }
                }
            }

            if (!$this->carouselModel->update($id, $data)) {
                $errors = $this->carouselModel->errors();
                log_message('error', 'Carousel::update - Validation failed: ' . json_encode($errors));
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Validation failed',
                        'errors' => $errors
                    ]);
            }

            log_message('error', 'Carousel::update - Slide updated with ID: ' . $id);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Slide updated successfully',
                'data' => $this->carouselModel->find($id)
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Carousel::update - Exception: ' . $e->getMessage());
            log_message('error', 'Carousel::update - Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]);
        }
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
            // Log all uploaded files for debugging
            $files = $this->request->getFiles();
            log_message('error', 'Carousel::uploadImage - All files: ' . json_encode(array_keys($files)));
            log_message('error', 'Carousel::uploadImage - Request method: ' . $this->request->getMethod());
            log_message('error', 'Carousel::uploadImage - Content-Type: ' . $this->request->getHeaderLine('Content-Type'));
            
            $file = $this->request->getFile('image');
            
            if (!$file) {
                log_message('error', 'Carousel::uploadImage - No file found with key "image"');
                // Try alternative method
                $uploadedFiles = $this->request->getFiles();
                log_message('error', 'Carousel::uploadImage - Available file keys: ' . json_encode(array_keys($uploadedFiles)));
                
                // Try to get first file if 'image' key doesn't exist
                if (!empty($uploadedFiles)) {
                    $fileKeys = array_keys($uploadedFiles);
                    $file = $this->request->getFile($fileKeys[0]);
                    log_message('error', 'Carousel::uploadImage - Trying first file key: ' . $fileKeys[0]);
                }
                
                if (!$file) {
                    return $this->response
                        ->setStatusCode(400)
                        ->setJSON(['error' => 'No file uploaded']);
                }
            }
            
            if (!$file->isValid()) {
                $error = $file->getErrorString();
                log_message('error', 'Carousel::uploadImage - File invalid: ' . $error);
                log_message('error', 'Carousel::uploadImage - File errors: ' . json_encode($file->getErrors()));
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Invalid file: ' . $error]);
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

            // Validate file size (max 850KB)
            if ($file->getSize() > 850 * 1024) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'File size exceeds 850KB limit']);
            }

            // Validate image dimensions (912x921px)
            $imageInfo = @getimagesize($file->getTempName());
            if ($imageInfo === false) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Invalid image file']);
            }
            
            $width = $imageInfo[0];
            $height = $imageInfo[1];
            $requiredWidth = 912;
            $requiredHeight = 921;
            
            if ($width !== $requiredWidth || $height !== $requiredHeight) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => "Image dimensions must be exactly {$requiredWidth}x{$requiredHeight}px. Current: {$width}x{$height}px"
                    ]);
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
                // Ensure directory exists and is writable
                if (!is_dir($uploadPath)) {
                    if (!mkdir($uploadPath, 0755, true)) {
                        log_message('error', 'Carousel::uploadImage - Failed to create directory: ' . $uploadPath);
                        return $this->response
                            ->setStatusCode(500)
                            ->setJSON(['error' => 'Failed to create upload directory']);
                    }
                }
                
                if (!is_writable($uploadPath)) {
                    log_message('error', 'Carousel::uploadImage - Directory not writable: ' . $uploadPath);
                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON(['error' => 'Upload directory is not writable']);
                }
                
                if ($file->move($uploadPath, $newName)) {
                    $fullPath = $uploadPath . $newName;
                    log_message('error', 'Carousel::uploadImage - File moved successfully to: ' . $fullPath);
                    log_message('error', 'Carousel::uploadImage - File exists: ' . (file_exists($fullPath) ? 'YES' : 'NO'));
                    
                    return $this->response->setJSON([
                        'success' => true,
                        'filename' => $newName,
                        'url' => base_url('img/' . $newName),
                        'message' => 'Image uploaded successfully'
                    ]);
                } else {
                    $errors = $file->getErrors();
                    log_message('error', 'Carousel::uploadImage - Move failed. Errors: ' . json_encode($errors));
                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON([
                            'error' => 'Failed to save file',
                            'errors' => $errors
                        ]);
                }
            } else {
                log_message('error', 'Carousel::uploadImage - File already moved');
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



