<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;

class Index extends BaseController
{
    /**
     * Serve the React admin app
     */
    public function index()
    {
        try {
            // Set content type
            $this->response->setContentType('text/html; charset=UTF-8');
            
            // Load and return the view
            $html = view('admin/index');
            
            return $this->response->setBody($html);
        } catch (\Exception $e) {
            log_message('error', 'Error loading admin view: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setContentType('text/html; charset=UTF-8')
                ->setBody('<html><body><h1>Error Loading CMS</h1><p>' . htmlspecialchars($e->getMessage()) . '</p><p>Check server logs for details.</p></body></html>');
        }
    }
}

