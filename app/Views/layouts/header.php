<!-- Navbar Start -->
<div class="container-fluid p-0 shadow-sm">
    <div class="container">
        <nav class="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0" style="z-index:999">
            <a href="<?= base_url() ?>" class="navbar-brand d-flex align-items-center px-3 px-md-4 px-xxl-5">
                <img src="<?= img_path('logo.svg') ?>" class="img-fluid logo" alt="">
            </a>
            <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <div class="navbar-nav ms-auto p-4 p-lg-0">
                    <a href="<?= base_url('about') ?>" class="nav-item nav-link act_about">About us</a>
                    <a href="<?= base_url('impact') ?>" class="nav-item nav-link act_impact">Our Impact</a>
                    <div class="nav-item dropdown">
                        <a href="#" class="nav-link act_ourInitiatives dropdown-toggle" data-bs-toggle="dropdown">Our Initiatives</a>
                        <div class="dropdown-menu bg-light m-0">
                            <a href="<?= base_url('entrepreneurship-development') ?>" class="dropdown-item">Entrepreneurship Development</a>
                            <a href="<?= base_url('skill-development') ?>" class="dropdown-item">Skill Development</a>
                            <a href="<?= base_url('education') ?>" class="dropdown-item">Education</a>
                            <a href="<?= base_url('women-empowerment') ?>" class="dropdown-item">Women Empowerment</a>
                        </div>
                    </div>
                    <a href="<?= base_url('success-stories') ?>" class="nav-item nav-link act_successStory">Success Story</a>
                    <a href="<?= base_url('contact') ?>" class="nav-item nav-link act_contact">Contact Us</a>
                </div>
            </div>
        </nav>
    </div>
</div>
<!-- Navbar End -->

