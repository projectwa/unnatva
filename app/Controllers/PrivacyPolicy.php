<?php

namespace App\Controllers;

class PrivacyPolicy extends BaseController
{
    public function index(): string
    {
        $data = [
            'title' => 'UNNATVA | Privacy Policy',
            'bodyClass' => 'act_contact'
        ];
        
        return view('privacy-policy/index', $data);
    }
}

