<?php

namespace App\Controllers;

use App\Models\JobListingModel;

class About extends BaseController
{
    protected $jobListingModel;

    public function __construct()
    {
        $this->jobListingModel = new JobListingModel();
    }

    public function index(): string
    {
        // Fetch active job listings
        $jobs = $this->jobListingModel->getActive();
        
        $data = [
            'title' => 'UNNATVA | About Us',
            'bodyClass' => 'act_about',
            'jobs' => $jobs
        ];
        
        return view('about/index', $data);
    }
}

