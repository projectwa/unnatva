<?php

namespace App\Controllers;

class SuccessStories extends BaseController
{
    public function index(): string
    {
        $data = [
            'title' => 'UNNATVA | Success Story',
            'bodyClass' => 'act_successStory'
        ];
        
        return view('success-stories/index', $data);
    }
}

