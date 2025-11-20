<?php

namespace App\Controllers;

class Media extends BaseController
{
    public function index(): string
    {
        // Get categories for the media gallery
        $mediaModel = new \App\Models\MediaItemModel();
        $categories = $mediaModel->select('category')
            ->distinct()
            ->where('category IS NOT NULL')
            ->where('category !=', '')
            ->orderBy('category', 'ASC')
            ->findAll();
        
        $categoryList = array_map(function($item) {
            return $item->category;
        }, $categories);
        
        $data = [
            'title' => 'UNNATVA | Media',
            'bodyClass' => 'act_media',
            'categories' => $categoryList
        ];
        
        return view('media/index', $data);
    }
}

