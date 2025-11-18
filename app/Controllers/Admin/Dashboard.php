<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\PageModel;
use App\Models\CarouselSlideModel;
use App\Models\ImpactStatModel;
use App\Models\SuccessStoryModel;
use App\Models\MediaItemModel;
use App\Models\JobApplicationModel;

class Dashboard extends BaseController
{
    /**
     * Get dashboard statistics
     */
    public function stats()
    {
        $pageModel = new PageModel();
        $carouselModel = new CarouselSlideModel();
        $statsModel = new ImpactStatModel();
        $storiesModel = new SuccessStoryModel();
        $mediaModel = new MediaItemModel();
        $jobApplicationModel = new JobApplicationModel();

        // Get new applicants in last 7 days
        $sevenDaysAgo = date('Y-m-d H:i:s', strtotime('-7 days'));
        $newApplicantsCount = $jobApplicationModel
            ->where('created_at >=', $sevenDaysAgo)
            ->countAllResults();

        $stats = [
            'pages' => [
                'total' => $pageModel->countAllResults(),
                'published' => $pageModel->where('is_published', 1)->countAllResults(),
            ],
            'carousel_slides' => [
                'total' => $carouselModel->countAllResults(),
                'active' => $carouselModel->where('is_active', 1)->countAllResults(),
            ],
            'impact_stats' => [
                'total' => $statsModel->countAllResults(),
                'active' => $statsModel->where('is_active', 1)->countAllResults(),
            ],
            'success_stories' => [
                'total' => $storiesModel->countAllResults(),
                'published' => $storiesModel->where('is_published', 1)->countAllResults(),
            ],
            'media_items' => [
                'total' => $mediaModel->countAllResults(),
            ],
            'job_applications' => [
                'total' => $jobApplicationModel->countAllResults(),
                'new_last_7_days' => $newApplicantsCount,
            ],
        ];

        return $this->response->setJSON([
            'success' => true,
            'stats' => $stats
        ]);
    }
}



