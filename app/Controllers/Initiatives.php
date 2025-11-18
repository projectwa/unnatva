<?php

namespace App\Controllers;

class Initiatives extends BaseController
{
    public function entrepreneurship(): string
    {
        $data = [
            'title' => 'UNNATVA | Entrepreneurship Development',
            'bodyClass' => 'act_ourInitiatives',
            'initiativeType' => 'entrepreneurship'
        ];
        
        return view('initiatives/entrepreneurship', $data);
    }
    
    public function skill(): string
    {
        $data = [
            'title' => 'UNNATVA | Skill Development',
            'bodyClass' => 'act_ourInitiatives',
            'initiativeType' => 'skill'
        ];
        
        return view('initiatives/skill', $data);
    }
    
    public function education(): string
    {
        $data = [
            'title' => 'UNNATVA | Education',
            'bodyClass' => 'act_ourInitiatives',
            'initiativeType' => 'education'
        ];
        
        return view('initiatives/education', $data);
    }
    
    public function women(): string
    {
        $data = [
            'title' => 'UNNATVA | Women Empowerment',
            'bodyClass' => 'act_ourInitiatives',
            'initiativeType' => 'women'
        ];
        
        return view('initiatives/women', $data);
    }
}

