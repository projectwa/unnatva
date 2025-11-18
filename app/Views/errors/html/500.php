<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Server Error - UNNATVA</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">
    <?= view('layouts/head') ?>
</head>

<body class="act_home">
    <?= view('layouts/header') ?>

    <!-- 500 Error Section Start -->
    <div class="container-fluid py-6 wow fadeIn" data-wow-delay="0.1s">
        <div class="container">
            <div class="row justify-content-center align-items-center">
                <div class="col-lg-8 text-center">
                    <!-- Error Icon/Image -->
                    <div class="mb-4">
                        <h1 class="display-1 text-primary" style="font-size: 120px; font-weight: 700;">500</h1>
                    </div>
                    
                    <!-- Error Message -->
                    <h2 class="mb-4">Internal Server Error</h2>
                    <p class="mb-4" style="font-size: 18px; color: #333;">
                        We're sorry, but something went wrong on our end. Our team has been notified and is working to fix the issue.
                    </p>
                    
                    <!-- Useful Links -->
                    <div class="row g-3 mt-4">
                        <div class="col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <h5 class="card-title text-primary mb-3">
                                        <i class="bi bi-house-door me-2"></i>Go Home
                                    </h5>
                                    <p class="text-muted mb-3">Return to our homepage and try again.</p>
                                    <a href="<?= base_url() ?>" class="btn btn-primary">
                                        Go to Homepage <i class="bi bi-arrow-right ms-2"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <h5 class="card-title text-primary mb-3">
                                        <i class="bi bi-envelope me-2"></i>Contact Support
                                    </h5>
                                    <p class="text-muted mb-3">If the problem persists, please contact us.</p>
                                    <a href="<?= base_url('contact') ?>" class="btn btn-primary">
                                        Contact Us <i class="bi bi-arrow-right ms-2"></i>
                                    </a>
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
    <!-- 500 Error Section End -->

    <?= view('layouts/footer') ?>

</body>
</html>

