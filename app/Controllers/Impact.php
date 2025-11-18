<?php

namespace App\Controllers;

class Impact extends BaseController
{
    public function index(): string
    {
        $data = [
            'title' => 'UNNATVA | Our Impact',
            'bodyClass' => 'act_impact'
        ];
        
        return view('impact/index', $data);
    }
}

