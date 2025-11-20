<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\SuccessStoryModel;

/**
 * Public API controller for success stories
 * No authentication required
 */
class SuccessStories extends BaseController
{
    protected $storiesModel;

    public function __construct()
    {
        $this->storiesModel = new SuccessStoryModel();
    }

    /**
     * Get all published success stories (public endpoint - no auth required)
     */
    public function index()
    {
        try {
            $category = $this->request->getGet('category');
            
            // Use builder to get raw data and handle metadata manually
            $builder = $this->storiesModel->builder();
            
            // Only get published stories
            $builder->where('is_published', 1);
            
            // Apply category filter if provided
            if (!empty($category)) {
                $builder->where('category', $category);
            }
            
            $results = $builder->orderBy('sort_order', 'ASC')
                              ->orderBy('created_at', 'DESC')
                              ->get()
                              ->getResultArray();
            
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
                
                $stories[] = $row;
            }
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $stories
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Api\SuccessStories::index: ' . $e->getMessage());
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
     * Get single published story by slug (public endpoint - no auth required)
     */
    public function getBySlug($slug)
    {
        try {
            $story = $this->storiesModel->getBySlug($slug);
            
            if (!$story) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Story not found']);
            }
            
            // Handle metadata if present
            if (!empty($story->metadata) && is_string($story->metadata)) {
                try {
                    $decoded = json_decode($story->metadata, true);
                    if (is_string($decoded)) {
                        $decoded = json_decode($decoded, true);
                    }
                    $story->metadata = $decoded ?: null;
                } catch (\Exception $e) {
                    $story->metadata = null;
                }
            }
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $story
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Api\SuccessStories::getBySlug: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }
}

