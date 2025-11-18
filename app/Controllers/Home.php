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
        foreach ($carouselSlidesData as $slide) {
            $carouselSlides[] = [
                'heading' => $slide->heading,
                'highlightedWords' => $slide->highlighted_words ?? [],
                'image' => $slide->image
            ];
        }

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

