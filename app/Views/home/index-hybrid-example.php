<?php
/**
 * Example: Home page with React components embedded
 * This shows how CI4 views will include React components
 * 
 * Note: This is an example file. The actual home/index.php will be updated similarly.
 */

// Carousel data (will come from controller)
$carouselSlides = [
    [
        'heading' => "Partner with Us to Empower Tomorrow's Changemakers",
        'highlightedWords' => ['Changemakers'],
        'image' => 'banner-slider-1.png'
    ],
    [
        'heading' => "Empower Entrepreneurs to Create and Lead",
        'highlightedWords' => ['Entrepreneurs'],
        'image' => 'banner-slider-2.png'
    ],
    [
        'heading' => "Empower Youth with Job-Ready Skills",
        'highlightedWords' => ['Youth'],
        'image' => 'banner-slider-3.png'
    ],
    [
        'heading' => "Empower Women to Rise and Inspire",
        'highlightedWords' => ['Women'],
        'image' => 'banner-slider-4.png'
    ],
    [
        'heading' => "Empower Students with Skills for Equal Opportunity",
        'highlightedWords' => ['Students'],
        'image' => 'banner-slider-5.png'
    ]
];

// Impact stats data (will come from controller)
$impactStats = [
    [
        'value' => '4519',
        'suffix' => '+',
        'text' => 'Beneficiaries Impacted',
        'bg' => 'counter-bg-1.svg'
    ],
    [
        'value' => '67.78',
        'suffix' => '',
        'text' => 'Cr. Total Income Generated',
        'bg' => 'counter-bg-2.svg'
    ],
    [
        'value' => '1653',
        'suffix' => '',
        'text' => 'Women Trained',
        'bg' => 'counter-bg-1.svg'
    ],
    [
        'value' => '84',
        'suffix' => '%',
        'text' => 'Employment Success',
        'bg' => 'counter-bg-2.svg'
    ]
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title><?= esc($title ?? 'UNNATVA') ?></title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta name="description" content="UNNATVA Foundation empowers underserved communities across India through sustainable livelihood initiatives, entrepreneurship development, and skill training programs.">
    <meta name="keywords" content="NGO India, skill development, entrepreneurship training, women empowerment, education, UNNATVA Foundation">
    <?= view('layouts/head') ?>
</head>

<body class="<?= esc($bodyClass ?? 'act_home') ?>">
    <?= view('layouts/header') ?>

    <!-- React Carousel Component Mounting Point -->
    <div id="home-carousel" data-slides='<?= json_encode($carouselSlides, JSON_HEX_APOS | JSON_HEX_QUOT) ?>'></div>

    <!-- About Start - Our Essence (Server-rendered HTML) -->
    <div class="container-xxl py-6" id="about">
        <div class="container">
            <div class="row g-5 align-items-center">
                <div class="col-lg-7">
                    <h4 class="mb-3 mb-lg-5">Our Essence</h4>
                    <p class="fw-bold mb-3 mb-lg-5">Unnatva, a fusion of Unnat, which means to elevate, and Tattva, the core principle, captures what we've always stood for:</p>
                    <p class="mb-0 lh-lg"><i class="bi bi-square-fill me-3"></i> That every individual carries within them the potential to rise.</p>
                    <p class="mb-0 lh-lg"><i class="bi bi-square-fill me-3"></i> That empowerment begins with recognizing each person's unique needs and aspirations.</p>
                    <p class="mb-0 lh-lg"><i class="bi bi-square-fill me-3"></i> And that with the right principles, the right environment, the right tattvas, transformation is not just possible; it's inevitable.</p>
                </div>
                <div class="col-lg-5 text-center">
                    <img class="img-fluid mb-4 mb-lg-0" src="<?= img_path('our-essence-img.png') ?>" alt="">
                </div>
            </div>
        </div>
    </div>
    <!-- About End -->

    <!-- More server-rendered content here... -->

    <!-- React Impact Counters Component Mounting Point -->
    <div id="impact-counters" data-stats='<?= json_encode($impactStats, JSON_HEX_APOS | JSON_HEX_QUOT) ?>'></div>

    <!-- More server-rendered content... -->

    <?= view('layouts/footer') ?>

    <!-- Load React and ReactDOM from CDN (or bundle them) -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Load React Bootstrap (if needed) -->
    <!-- <script src="https://unpkg.com/react-bootstrap@2/dist/react-bootstrap.min.js"></script> -->
    
    <!-- Load our React components -->
    <script src="<?= js_path('react/components/carousel.js') ?>"></script>
    <script src="<?= js_path('react/components/counters.js') ?>"></script>
</body>
</html>

