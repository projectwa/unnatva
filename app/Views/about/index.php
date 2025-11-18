<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title><?= esc($title ?? 'UNNATVA | About Us') ?></title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">
    <?= view('layouts/head') ?>

</head>

<body class="<?= esc($bodyClass ?? 'act_about') ?>">
    <?= view('layouts/header') ?>

    <!-- Page Header Start -->
    <div class="container-fluid m-0 p-0 wow fadeIn" data-wow-delay="0.1s">
        <img class="img-fluid w-100 d-none d-md-block" src="<?= img_path('banner-about-us.jpg') ?>" alt="">
        <img class="img-fluid w-100 d-block d-md-none" src="<?= img_path('banner-about-us-m.jpg') ?>" alt="">
    </div>
    <!-- Page Header End -->

    <!-- About Start -->
    <div class="container-fluid py-4" id="about">
        <div class="container my-5">
            <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                <h2 class="mb-5">About Us</h2>
            </div>
            <div class="row">
                <div class="col-12 col-md-10 mx-auto">
                    <p class="text-center mb-4">
                        Unnatva Foundation formerly known as Udyogwardhini Shikshan Sanstha (USS) is an NGO registered in 2007 under The Bombay Public Trust Act, 1950, The Societies Registration Act, 1860, Exempted under Income Tax 80G and FCRA Registered with ISO Certification 9001:2015.
                    </p>
                    <p class="text-center mb-4">
                        Our aim is to empower underserved communities through our sustainable livelihood initiatives and we have a pan India presence across 11 states of India and have impacted over 25,000 lives. We have also been recognised as Best NGO Partner 4 times by Tata Housing.
                    </p>
                    <p class="text-center">
                        We invest in the enterprising aspirations of the underprivileged with a focus on building a self-sustaining society and, ultimately, an integrally developed nation. Our initiatives are practical and demand-driven, designed in alignment with the needs of beneficiaries, market opportunities and local geographies.
                    </p>
                </div>
            </div>
        </div>
    </div>
    <!-- About End -->
    
    <!-- Feature Start -->
    <div class="container-fluid bg-light overflow-hidden px-lg-0" id="missin-vision">
        <div class="container px-lg-0">
            <div class="row g-0">
                <div class="col-12 col-lg-9 text-center mx-auto py-5 wow fadeIn" data-wow-delay="0.1s" style="visibility: visible; animation-delay: 0.1s; animation-name: fadeIn;">
                    <h2 class="mb-5">Our Vision</h2>
                    <p class="fs-3 lh-base mx-auto" style="max-width:800px">A world where every individual, regardless of background, is empowered to achieve their aspirations.</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Feature End -->

    <!-- Feature Start -->
    <div class="container-fluid overflow-hidden px-lg-0" id="missin-vision">
        <div class="container pb-5 px-lg-0">
            <div class="row g-0">
                <div class="col-12 col-lg-9 mx-auto text-center py-5 wow fadeIn" data-wow-delay="0.1s" style="visibility: visible; animation-delay: 0.1s; animation-name: fadeIn;">
                    <h2 class="mb-5 pt-2">Our Mission</h2>
                    <p class="fs-3 lh-base mx-auto" style="max-width:800px">To empower 1 million lives with skills, opportunities and support for sustainable livelihoods.</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Feature End -->

    <!-- Features Start -->
    <div class="container-fluid">
        <div class="container pb-5">
            <h2 class="mb-5 text-center">From Presidents Desk</h2>
            <div class="row g-3 align-items-center">
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="position-relative text-center">
                        <img class="img-fluid" src="<?= img_path('chandak-sir.png') ?>" alt="">
                        <!-- <img class="position-absolute top-0 end-0 bg-white ps-3 pb-3" src="<?= img_path('about-2.jpg') ?>" alt="" style="width: 200px; height: 200px"> -->
                    </div>
                </div>
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                     <p class="text-start text-lg-end"><b>Sunil Chandak, <br> Founder & President, Unnatva Foundation </b><br>
                    “Over the last 40 years of my journey, I have witnessed India evolve and transform in remarkable ways. Throughout my career, I have been deeply involved in guiding individuals to build the right mindset for success. Today, the level of aspiration, opportunity, curiosity and momentum I see across the nation is truly unparalleled, signaling a powerful movement toward a self-reliant, “Atma Nirbhar” India.<br>
                    Unnatva Foundation is not just an organization; it is a movement, a collective effort to create an ecosystem of opportunities and ensure that access reaches every underprivileged individual. Through our initiatives, we aim to empower communities, nurture potential and build a future where every person, regardless of their background, can dream, aspire and achieve.”</p> 
                </div>
            </div>
        </div>
    </div>
    <!-- Features End -->
    
    <!-- Features Start -->
    <div class="container-fluid">
        <div class="container py-5">
            <h2 class="mb-5 text-center">From Leadership</h2>
            <div class="row gx-3 align-items-center">
                <div class="col-lg-6 order-0 order-lg-1 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="position-relative text-center">
                        <img class="img-fluid mb-3" src="<?= img_path('ram-sir.png') ?>" alt="">
                        <!-- <img class="position-absolute top-0 end-0 bg-white ps-3 pb-3" src="<?= img_path('about-2.jpg') ?>" alt="" style="width: 200px; height: 200px"> -->
                    </div>
                </div>
                <div class="col-lg-6 order-1 order-lg-0 wow fadeInUp" data-wow-delay="0.1s">
                    <p class="text-start"><b>Shriram Chandak, <br> CEO, Unnatva Foundation</b><br>
                    “After pursuing my MS in Entrepreneurship and Innovation from the University of San Francisco, I witnessed firsthand the vast difference between developed economies and emerging markets like India. This experience deeply shaped my belief that for India to truly become a developed nation by 2047, we must build a society driven by skilled manpower, dynamic entrepreneurs, enterprising women and technocrats who are creating meaningful startups.<br>
                    I envision an India where aspirations are not confined by geography, where the same spark of ambition burns brightly in the remotest villages as it does in our tier-1 cities. Empowering people with the right skills, mindset and opportunities is the key to unlocking this vision and shaping a self-reliant, innovative India.”</p> 
                </div>
            </div>
        </div>
    </div>
    <!-- Features End -->


    <!-- Features Start -->
    <div class="container-fluid py-5" id="nationalAwards">
        <div class="container mb-5">
            <h2 class="mb-5 text-center">National Awards</h2>
            <div class="row align-items-center justify-content-center">
                <div class="col-12 col-lg-11 wow fadeInUp" data-wow-delay="0.1s">
                    <!-- Team Start -->
                    <div class="certificate">
                        <div class="row gx-3 gy-3 mx-0 align-items-stretch">
                            <div class="col-6 col-lg-3 col-md-6 d-flex">
                              <div class="certificate-item flex-fill d-flex flex-column">
                                <div class="certificate-img">
                                  <img src="<?= img_path('certificate-1.jpg') ?>" alt="Team Image">
                                </div>
                                <div class="certificate-text pb-4 mt-auto">
                                  <p class="text-dark mx-3">'Inaugural National Science & Tech Entrepreneur Trainer' award from DST New Delhi</p>                                            
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-lg-3 col-md-6 d-flex">
                              <div class="certificate-item flex-fill d-flex flex-column">
                                <div class="certificate-img">
                                  <img src="<?= img_path('certificate-2.jpg') ?>" alt="Team Image">
                                </div>
                                <div class="certificate-text pb-4 mt-auto">
                                  <p class="text-dark mx-3">'Best Entrepreneur Trainer' Award from Entrepreneur's Club</p>
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-lg-3 col-md-6 d-flex">
                              <div class="certificate-item flex-fill d-flex flex-column">
                                <div class="certificate-img">
                                  <img src="<?= img_path('certificate-3.jpg') ?>" alt="Team Image">
                                </div>
                                <div class="certificate-text pb-4 mt-auto">
                                  <p class="text-dark mx-3">'Best Entrepreneur Trainer-Motivator' Award from EDII</p>
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-lg-3 col-md-6 d-flex">
                              <div class="certificate-item flex-fill d-flex flex-column">
                                <div class="certificate-img">
                                  <img src="<?= img_path('certificate-6.jpg') ?>" alt="Team Image">
                                </div>
                                <div class="certificate-text pb-4 mt-auto">
                                  <p class="text-dark mx-3">Dr.V.G. patel Memorial Award 2021</p>
                                </div>
                              </div>
                            </div>
                            <!-- Repeat same structure for others -->
                        </div>
                        <div class="row mt-0 gx-3 gy-3 mx-0 align-items-stretch justify-content-center">
                            <div class="col-6 col-lg-3 col-md-6 d-flex">
                              <div class="certificate-item flex-fill d-flex flex-column">
                                <div class="certificate-img">
                                  <img src="<?= img_path('certificate-4.jpg') ?>" alt="Team Image">
                                </div>
                                <div class="certificate-text pb-4 mt-auto">
                                  <p class="text-dark mx-3">'Best NGO Partner' from Tata Housing Dev Ltd.</p>                                            
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-lg-3 col-md-6 d-flex">
                              <div class="certificate-item flex-fill d-flex flex-column">
                                <div class="certificate-img">
                                  <img src="<?= img_path('certificate-5.jpg') ?>" alt="Team Image">
                                </div>
                                <div class="certificate-text pb-4 mt-auto">
                                  <p class="text-dark mx-3">Appreciation for Contribution to Youth Skilling Initiative.</p>
                                </div>
                              </div>
                            </div>
                            <!-- Repeat same structure for others -->
                        </div>
                        
                    </div>
                    <!-- Team End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Features End -->


    <!-- Our Team Section Start -->
    <div class="container-fluid our-team" id="ourTeam">
        <div class="container pb-5">
            <!-- Top Heading -->
            <h2 class="text-center mb-5 fw-bold">Our Team</h2>
            <div class="row g-0">
                
              <div class="col-lg-6 col-md-12 d-flex align-items-center justify-content-end mb-lg-0 position-relative">
                <img src="<?= img_path('team/our-team-2.webp') ?>" class="img-fluid d-block ms-auto" alt="Team Member">
              </div>  
              <div class="col-lg-6 col-md-12 d-flex flex-column align-items-center mb-4 mb-lg-0">
                <div class="team-desc d-block me-auto">
                    <div class="bg-white">
                        <img src="<?= img_path('team/our-team-1.webp') ?>" class="d-none d-lg-block" alt="Team Member">
                        <!--<img src="<?= img_path('team/our-team-3.jpg') ?>" class="d-block d-md-none me-auto" alt="Team Member">-->
                    </div>
                    <div class="px-4 py-5" style="min-height: 390px;">
                      <h5 class="fw-bold mb-2">Our Team</h5>
                      <p class="mb-0" style="text-align:justify">
                        Carrying forward the vision of our Founder, Shri Sunil Chandak, our team is united by a singular purpose: to create meaningful and lasting change where it matters most. What sets us apart is not just our expertise, but the deep commitment each member brings to the mission of inclusive development. Our team leads with resilience and heart, each initiative placing the marginalised at the centre of everything we do. In a world of quick fixes, we believe in doing the hard work — listening deeply, acting boldly and staying the course. Because real impact takes time, trust and people who refuse to give up.<br>
                        Together, we are building a future where no one is left behind.
                      </p>
                    </div>
                    <div class="bg-white d-flex flex-wrap justify-content-start">
                        <img src="<?= img_path('team/our-team-3.webp') ?>" class="d-block img-fluid" alt="Team Member">
                        <img src="<?= img_path('team/our-team-1.webp') ?>" class="d-block d-lg-none img-fluid" alt="Team Member">
                    </div>
                </div>
              </div>
            </div>
        </div>
    </div>
<!-- Our Team Section End -->


       <!-- Careers Listings Section -->
    <section class="container-fluid careers-listings py-4" id="careers">
        <div class="container my-5">
            <h2 class="mb-5 text-center">Career, <span style="color:#A1A1A1">Work at Unnatva</span></h2>
            <div class="row">
                <?php 
                // Ensure variable exists
                if (!isset($jobs)) {
                    $jobs = [];
                }
                
                if (empty($jobs)): 
                    // Fallback message if no jobs in database
                ?>
                    <div class="col-12">
                        <p class="text-center">No job openings available at the moment. Please check back later.</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($jobs as $index => $job): ?>
                        <div class="col-12 <?= $index < count($jobs) - 1 ? '' : 'mb-4' ?>">
                            <h3><?= htmlspecialchars($job->title) ?></h3>
                            <?php if (!empty($job->description)): ?>
                                <p><?= nl2br(htmlspecialchars($job->description)) ?></p>
                            <?php endif; ?>
                            <div class="d-flex gap-3 flex-wrap justify-content-between align-items-center mb-3">
                                <div>
                                    <?php if (!empty($job->location)): ?>
                                        <span class="job-badge my-1 me-2"><img class="img-fluid me-2" src="<?= img_path('location-green-icon.svg') ?>" alt="Location"> <?= htmlspecialchars($job->location) ?></span>
                                    <?php endif; ?>
                                    <?php if (!empty($job->experience)): ?>
                                        <span class="job-badge my-1 me-2"><img class="img-fluid me-2" src="<?= img_path('experience-icon.svg') ?>" alt="Experience"> <?= htmlspecialchars($job->experience) ?></span>
                                    <?php endif; ?>
                                    <?php if (!empty($job->category)): ?>
                                        <span class="job-badge my-1 me-2"><img class="img-fluid me-2" src="<?= img_path('content-marketing-icon.svg') ?>" alt="Category"> <?= htmlspecialchars($job->category) ?></span>
                                    <?php endif; ?>
                                </div>
                                <div>
                                    <a href="javascript:void(0);" class="rounded-btn apply-now-btn" data-job-id="<?= $job->id ?>" data-job-title="<?= htmlspecialchars($job->title) ?>" onclick="return false;">Apply Now <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>
                                </div>
                            </div>
                            <?php if (!empty($job->deadline)): ?>
                                <?php
                                $deadlineDate = new \DateTime($job->deadline);
                                $formattedDeadline = $deadlineDate->format('M d, Y');
                                ?>
                                <div class="text-end">
                                    <span style="color: #0066cc; font-style: italic; font-size: 14px;">
                                        <i class="bi bi-calendar-event me-2"></i>Last date of Application: <?= htmlspecialchars($formattedDeadline) ?>
                                    </span>
                                </div>
                            <?php endif; ?>
                            
                            <?php if ($index < count($jobs) - 1): ?>
                                <div class="divider"></div>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
        
        



    <?= view('layouts/footer') ?>

</body>

</html>