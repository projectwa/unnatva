<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class InitialContentSeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();

        // 1. Create default admin user
        $this->createAdminUser($db);

        // 2. Create pages
        $this->createPages($db);

        // 3. Create carousel slides
        $this->createCarouselSlides($db);

        // 4. Create impact stats
        $this->createImpactStats($db);

        // 5. Create content blocks (What's Happening)
        $this->createContentBlocks($db);

        // 6. Create success stories
        $this->createSuccessStories($db);

        // 7. Create default settings
        $this->createSettings($db);
    }

    private function createAdminUser($db)
    {
        // Default password: admin123 (should be changed after first login)
        $password = password_hash('admin123', PASSWORD_DEFAULT);

        $data = [
            'username'   => 'admin',
            'email'      => 'admin@unnatva.org',
            'password'   => $password,
            'full_name'  => 'Administrator',
            'role'       => 'admin',
            'is_active'  => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        $db->table('users')->insert($data);
        echo "✓ Created admin user (username: admin, password: admin123)\n";
    }

    private function createPages($db)
    {
        $pages = [
            [
                'slug'             => 'home',
                'title'            => 'UNNATVA Foundation',
                'meta_title'       => 'UNNATVA Foundation - Empowering Communities Across India',
                'meta_description' => 'UNNATVA Foundation empowers underserved communities across India through sustainable livelihood initiatives, entrepreneurship development, and skill training programs.',
                'meta_keywords'    => 'NGO India, skill development, entrepreneurship training, women empowerment, education, UNNATVA Foundation',
                'body_class'       => 'act_home',
                'content'          => null, // Content is stored in view files, will be managed via CMS
                'is_published'     => 1,
                'sort_order'       => 1,
            ],
            [
                'slug'             => 'about',
                'title'            => 'About Us - UNNATVA',
                'meta_title'       => 'About Us - UNNATVA Foundation',
                'meta_description' => 'Learn about UNNATVA Foundation, our mission, and our impact across India.',
                'meta_keywords'    => 'about UNNATVA, NGO India, our mission',
                'body_class'       => 'act_about',
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 2,
            ],
            [
                'slug'             => 'contact',
                'title'            => 'Contact Us - UNNATVA',
                'meta_title'       => 'Contact Us - UNNATVA Foundation',
                'meta_description' => 'Get in touch with UNNATVA Foundation. Contact us for partnerships, inquiries, or support.',
                'meta_keywords'    => 'contact UNNATVA, NGO contact',
                'body_class'       => 'act_contact',
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 3,
            ],
            [
                'slug'             => 'impact',
                'title'            => 'Our Impact - UNNATVA',
                'meta_title'       => 'Our Impact - UNNATVA Foundation',
                'meta_description' => 'See the impact UNNATVA Foundation has made across India through our programs.',
                'meta_keywords'    => 'UNNATVA impact, NGO impact India',
                'body_class'       => 'act_impact',
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 4,
            ],
            [
                'slug'             => 'success-stories',
                'title'            => 'Success Stories - UNNATVA',
                'meta_title'       => 'Success Stories - UNNATVA Foundation',
                'meta_description' => 'Read inspiring success stories from our beneficiaries.',
                'meta_keywords'    => 'success stories, UNNATVA beneficiaries',
                'body_class'       => 'act_successStory',
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 5,
            ],
            [
                'slug'             => 'media',
                'title'            => 'Media - UNNATVA',
                'meta_title'       => 'Media Gallery - UNNATVA Foundation',
                'meta_description' => 'Browse our media gallery showcasing our programs and events.',
                'meta_keywords'    => 'UNNATVA media, NGO photos, program photos',
                'body_class'       => 'act_media',
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 6,
            ],
            [
                'slug'             => 'privacy-policy',
                'title'            => 'Privacy Policy - UNNATVA',
                'meta_title'       => 'Privacy Policy - UNNATVA Foundation',
                'meta_description' => 'Privacy Policy of UNNATVA Foundation',
                'meta_keywords'    => 'privacy policy, UNNATVA',
                'body_class'       => null,
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 7,
            ],
            [
                'slug'             => 'entrepreneurship-development',
                'title'            => 'Entrepreneurship Development - UNNATVA',
                'meta_title'       => 'Entrepreneurship Development Program - UNNATVA',
                'meta_description' => 'Learn about our Entrepreneurship Development program.',
                'meta_keywords'    => 'entrepreneurship training, business development',
                'body_class'       => 'act_ourInitiatives',
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 8,
            ],
            [
                'slug'             => 'skill-development',
                'title'            => 'Skill Development - UNNATVA',
                'meta_title'       => 'Skill Development Program - UNNATVA',
                'meta_description' => 'Learn about our Skill Development program.',
                'meta_keywords'    => 'skill training, vocational training',
                'body_class'       => 'act_ourInitiatives',
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 9,
            ],
            [
                'slug'             => 'education',
                'title'            => 'Education - UNNATVA',
                'meta_title'       => 'Education Program - UNNATVA',
                'meta_description' => 'Learn about our Education program.',
                'meta_keywords'    => 'education, learning programs',
                'body_class'       => 'act_ourInitiatives',
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 10,
            ],
            [
                'slug'             => 'women-empowerment',
                'title'            => 'Women Empowerment - UNNATVA',
                'meta_title'       => 'Women Empowerment Program - UNNATVA',
                'meta_description' => 'Learn about our Women Empowerment program.',
                'meta_keywords'    => 'women empowerment, women training',
                'body_class'       => 'act_ourInitiatives',
                'content'          => null,
                'is_published'     => 1,
                'sort_order'       => 11,
            ],
        ];

        foreach ($pages as $page) {
            $page['created_at'] = date('Y-m-d H:i:s');
            $page['updated_at'] = date('Y-m-d H:i:s');
            $db->table('pages')->insert($page);
        }

        echo "✓ Created " . count($pages) . " pages\n";
    }

    private function createCarouselSlides($db)
    {
        $slides = [
            [
                'heading'          => "Partner with Us to Empower Tomorrow's Changemakers",
                'highlighted_words' => json_encode(['Changemakers']),
                'image'             => 'banner-slider-1.png',
                'link'              => null,
                'is_active'         => 1,
                'sort_order'        => 1,
            ],
            [
                'heading'          => "Empower Entrepreneurs to Create and Lead",
                'highlighted_words' => json_encode(['Entrepreneurs']),
                'image'             => 'banner-slider-2.png',
                'link'              => null,
                'is_active'         => 1,
                'sort_order'        => 2,
            ],
            [
                'heading'          => "Empower Youth with Job-Ready Skills",
                'highlighted_words' => json_encode(['Youth']),
                'image'             => 'banner-slider-3.png',
                'link'              => null,
                'is_active'         => 1,
                'sort_order'        => 3,
            ],
            [
                'heading'          => "Empower Women to Rise and Inspire",
                'highlighted_words' => json_encode(['Women']),
                'image'             => 'banner-slider-4.png',
                'link'              => null,
                'is_active'         => 1,
                'sort_order'        => 4,
            ],
            [
                'heading'          => "Empower Students with Skills for Equal Opportunity",
                'highlighted_words' => json_encode(['Students']),
                'image'             => 'banner-slider-5.png',
                'link'              => null,
                'is_active'         => 1,
                'sort_order'        => 5,
            ],
        ];

        foreach ($slides as $slide) {
            $slide['created_at'] = date('Y-m-d H:i:s');
            $slide['updated_at'] = date('Y-m-d H:i:s');
            $db->table('carousel_slides')->insert($slide);
        }

        echo "✓ Created " . count($slides) . " carousel slides\n";
    }

    private function createImpactStats($db)
    {
        $stats = [
            [
                'value'      => '4519',
                'suffix'     => '+',
                'text'       => 'Beneficiaries Impacted',
                'bg'         => 'counter-bg-1.svg',
                'is_active'  => 1,
                'sort_order' => 1,
            ],
            [
                'value'      => '67.78',
                'suffix'     => '',
                'text'       => 'Cr. Total Income Generated',
                'bg'         => 'counter-bg-2.svg',
                'is_active'  => 1,
                'sort_order' => 2,
            ],
            [
                'value'      => '1653',
                'suffix'     => '',
                'text'       => 'Women Trained',
                'bg'         => 'counter-bg-1.svg',
                'is_active'  => 1,
                'sort_order' => 3,
            ],
            [
                'value'      => '84',
                'suffix'     => '%',
                'text'       => 'Employment Success',
                'bg'         => 'counter-bg-2.svg',
                'is_active'  => 1,
                'sort_order' => 4,
            ],
        ];

        foreach ($stats as $stat) {
            $stat['created_at'] = date('Y-m-d H:i:s');
            $stat['updated_at'] = date('Y-m-d H:i:s');
            $db->table('impact_stats')->insert($stat);
        }

        echo "✓ Created " . count($stats) . " impact stats\n";
    }

    private function createContentBlocks($db)
    {
        $blocks = [
            [
                'block_type'   => 'whats-happening',
                'title'        => "I never imagined I could do this",
                'content'      => "These words from a young woman in rural Madhya Pradesh capture the heart of what skill development can truly achieve — confidence, independence. and a new trainning. Through our community-based skill development supported by India Foundation, youth from remote villages gained practical skills.........",
                'image'        => 'whats-happening-1.png',
                'video_url'    => 'https://www.youtube.com/embed/gWmoyzeYH6U?si=vH-TyYwpCSL1uyHf',
                'external_link' => null,
                'metadata'     => null,
                'is_active'    => 1,
                'sort_order'   => 1,
            ],
            [
                'block_type'   => 'whats-happening',
                'title'        => "Meet the Women Shaping India's Healthcare Support Systems",
                'content'      => "In many low-income households across India, girls are often raised with a singular focus: preparing for marriage, household responsibilities. and childcare. Education beyond the basics is rare. The idea of income generation, independence. or building a career is rarely encouraged, if not outright discouraged......",
                'image'        => 'whats-happening-2.png',
                'video_url'    => null,
                'external_link' => 'https://www.linkedin.com/feed/update/urn:li:activity:7347947151823405058',
                'metadata'     => null,
                'is_active'    => 1,
                'sort_order'   => 2,
            ],
            [
                'block_type'   => 'whats-happening',
                'title'        => "What Does Empowerment Look Like?",
                'content'      => "As proud partners of Swades Foundation, we celebrate the resilience, hard work, and spirit of the people driving rural transformation at the heart of Maharashtra. Yes. income growth is important. but true empowerment is about choice, opportunity,..........",
                'image'        => 'whats-happening-3.png',
                'video_url'    => 'https://www.youtube.com/embed/ZoDt1aawKKY?si=eI6VHQFDUuwofShL',
                'external_link' => null,
                'metadata'     => null,
                'is_active'    => 1,
                'sort_order'   => 3,
            ],
        ];

        foreach ($blocks as $block) {
            $block['created_at'] = date('Y-m-d H:i:s');
            $block['updated_at'] = date('Y-m-d H:i:s');
            $db->table('content_blocks')->insert($block);
        }

        echo "✓ Created " . count($blocks) . " content blocks\n";
    }

    private function createSuccessStories($db)
    {
        $stories = [
            [
                'slug'                => 'swapnil-lande',
                'category'            => 'entrepreneurship-development',
                'name'                => 'Swapnil Lande',
                'quote'               => "The programme helped me understand the what, why, and how of business to make my dream into reality. Today, I am proud to have created livelihoods for more than 700 people through my franchise model and helped others to realise their business dreams.",
                'story'               => "Swapnil Lande from Nashik chose entrepreneurship over a corporate career, determined to create something of his own. In 2017, he joined Udyogwardhini's Entrepreneurship Development Programme, which gave him the skills and confidence to turn his idea into a reality. Starting with a single outlet, he built Graduate Chaha & Lassi, which has today expanded into a chain of more than 300 outlets across Maharashtra and Gujarat.\n\nHis venture has generated over 700 jobs, providing stable livelihoods to youth and families in urban and semi-urban areas. With an annual turnover of ₹3.5 crore, Swapnil's business is not just about serving tea and lassi—it is about inspiring others to pursue their dreams and proving that with the right guidance, persistence, and vision, one entrepreneur can empower thousands.",
                'image'               => 'swapnil-lande.webp',
                'place'               => 'Nashik, Maharashtra',
                'course'              => 'Entrepreneurship Development Programme',
                'profession'          => 'Owner of Graduate Chaha & Lassi',
                'turnover'            => 'Rs. 3.5 crore',
                'employment_generated' => '700+',
                'metadata'            => null,
                'is_featured'         => 1,
                'is_published'        => 1,
                'sort_order'          => 1,
            ],
            [
                'slug'                => 'yogita-jagdhane',
                'category'            => 'entrepreneurship-development',
                'name'                => 'Yogita Jagdhane',
                'quote'               => "This programme gave me hope when I needed it most, since then, my purpose has been to pass that hope on to others by guiding them towards financial security. Today, I am building the financial health and stability of 10,000 clients while empowering 300 employees who are a part of this journey with me.",
                'story'               => "Yogita Jagdhane, a single mother from Nandgaon, Nashik, had to leave behind a promising career in biotechnology when life took an unexpected turn. Struggling to rebuild, she joined Udyogwardhini's Entrepreneurship Development Programme in 2015, where mentorship and training helped her find the courage and skills to start over. Choosing the financial sector, Yogita launched her firm, True Policy, with a vision to provide fact-based insurance solutions.\n\nThrough persistence and belief, she grew her consultancy into a business with an annual turnover of ₹10 crore, serving 10,000+ clients in India and abroad. Today, she has created employment for over 300 people and is also a certified life coach, guiding others—especially women facing adversity—to embrace their potential and transform their lives.",
                'image'               => 'yogita-jagdhane.webp',
                'place'               => 'Nashik, Maharashtra',
                'course'              => 'Entrepreneurship Development Programme',
                'profession'          => 'Life Coach and Financial Consultant',
                'turnover'            => 'Rs. 10 crore',
                'employment_generated' => '300+',
                'metadata'            => null,
                'is_featured'         => 1,
                'is_published'        => 1,
                'sort_order'          => 2,
            ],
        ];

        foreach ($stories as $story) {
            $story['created_at'] = date('Y-m-d H:i:s');
            $story['updated_at'] = date('Y-m-d H:i:s');
            $db->table('success_stories')->insert($story);
        }

        echo "✓ Created " . count($stories) . " success stories (sample)\n";
        echo "  Note: More success stories can be added via CMS\n";
    }

    private function createSettings($db)
    {
        $settings = [
            [
                'key'         => 'site_name',
                'value'       => 'UNNATVA Foundation',
                'type'        => 'text',
                'group'       => 'general',
                'description' => 'Site name',
            ],
            [
                'key'         => 'site_tagline',
                'value'       => 'Empowering Communities Across India',
                'type'        => 'text',
                'group'       => 'general',
                'description' => 'Site tagline',
            ],
            [
                'key'         => 'contact_email',
                'value'       => 'info@unnatva.org',
                'type'        => 'text',
                'group'       => 'contact',
                'description' => 'Contact email address',
            ],
            [
                'key'         => 'contact_phone',
                'value'       => '',
                'type'        => 'text',
                'group'       => 'contact',
                'description' => 'Contact phone number',
            ],
            [
                'key'         => 'contact_address',
                'value'       => '',
                'type'        => 'text',
                'group'       => 'contact',
                'description' => 'Contact address',
            ],
            [
                'key'         => 'facebook_url',
                'value'       => '',
                'type'        => 'text',
                'group'       => 'social',
                'description' => 'Facebook page URL',
            ],
            [
                'key'         => 'twitter_url',
                'value'       => '',
                'type'        => 'text',
                'group'       => 'social',
                'description' => 'Twitter profile URL',
            ],
            [
                'key'         => 'linkedin_url',
                'value'       => '',
                'type'        => 'text',
                'group'       => 'social',
                'description' => 'LinkedIn profile URL',
            ],
            [
                'key'         => 'instagram_url',
                'value'       => '',
                'type'        => 'text',
                'group'       => 'social',
                'description' => 'Instagram profile URL',
            ],
        ];

        foreach ($settings as $setting) {
            $setting['updated_at'] = date('Y-m-d H:i:s');
            $db->table('settings')->insert($setting);
        }

        echo "✓ Created " . count($settings) . " settings\n";
    }
}

