<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CarouselSlideModel;
use App\Models\ImpactStatModel;
use App\Models\ContentBlockModel;
use App\Models\JobListingModel;

/**
 * API Controller for serving page content
 * Returns server-rendered HTML for React SPA to inject
 */
class Pages extends BaseController
{
    protected $carouselSlideModel;
    protected $impactStatModel;
    protected $contentBlockModel;
    protected $jobListingModel;

    public function __construct()
    {
        $this->carouselSlideModel = new CarouselSlideModel();
        $this->impactStatModel = new ImpactStatModel();
        $this->contentBlockModel = new ContentBlockModel();
        $this->jobListingModel = new JobListingModel();
    }

    /**
     * Get home page content
     */
    public function getHomePage()
    {
        try {
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

            // Fetch "What's Happening" content blocks
            $whatsHappeningBlocks = $this->contentBlockModel->getByType('whats-happening');
        } catch (\Exception $e) {
            // If database error, use empty arrays
            log_message('error', 'Error fetching home page data: ' . $e->getMessage());
            $carouselSlides = [];
            $impactStats = [];
            $whatsHappeningBlocks = [];
        }

        $data = [
            'title' => 'UNNATVA',
            'bodyClass' => 'act_home',
            'carouselSlides' => $carouselSlides,
            'impactStats' => $impactStats,
            'whatsHappeningBlocks' => $whatsHappeningBlocks
        ];

        // Return server-rendered HTML (content only, no header/footer)
        $html = view('home/content', $data, ['saveData' => false]);

        return $this->response
            ->setContentType('text/html; charset=UTF-8')
            ->setBody($html);
    }

    /**
     * Get about page content
     */
    public function getAboutPage()
    {
        // Fetch active job listings
        $jobs = $this->jobListingModel->getActive();
        
        $data = [
            'title' => 'About Us - UNNATVA',
            'bodyClass' => 'act_about',
            'jobs' => $jobs
        ];

        $html = view('about/content', $data, ['saveData' => false]);

        return $this->response
            ->setContentType('text/html; charset=UTF-8')
            ->setBody($html);
    }

    /**
     * Get contact page content
     */
    public function getContactPage()
    {
        $data = [
            'title' => 'Contact Us - UNNATVA',
            'bodyClass' => 'act_contact'
        ];

        $html = view('contact/content', $data, ['saveData' => false]);

        return $this->response
            ->setContentType('text/html; charset=UTF-8')
            ->setBody($html);
    }

    /**
     * Get impact page content
     */
    public function getImpactPage()
    {
        $data = [
            'title' => 'Our Impact - UNNATVA',
            'bodyClass' => 'act_impact'
        ];

        $html = view('impact/content', $data, ['saveData' => false]);

        return $this->response
            ->setContentType('text/html; charset=UTF-8')
            ->setBody($html);
    }

    /**
     * Get success stories page content
     */
    public function getSuccessStoriesPage()
    {
        $data = [
            'title' => 'Success Stories - UNNATVA',
            'bodyClass' => 'act_successStory'
        ];

        $html = view('success-stories/content', $data, ['saveData' => false]);

        return $this->response
            ->setContentType('text/html; charset=UTF-8')
            ->setBody($html);
    }

    /**
     * Get initiatives page content
     */
    public function getInitiativesPage(string $type)
    {
        $data = [
            'title' => ucfirst(str_replace('-', ' ', $type)) . ' - UNNATVA',
            'bodyClass' => 'act_ourInitiatives'
        ];

        $viewMap = [
            'entrepreneurship-development' => 'entrepreneurship',
            'skill-development' => 'skill',
            'education' => 'education',
            'women-empowerment' => 'women'
        ];

        $viewName = $viewMap[$type] ?? 'entrepreneurship';
        
        // Use content-only view (no header/footer)
        // Try nested path first: initiatives/{viewName}/content
        // Fallback to flat path: initiatives/{viewName}-content
        $contentViewNested = "initiatives/{$viewName}/content";
        $contentViewFlat = "initiatives/{$viewName}-content";
        
        try {
            // Get renderer service
            $renderer = \Config\Services::renderer();
            
            // Try nested path first (preferred)
            $viewPathNested = APPPATH . 'Views/' . str_replace('/', DIRECTORY_SEPARATOR, $contentViewNested) . '.php';
            $viewPathFlat = APPPATH . 'Views/' . str_replace('/', DIRECTORY_SEPARATOR, $contentViewFlat) . '.php';
            
            if (file_exists($viewPathNested)) {
                $html = view($contentViewNested, $data, ['saveData' => false]);
            } 
            // Fallback to flat path
            elseif (file_exists($viewPathFlat)) {
                $html = view($contentViewFlat, $data, ['saveData' => false]);
            } 
            else {
                throw new \RuntimeException("View not found. Tried: {$contentViewNested} and {$contentViewFlat}");
            }
            
            // Ensure we have content
            if (empty(trim($html))) {
                throw new \RuntimeException("View returned empty content");
            }
        } catch (\Exception $e) {
            // Return error message if view rendering fails
            $html = '<div class="page-content" data-page="initiatives-' . $type . '">';
            $html .= '<div class="container py-6"><h1>Error Loading Content</h1>';
            $html .= '<p>Error: ' . esc($e->getMessage()) . '</p>';
            $html .= '<p>File: ' . esc($e->getFile()) . ' Line: ' . $e->getLine() . '</p>';
            $html .= '<p>Tried nested: ' . esc($contentViewNested) . '</p>';
            $html .= '<p>Tried flat: ' . esc($contentViewFlat) . '</p></div></div>';
        }

        return $this->response
            ->setContentType('text/html; charset=UTF-8')
            ->setBody($html);
    }

    /**
     * Get media page content
     */
    public function getMediaPage()
    {
        $data = [
            'title' => 'Media - UNNATVA',
            'bodyClass' => 'act_media'
        ];

        $html = view('media/content', $data, ['saveData' => false]);

        return $this->response
            ->setContentType('text/html; charset=UTF-8')
            ->setBody($html);
    }

    /**
     * Get privacy policy page content
     */
    public function getPrivacyPolicyPage()
    {
        $data = [
            'title' => 'Privacy Policy - UNNATVA',
            'bodyClass' => 'act_privacy'
        ];

        $html = view('privacy-policy/content', $data, ['saveData' => false]);

        return $this->response
            ->setContentType('text/html; charset=UTF-8')
            ->setBody($html);
    }
}

