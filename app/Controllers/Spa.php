<?php

namespace App\Controllers;

/**
 * SPA Controller
 * Serves the base HTML template for React SPA
 */
class Spa extends BaseController
{
    public function index(): string
    {
        $data = [
            'title' => 'UNNATVA Foundation'
        ];
        
        return view('spa/index', $data);
    }
}

