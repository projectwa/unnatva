<?php include 'includes/config.php'; ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>UNNATVA</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">
    <?php include(S_INCLUDESPATH . "head.php"); ?>

</head>

<body class="act_home">
    <?php include(S_INCLUDESPATH . "header.php"); ?>

    <!-- Carousel Start -->
    <div class="container-fluid p-0 wow fadeIn" data-wow-delay="0.1s">
        <div id="header-carousel" class="carousel slide" data-bs-ride="carousel">
            <!-- Indicators -->
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#header-carousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#header-carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#header-carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#header-carousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
                <button type="button" data-bs-target="#header-carousel" data-bs-slide-to="4" aria-label="Slide 5"></button>
            </div>
            <!-- Inner -->
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img class="img-fluid arrow-img" src="<?= S_IMGPATH ?>banner-green-arrow.png" alt="">
                    <div class="container">
                        <div class="row g-5 align-items-center">
                            <div class="col-lg-5 text-center text-lg-start order-2 order-lg-1">
                                <h1 class="m-0 mb-lg-5 ms-lg-5 pb-0 pb-lg-4 slideInDown">
                                    Partner with Us to Empower <br>
                                    Tomorrow's <span>Changemakers</span>
                                </h1>
                            </div>
                            <div class="col-lg-7 position-relative order-1 order-lg-2">
                                <img class="img-fluid banner-img" src="<?= S_IMGPATH ?>banner-slider-1.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                <img class="img-fluid arrow-img" src="<?= S_IMGPATH ?>banner-green-arrow.png" alt="">
                    <div class="container">
                        <div class="row g-5 align-items-center">
                            <div class="col-lg-5 text-center text-lg-start order-2 order-lg-1">
                                <h1 class="m-0 mb-lg-5 ms-lg-5 pb-0 pb-lg-4 slideInDown">
                                    Empower <br><span>Entrepreneurs</span> to <br>Create and Lead
                                </h1>
                            </div>
                            <div class="col-lg-7 position-relative order-1 order-lg-2">
                                <img class="img-fluid banner-img" src="<?= S_IMGPATH ?>banner-slider-2.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                <img class="img-fluid arrow-img" src="<?= S_IMGPATH ?>banner-green-arrow.png" alt="">
                    <div class="container">
                        <div class="row g-5 align-items-center">
                            <div class="col-lg-5 text-center text-lg-start order-2 order-lg-1">
                                <h1 class="m-0 mb-lg-5 ms-lg-5 pb-0 pb-lg-4 slideInDown">
                                    Empower <span>Youth</span> with Job-Ready Skills
                                </h1>
                            </div>
                            <div class="col-lg-7 position-relative order-1 order-lg-2">
                                <img class="img-fluid banner-img" src="<?= S_IMGPATH ?>banner-slider-3.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                <img class="img-fluid arrow-img" src="<?= S_IMGPATH ?>banner-green-arrow.png" alt="">
                    <div class="container">
                        <div class="row g-5 align-items-center">
                            <div class="col-lg-5 text-center text-lg-start order-2 order-lg-1">
                                <h1 class="m-0 mb-lg-5 ms-lg-5 pb-0 pb-lg-4 slideInDown">
                                    Empower <span>Women</span> to Rise and Inspire
                                </h1>
                            </div>
                            <div class="col-lg-7 position-relative order-1 order-lg-2">
                                <img class="img-fluid banner-img" src="<?= S_IMGPATH ?>banner-slider-4.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                <img class="img-fluid arrow-img" src="<?= S_IMGPATH ?>banner-green-arrow.png" alt="">
                    <div class="container">
                        <div class="row g-5 align-items-center">
                            <div class="col-lg-5 text-center text-lg-start order-2 order-lg-1">
                                <h1 class="m-0 mb-lg-5 ms-lg-5 pb-0 pb-lg-4 slideInDownx">
                                    Empower <span>Students</span> with Skills for Equal Opportunity
                                </h1>
                            </div>
                            <div class="col-lg-7 position-relative order-1 order-lg-2">
                                <img class="img-fluid banner-img" src="<?= S_IMGPATH ?>banner-slider-5.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--button class="carousel-control-prev" type="button" data-bs-target="#header-carousel"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#header-carousel"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button-->
        </div>
    </div>
    <!-- Carousel End -->

    <!-- About Start -->
    <div class="container-xxl py-6" id="about">
        <div class="container">
            <div class="row g-5 align-items-center">
                <div class="col-lg-7">
                    <h4 class="mb-3 mb-lg-5">Our Essence</h4>
                    <!-- <h1 class="display-4 mb-3"><span class="text-primary">25+ Years Experience</span> In Solar Power Industry</h1> -->
                    <p class="fw-bold mb-3 mb-lg-5">Unnatva, a fusion of Unnat, which means to elevate, and Tattva, the core principle, captures what we’ve always stood for:</p>
                    <p class="mb-0 lh-lg"><i class="bi bi-square-fill me-3"></i> That every individual carries within them the potential to rise.</p>
                    <p class="mb-0 lh-lg"><i class="bi bi-square-fill me-3"></i> That empowerment begins with recognizing each person’s unique needs and aspirations.</p>
                    <p class="mb-0 lh-lg"><i class="bi bi-square-fill me-3"></i> And that with the right principles, the right environment, the right tattvas, transformation is not just possible; it’s inevitable.</p>
                </div>
                <div class="col-lg-5 text-center">
                    <img class="img-fluid mb-4 mb-lg-0" src="<?= S_IMGPATH ?>our-essence-img.png" alt="">
                </div>
            </div>
        </div>
    </div>
    <!-- About End -->



    <!-- Features Start -->
    <div class="container-xxl pt-6" id="our-program">
        <div class="container">
            <div class="row gx-3 gy-3 mx-0 px-0 align-items-center">
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                    <!-- <h6 class="text-primary text-uppercase mb-2">Why Choose Us!</h6> -->
                    <h2 class="mb-4">Our Initiatives, <span style="color:#A1A1A1">Transforming <br>Purpose Into Action</span></h2>
                    <!-- <p class="mb-5">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet</p> -->
                    <!-- <a href="#" class="rounded-btn">Create Change <span class="arrow"><i class="bi bi-arrow-right"></i></span></a> -->
                    <div class="row gx-3 gy-1 mt-3 mb-5 px-0">
                        <div class="col-12 wow fadeIn" data-wow-delay="0.1s">
                            <div class="counter-bg" style="background: url(<?= S_IMGPATH ?>our-program-bg-1.png) left center no-repeat;background-size: 100%;">
                                <a href="<?= S_DOMAINPATH ?>entrepreneurship-development/"><h4 class="text-white">Entrepreneurship Development</h4></a>
                            </div>
                        </div>
                        <div class="col-12 wow fadeIn" data-wow-delay="0.2s">
                            <div class="counter-bg" style="background: url(<?= S_IMGPATH ?>our-program-bg-2.png) left center no-repeat;background-size: 100%;">
                                <a href="<?= S_DOMAINPATH ?>skill-development/"><h4 class="text-white">Skill Development</h4></a>
                            </div>
                        </div>
                        <div class="col-12 wow fadeIn" data-wow-delay="0.3s">
                            <div class="counter-bg" style="background: url(<?= S_IMGPATH ?>our-program-bg-3.png) left center no-repeat;background-size: 100%;">
                                <a href="<?= S_DOMAINPATH ?>"><h4 class="text-white">Education</h4></a>
                            </div>
                        </div>
                        <div class="col-12 wow fadeIn" data-wow-delay="0.4s">
                            <div class="counter-bg" style="background: url(<?= S_IMGPATH ?>our-program-bg-4.png) left center no-repeat;background-size: 100%;">
                                <a href="<?= S_DOMAINPATH ?>women-empowerment/"><h4 class="text-white">Women Empowerment</h4></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="position-relative text-center">
                        <img class="our-project-img" src="<?= S_IMGPATH ?>projects-img.png" alt="">
                        <!-- <img class="position-absolute top-0 end-0 bg-white ps-3 pb-3" src="<?= S_IMGPATH ?>about-2.jpg" alt="" style="width: 200px; height: 200px"> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Features End -->


    <!-- Features Start -->
    <div class="container-fluid py-6" id="counter-sec">
        <div class="container">
            <div class="row gx-3 gy-2 mx-0 px-0 align-items-center">
                <div class="col-lg-5 wow fadeInUp" data-wow-delay="0.1s">
                    <h2 class="mb-4 text-white">Our Impact, <span style="color:#A1A1A1">Numbers from <br>2024-2025</span></h2>
                    <div class="row gx-3 gy-3 mt-3 mb-5 px-0">
                        <div class="col-12 wow fadeIn" data-wow-delay="0.1s">
                            <div class="counter-bg">
                                <img src="<?= S_IMGPATH ?>counter-bg-1.svg" class="img-fluid" alt="">
                                <div class="d-flex flex-row align-items-center">
                                    <div>
                                        <h4 class="text-center"><span class="counterNo" data-toggle="counter-up">4519</span><span class="counterNo">+</span> <span class="text-dark fw-normal counterText">Beneficiaries Impacted</span></h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 wow fadeIn" data-wow-delay="0.2s">
                            <div class="counter-bg">
                                <img src="<?= S_IMGPATH ?>counter-bg-2.svg" class="img-fluid" alt="">
                                <div class="d-flex flex-row align-items-center">
                                    <div>
                                        <h4 class="text-center"><span class="counterNo" data-toggle="counter-up">67.78</span> <span class="text-dark fw-normal counterText">Cr. Total Income Generated</span></h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 wow fadeIn" data-wow-delay="0.3s">
                            <div class="counter-bg">
                                <img src="<?= S_IMGPATH ?>counter-bg-1.svg" class="img-fluid" alt="">
                                <div class="d-flex flex-row align-items-center">
                                    <div>
                                        <h4 class="text-center"><span class="counterNo" data-toggle="counter-up">1653</span> <span class="text-dark fw-normal counterText">Women Trained</span></h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 wow fadeIn" data-wow-delay="0.4s">
                            <div class="counter-bg">
                                <img src="<?= S_IMGPATH ?>counter-bg-2.svg" class="img-fluid" alt="">
                                <div class="d-flex flex-row align-items-center">
                                    <div>
                                        <h4 class="text-center"><span class="counterNo" data-toggle="counter-up">84</span><span class="counterNo">%</span> <span class="text-dark fw-normal counterText">Employment Success</span></h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href="#" class="rounded-btn" data-bs-toggle="modal" data-bs-target="#popupModal">Create Change <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>
                </div>
            </div>
        </div>
    </div>
    
    
    <!-- Features End -->


    <div class="container-fluid py-6" id="believers">
        <div class="container">
            <div class="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                <!-- <h6 class="text-primary text-uppercase mb-2">Our Beneficiaries</h6> -->
                <h2 class="mb-4">Our Believers</h2>
            </div>
            <div class="row px-xl-5">
                <div class="col">
                    <div class="owl-carousel vendor-carousel2">
                        <div class="vendor-item p-3">
                            <img src="<?= S_IMGPATH ?>client-logo-1.png" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= S_IMGPATH ?>client-logo-2.png" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= S_IMGPATH ?>client-logo-3.png" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= S_IMGPATH ?>client-logo-4.png" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= S_IMGPATH ?>client-logo-5.png" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= S_IMGPATH ?>client-logo-6.png" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= S_IMGPATH ?>client-logo-7.png" alt="">
                        </div>
                        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-8.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-9.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-10.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-11.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-12.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-13.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-14.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-15.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-16.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-17.png" alt="">
        </div>
        <div class="vendor-item p-3">
            <img src="<?= S_IMGPATH ?>client-logo-18.png" alt="">
        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- whats-happening Start -->
    <div class="container-xxl py-6" id="whats-happening">
        <div class="container py-0 px-lg-5">
            <div class="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                <h2 class="pb-3 mb-0">What’s Happening Now?</h2>
            </div>
            <div class="owl-carousel happening-carousel wow fadeInUp" data-wow-delay="0.1s">
                <div class="testimonial-item p-3 position-relative">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= S_IMGPATH ?>whats-happening-1.png" style="border-radius:5px">
                        <div class="position-absolute video top-50 start-50 translate-middle">
                            <!--button type="button" class="btn-play zindex-3" data-toggle="modal" data-src="https://www.youtube.com/embed/gWmoyzeYH6U?si=vH-TyYwpCSL1uyHf" data-target="#videoModal">
                                <span></span>
                            </button-->
                            <button type="button" class="btn-play zindex-3" data-video="https://www.youtube.com/embed/gWmoyzeYH6U?si=vH-TyYwpCSL1uyHf">
                              <span></span>
                            </button>
                        </div>
                    </div>
                    <p class="mb-3 fw-bold">l never imagined I could do this</p>
                    <p class="small">These words from a young woman in rural Madhya Pradesh
                        capture the heart of what skill development can truly achieve
                        — confidence, independence. and a new trainning.
                        Through our community-based skill development
                        supported by India Foundation, youth from
                        remote villages gained practical skills.........</p>
                    <!--<a href="#" class="rounded-btn m-3 position-absolute bottom-0 start-0">Watch Video <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>-->
                    <a href="#" class="rounded-btn m-3 position-absolute bottom-0 start-0" data-video="https://www.youtube.com/embed/gWmoyzeYH6U?si=vH-TyYwpCSL1uyHf">Watch Video <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>
                </div>
                <div class="testimonial-item p-3 position-relative">
                    <p class="mb-3 fw-bold">Meet the Women Shaping India's Healthcare Support Systems</p>
                    <p class="small mb-3">In many low-income households across India, girls are often raised with a singular focus: preparing for marriage,
                        household responsibilities. and childcare. Education beyond
                        the basics is rare. The idea of income generation, independence. or building a career is rarely encouraged, if not
                        outright discouraged......</p>
                    <a href="https://www.linkedin.com/feed/update/urn:li:activity:7347947151823405058" target="_blank" class="rounded-btn">Read More <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>
                    <div class="d-flex align-items-center mt-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= S_IMGPATH ?>whats-happening-2.png" style="border-radius:5px">
                    </div>
                </div>
                <div class="testimonial-item p-3 position-relative">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= S_IMGPATH ?>whats-happening-3.png" style="border-radius:5px">
                        <div class="position-absolute video top-50 start-50 translate-middle">
                            <!--button type="button" class="btn-play zindex-2" data-toggle="modal" data-src="https://www.youtube.com/embed/DWRcNpR6Kdc" data-target="#videoModal">
                                <span></span>
                            </button-->
                            <button type="button" class="btn-play zindex-2"
                                    data-video="https://www.youtube.com/embed/ZoDt1aawKKY?si=eI6VHQFDUuwofShL">
                              <span></span>
                            </button>
                        </div>
                    </div>
                    <p class="mb-3 fw-bold">What Does Empowerment Look Like?</p>
                    <p class="small">As proud partners of Swades Foundation, we celebrate the
                        resilience, hard work, and spirit of the people driving rural
                        transformation at the heart of Maharashtra.<br>
                        Yes. income growth is important. but true empowerment is about choice, opportunity,..........</p>
                    <!--<a href="#" class="rounded-btn m-3 position-absolute bottom-0 start-0">Watch Video <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>-->
                    <a href="#" class="rounded-btn m-3 position-absolute bottom-0 start-0"
                       data-video="https://www.youtube.com/embed/ZoDt1aawKKY?si=eI6VHQFDUuwofShL"> <!--https://youtu.be/ZoDt1aawKKY-->
                      Watch Video <span class="arrow"><i class="bi bi-arrow-right"></i></span>
                    </a>
                </div>
            </div>
            
            <!-- Video Modal 1-->
            <!-- Modal Structure -->
            <div id="videoModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div class="video-container">
                        <iframe id="youtubeVideo" width="560" height="315" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    <!-- whats-happening End -->
    
    <div class="container-fluid py-6 pt-0">
        <div class="container">
            <div class="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s">
                <!-- <h6 class="text-primary text-uppercase mb-2">Our Beneficiaries</h6> -->
                <h2 class="mb-4">Our Government Affiliations</h2>
            </div>
            <div class="row text-center">
                <div class="col-md-10 d-block mx-auto">
                    <div class="row text-center">
                        <div class="col-md-3">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= S_IMGPATH ?>dept.-science-and-technology.png" alt="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= S_IMGPATH ?>TRTI.png" alt="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= S_IMGPATH ?>TSSC.png" alt="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= S_IMGPATH ?>NSDC.png" alt="">
                            </div>
                        </div>                
                    </div>
                    <div class="row text-center">                
                        <div class="col-md-4">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= S_IMGPATH ?>skill-developement-nashik.png" alt="">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= S_IMGPATH ?>NSTEDB.png" alt="">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= S_IMGPATH ?>NULM.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- About Us Start Hundred Five-->
    <div class="about105 py-6">
        <div class="container-fluid">
            <div class="text-center mx-auto mb-2 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                <!-- <h6 class="text-primary text-uppercase mb-2">Our Beneficiaries</h6> -->
                <h2 class="mb-4">About Us</h2>
            </div>
            <div class="row">
                <div class="col-md-10 d-block mx-auto">
                    <div class="welcome m-auto">
                        <p class="fw-bold lh-lg">Unnatva Foundation previously known as Udyogwardhini Shikshan Sanstha is a registered NGO under the Bombay Public Trust Act (1950) and the Societies Registration Act (1860). We are dedicated to empowering underserved communities across India through sustainable livelihood initiatives that are practical, market-driven, and locally relevant. <br>With a presence in 11 states and an impact on over 80,000 lives, our work supports individuals in turning their aspirations into income-generating opportunities — fostering self-reliance, dignity, and long-term change. By investing in entrepreneurship and skill development, UNNATVA envisions a self-sustaining society and an integrally developed nation. <br>We are proud to have been recognized four times as the Best NGO Partner by Tata Housing, a testament to our consistent impact and collaborative approach.</p>
                        
                        <!-- Team Start -->
                        <div class="certificate my-5">               
                            <div class="row g-4">
                                <div class="col-lg-3 col-md-6 col-6">
                                    <div class="certificate-item bg-dark">
                                        <div class="certificate-img">
                                            <img src="<?= S_IMGPATH ?>certificate-1.jpg" alt="Team Image">
                                        </div>
                                        <div class="certificate-text bg-dark">
                                            <!-- <h2>Donald John</h2> -->
                                            <p>'Inaugural National Science & Tech Entrepreneur Trainer' award from DST New Delhi</p>                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6 col-6">
                                    <div class="certificate-item bg-dark">
                                        <div class="certificate-img">
                                            <img src="<?= S_IMGPATH ?>certificate-2.jpg" alt="Team Image">
                                        </div>
                                        <div class="certificate-text bg-dark">
                                            <!-- <h2>Adam Phillips</h2> -->
                                            <p>'Best Entrepreneur Trainer' Award from Entrepreneur's Club</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6 col-6">
                                    <div class="certificate-item bg-dark">
                                        <div class="certificate-img">
                                            <img src="<?= S_IMGPATH ?>certificate-3.jpg" alt="Team Image">
                                        </div>
                                        <div class="certificate-text bg-dark">
                                            <!-- <h2>Thomas Olsen</h2> -->
                                            <p>'Best Entrepreneur Trainer-Motivator' Award from EDII</p>                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6 col-6">
                                    <div class="certificate-item bg-dark">
                                        <div class="certificate-img">
                                            <img src="<?= S_IMGPATH ?>certificate-4.jpg" alt="Team Image">
                                        </div>
                                        <div class="certificate-text bg-dark">
                                            <!-- <h2>James Alien</h2> -->
                                            <p>'Best NGO Partner' from Tata Housing Dev Ltd.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Team End -->

                        
                        <a href="<?= S_DOMAINPATH ?>about" class="rounded-btn d-block mt-4 mx-auto" style="width:fit-content">Know more <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- About Us End Hundred Five-->

    <?php include(S_INCLUDESPATH . "footer.php"); ?>


<!-- whats-happening Modal Script -->
<script>
  (function () {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('youtubeVideo');
    const closeBtn = modal.querySelector('.close');

    function openModal(url) {
      // Add autoplay and safe params
      const sep = url.includes('?') ? '&' : '?';
      iframe.src = url + sep + 'autoplay=1&modestbranding=1&rel=0';
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.style.display = 'none';
      // Stop playback
      iframe.src = '';
      document.body.style.overflow = '';
    }

    // Event delegation: works with Owl Carousel clones
    document.addEventListener('click', function (e) {
      // Any element with data-video is a trigger
      const trigger = e.target.closest('[data-video]');
      if (trigger) {
        e.preventDefault();
        openModal(trigger.getAttribute('data-video'));
        return;
      }
      // Click outside content closes modal
      if (e.target === modal) {
        closeModal();
      }
    });

    closeBtn.addEventListener('click', closeModal);

    // Esc to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
    });
  })();
</script>
<!-- whats-happening Modal Script End-->


</body>

</html>