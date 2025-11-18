<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class JobListingsSeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();

        // Check if jobs already exist
        $existingJobs = $db->table('job_listings')->countAllResults();
        if ($existingJobs > 0) {
            echo "Job listings already exist. Skipping seed.\n";
            return;
        }

        $jobs = [
            [
                'title' => 'Content Writer',
                'description' => 'We are looking for creative content writer to join our team!',
                'location' => 'Nashik',
                'experience' => '3 years experience',
                'category' => 'Content & Marketing',
                'is_active' => 1,
                'sort_order' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Entrepreneurship Program Coordinator',
                'description' => 'Includes Traveling Across Gujarat & Maharashtra',
                'location' => 'Nashik',
                'experience' => '3 years experience',
                'category' => 'MBA, MSW Preferred',
                'is_active' => 1,
                'sort_order' => 2,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Women Empowerment Program Coordinator',
                'description' => 'Includes Traveling Across Maharashtra & Karnataka',
                'location' => 'Nashik',
                'experience' => '3 years experience',
                'category' => 'MSW Preferred',
                'is_active' => 1,
                'sort_order' => 3,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Government Partnership Executive',
                'description' => 'Includes Traveling across Mumbai & Delhi',
                'location' => 'Nashik',
                'experience' => '3 years experience',
                'category' => 'MSW, MBA Preferred',
                'is_active' => 1,
                'sort_order' => 4,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ];

        foreach ($jobs as $job) {
            $db->table('job_listings')->insert($job);
        }

        echo "✓ Created " . count($jobs) . " job listings\n";
    }
}

