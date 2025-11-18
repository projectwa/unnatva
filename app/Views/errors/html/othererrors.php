<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Error <?= esc($statusCode ?? 500) ?> - UNNATVA</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">
    <?= view('layouts/head') ?>
</head>

<body class="act_home">
    <?= view('layouts/header') ?>

    <!-- Error Section Start -->
    <div class="container-fluid py-6 wow fadeIn" data-wow-delay="0.1s">
        <div class="container">
            <div class="row justify-content-center align-items-center">
                <div class="col-lg-8 text-center">
                    <!-- Error Icon/Image -->
                    <div class="mb-4">
                        <h1 class="display-1 text-primary" style="font-size: 120px; font-weight: 700;"><?= esc($statusCode ?? 500) ?></h1>
                    </div>
                    
                    <!-- Error Message -->
                    <h2 class="mb-4"><?= esc($errorTitle ?? 'An Error Occurred') ?></h2>
                    <p class="mb-4" style="font-size: 18px; color: #333;">
                        <?= esc($errorMessage ?? 'We encountered an issue while processing your request. Please try again later.') ?>
                    </p>
                    
                    <!-- Useful Links -->
                    <div class="row g-3 mt-4">
                        <div class="col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <h5 class="card-title text-primary mb-3">
                                        <i class="bi bi-house-door me-2"></i>Main Pages
                                    </h5>
                                    <ul class="list-unstyled mb-0">
                                        <li class="mb-2">
                                            <a href="<?= base_url() ?>" class="text-dark text-decoration-none">
                                                <i class="bi bi-arrow-right me-2"></i>Home
                                            </a>
                                        </li>
                                        <li class="mb-2">
                                            <a href="<?= base_url('about') ?>" class="text-dark text-decoration-none">
                                                <i class="bi bi-arrow-right me-2"></i>About Us
                                            </a>
                                        </li>
                                        <li class="mb-2">
                                            <a href="<?= base_url('impact') ?>" class="text-dark text-decoration-none">
                                                <i class="bi bi-arrow-right me-2"></i>Our Impact
                                            </a>
                                        </li>
                                        <li class="mb-2">
                                            <a href="<?= base_url('contact') ?>" class="text-dark text-decoration-none">
                                                <i class="bi bi-arrow-right me-2"></i>Contact Us
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <h5 class="card-title text-primary mb-3">
                                        <i class="bi bi-lightbulb me-2"></i>Our Initiatives
                                    </h5>
                                    <ul class="list-unstyled mb-0">
                                        <li class="mb-2">
                                            <a href="<?= base_url('entrepreneurship-development') ?>" class="text-dark text-decoration-none">
                                                <i class="bi bi-arrow-right me-2"></i>Entrepreneurship Development
                                            </a>
                                        </li>
                                        <li class="mb-2">
                                            <a href="<?= base_url('skill-development') ?>" class="text-dark text-decoration-none">
                                                <i class="bi bi-arrow-right me-2"></i>Skill Development
                                            </a>
                                        </li>
                                        <li class="mb-2">
                                            <a href="<?= base_url('education') ?>" class="text-dark text-decoration-none">
                                                <i class="bi bi-arrow-right me-2"></i>Education
                                            </a>
                                        </li>
                                        <li class="mb-2">
                                            <a href="<?= base_url('women-empowerment') ?>" class="text-dark text-decoration-none">
                                                <i class="bi bi-arrow-right me-2"></i>Women Empowerment
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Back to Home Button -->
                    <div class="mt-5">
                        <a href="<?= base_url() ?>" class="btn btn-lg btn-primary rounded-btn">
                            <span>Go to Homepage</span>
                            <span class="arrow"><i class="bi bi-arrow-right"></i></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Error Section End -->

    <?= view('layouts/footer') ?>

</body>
</html>

