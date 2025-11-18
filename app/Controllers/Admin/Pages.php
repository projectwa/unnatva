<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\PageModel;

class Pages extends BaseController
{
    protected $pageModel;

    public function __construct()
    {
        $this->pageModel = new PageModel();
    }

    /**
     * List all pages
     */
    public function index()
    {
        $pages = $this->pageModel->orderBy('sort_order', 'ASC')->findAll();
        
        return $this->response->setJSON([
            'success' => true,
            'data' => $pages
        ]);
    }

    /**
     * Get single page
     */
    public function show($id)
    {
        $page = $this->pageModel->find($id);
        
        if (!$page) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Page not found']);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => $page
        ]);
    }

    /**
     * Create new page
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$this->pageModel->insert($data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->pageModel->errors()
                ]);
        }

        return $this->response
            ->setStatusCode(201)
            ->setJSON([
                'success' => true,
                'message' => 'Page created successfully',
                'data' => $this->pageModel->find($this->pageModel->getInsertID())
            ]);
    }

    /**
     * Update page
     */
    public function update($id)
    {
        $page = $this->pageModel->find($id);
        
        if (!$page) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Page not found']);
        }

        $data = $this->request->getJSON(true);

        if (!$this->pageModel->update($id, $data)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'error' => 'Validation failed',
                    'errors' => $this->pageModel->errors()
                ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Page updated successfully',
            'data' => $this->pageModel->find($id)
        ]);
    }

    /**
     * Delete page
     */
    public function delete($id)
    {
        $page = $this->pageModel->find($id);
        
        if (!$page) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Page not found']);
        }

        $this->pageModel->delete($id);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Page deleted successfully'
        ]);
    }
}



