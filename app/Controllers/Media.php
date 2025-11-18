<?php

namespace App\Controllers;

class Media extends BaseController
{
    public function index(): string
    {
        $data = [
            'title' => 'UNNATVA | Media',
            'bodyClass' => ''
        ];
        
        return view('media/index', $data);
    }
}

