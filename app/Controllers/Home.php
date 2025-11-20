<?php

namespace App\Controllers;

use App\Models\CarouselSlideModel;
use App\Models\ImpactStatModel;
use App\Models\ContentBlockModel;

class Home extends BaseController
{
    protected $carouselSlideModel;
    protected $impactStatModel;
    protected $contentBlockModel;

    public function __construct()
    {
        $this->carouselSlideModel = new CarouselSlideModel();
        $this->impactStatModel = new ImpactStatModel();
        $this->contentBlockModel = new ContentBlockModel();
    }

    public function index(): string
    {
        
        // Fetch carousel slides from database
        $carouselSlidesData = $this->carouselSlideModel->getActive();
        $carouselSlides = [];
        
        // Debug logging
        log_message('error', 'Home::index - Found ' . count($carouselSlidesData) . ' active carousel slides');
        
        foreach ($carouselSlidesData as $slide) {
            // Handle highlighted_words - ensure it's an array
            $highlightedWords = [];
            if (isset($slide->highlighted_words)) {
                if (is_string($slide->highlighted_words)) {
                    $decoded = json_decode($slide->highlighted_words, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $highlightedWords = $decoded;
                    } else {
                        // If not JSON, treat as comma-separated string
                        $highlightedWords = array_filter(array_map('trim', explode(',', $slide->highlighted_words)));
                    }
                } elseif (is_array($slide->highlighted_words)) {
                    $highlightedWords = $slide->highlighted_words;
                }
            }
            
            $carouselSlides[] = [
                'heading' => $slide->heading ?? '',
                'highlightedWords' => $highlightedWords,
                'image' => $slide->image ?? ''
            ];
            
            log_message('error', 'Home::index - Slide: ' . ($slide->heading ?? 'no heading') . ', Image: ' . ($slide->image ?? 'no image') . ', Highlighted words: ' . json_encode($highlightedWords));
        }
        
        log_message('error', 'Home::index - Final carousel slides array: ' . json_encode($carouselSlides));

        // Fetch impact stats from database
        $impactStatsData = $this->impactStatModel->getActive();
        $impactStats = [];
        foreach ($impactStatsData as $stat) {
            $impactStats[] = [
                'value' => $stat->value,
                'suffix' => $stat->suffix ?? '',
                'text' => $stat->text,
                'bg' => $stat->bg ?? ''
            ];
        }

        // Fetch "What's Happening" content blocks from database
        $whatsHappeningBlocks = $this->contentBlockModel->getByType('whats-happening');
        
        // Debug logging
        log_message('error', 'Home::index - Found ' . count($whatsHappeningBlocks) . ' whats-happening blocks');
        if (!empty($whatsHappeningBlocks)) {
            foreach ($whatsHappeningBlocks as $block) {
                log_message('error', 'Home::index - Block: ' . ($block->title ?? 'no title') . ', Image: ' . ($block->image ?? 'no image'));
            }
        }

        $data = [
            'title' => 'UNNATVA',
            'bodyClass' => 'act_home',
            'carouselSlides' => $carouselSlides,
            'impactStats' => $impactStats,
            'whatsHappeningBlocks' => $whatsHappeningBlocks
        ];
        
        return view('home/index', $data);
    }
}

