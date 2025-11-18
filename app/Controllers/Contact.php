<?php

namespace App\Controllers;

class Contact extends BaseController
{
    public function index(): string
    {
        $data = [
            'title' => 'UNNATVA | Contact Us',
            'bodyClass' => 'act_contact'
        ];
        
        return view('contact/index', $data);
    }
}

