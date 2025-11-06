    <!-- Navbar Start -->
     <div class="container-fluid p-0 shadow-sm">
     <div class="container">
        <nav class="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0" style="z-index:999">
            <a href="<?= S_DOMAINPATH ?>" class="navbar-brand d-flex align-items-center px-3 px-md-4 px-xxl-5">
                <!-- <h2 class="m-0"><i class="fa fa-car text-primary me-2"></i>Drivin</h2> -->
                <img src="<?= S_IMGPATH ?>logo.svg" class="img-fluid logo" alt="">
            </a>
            <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <div class="navbar-nav ms-auto p-4 p-lg-0">
                    <!--<a href="<?= S_DOMAINPATH ?>" class="nav-item nav-link active">Home</a>-->
                    <a href="<?= S_DOMAINPATH ?>about/" class="nav-item nav-link act_about">About us</a>
                    <a href="<?= S_DOMAINPATH ?>impact/" class="nav-item nav-link act_impact">Our Impact</a>
                    <!--<a href="<?= S_DOMAINPATH ?>" class="nav-item nav-link">Our Initiatives</a>-->
                    <div class="nav-item dropdown">
                        <a href="#" class="nav-link act_ourInitiatives dropdown-toggle" data-bs-toggle="dropdown">Our Initiatives</a>
                        <div class="dropdown-menu bg-light m-0">
                            <a href="<?= S_DOMAINPATH ?>entrepreneurship-development/" class="dropdown-item">Entrepreneurship Development</a>
                            <a href="<?= S_DOMAINPATH ?>skill-development/" class="dropdown-item">Skill Development</a>
                            <a href="<?= S_DOMAINPATH ?>education/" class="dropdown-item">Education</a>
                            <a href="<?= S_DOMAINPATH ?>women-empowerment/" class="dropdown-item">Women Empowerment</a>
                        </div>
                    </div>
                    <a href="<?= S_DOMAINPATH ?>success-stories/" class="nav-item nav-link act_successStory">Success Story</a>
                    <!--<a href="<?= S_DOMAINPATH ?>" class="nav-item nav-link">Annual Report</a>-->
                    <a href="<?= S_DOMAINPATH ?>contact" class="nav-item nav-link act_contact">Contact Us</a>
                </div>
                <!-- <a href="" class="btn btn-primary py-4 px-lg-5 d-none d-lg-block">Get Started<i class="fa fa-arrow-right ms-3"></i></a> -->
            </div>
        </nav>
    </div>
    </div>
    <!-- Navbar End -->

