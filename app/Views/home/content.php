<!-- Home Page Content (no header/footer - for API) -->
<div class="page-content" data-page="home">

    <!-- Carousel Start - React Component -->
    <?php 
    try {
        $carouselData = isset($carouselSlides) ? $carouselSlides : [];
        $carouselJson = json_encode($carouselData, JSON_HEX_APOS | JSON_HEX_QUOT);
        if ($carouselJson === false) {
            $carouselJson = '[]';
        }
    } catch (Exception $e) {
        $carouselJson = '[]';
    }
    ?>
    <div id="home-carousel" data-slides='<?= htmlspecialchars($carouselJson, ENT_QUOTES, 'UTF-8') ?>'></div>
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
                    <img class="img-fluid mb-4 mb-lg-0" src="<?= img_path('our-essence-img.png') ?>" alt="">
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
                            <div class="counter-bg" style="background: url(<?= img_path('our-program-bg-1.png') ?>) left center no-repeat;background-size: 100%;">
                                <a href="<?= base_url('entrepreneurship-development') ?>">
                                    <h4 class="text-white">Entrepreneurship Development</h4>
                                </a>
                            </div>
                        </div>
                        <div class="col-12 wow fadeIn" data-wow-delay="0.2s">
                            <div class="counter-bg" style="background: url(<?= img_path('our-program-bg-2.png') ?>) left center no-repeat;background-size: 100%;">
                                <a href="<?= base_url('skill-development') ?>">
                                    <h4 class="text-white">Skill Development</h4>
                                </a>
                            </div>
                        </div>
                        <div class="col-12 wow fadeIn" data-wow-delay="0.3s">
                            <div class="counter-bg" style="background: url(<?= img_path('our-program-bg-3.png') ?>) left center no-repeat;background-size: 100%;">
                                <a href="<?= base_url('education') ?>">
                                    <h4 class="text-white">Education</h4>
                                </a>
                            </div>
                        </div>
                        <div class="col-12 wow fadeIn" data-wow-delay="0.4s">
                            <div class="counter-bg" style="background: url(<?= img_path('our-program-bg-4.png') ?>) left center no-repeat;background-size: 100%;">
                                <a href="<?= base_url('women-empowerment') ?>">
                                    <h4 class="text-white">Women Empowerment</h4>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="position-relative text-center">
                        <img class="our-project-img" src="<?= img_path('projects-img.png') ?>" alt="">
                        <!-- <img class="position-absolute top-0 end-0 bg-white ps-3 pb-3" src="<?= img_path('about-2.jpg') ?>" alt="" style="width: 200px; height: 200px"> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Features End -->


    <!-- Impact Counters Start - React Component -->
    <?php 
    try {
        $statsData = isset($impactStats) ? $impactStats : [];
        $statsJson = json_encode($statsData, JSON_HEX_APOS | JSON_HEX_QUOT);
        if ($statsJson === false) {
            $statsJson = '[]';
        }
    } catch (Exception $e) {
        $statsJson = '[]';
    }
    ?>
    <div id="impact-counters" data-stats='<?= htmlspecialchars($statsJson, ENT_QUOTES, 'UTF-8') ?>'></div>
    <!-- Impact Counters End -->


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
                            <img src="<?= img_path('client-logo-1.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-2.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-3.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-4.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-5.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-6.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-7.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-8.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-9.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-10.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-11.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-12.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-13.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-14.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-15.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-16.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-17.png') ?>" alt="">
                        </div>
                        <div class="vendor-item p-3">
                            <img src="<?= img_path('client-logo-18.png') ?>" alt="">
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
                <h2 class="pb-3 mb-0">What's Happening Now?</h2>
            </div>
            <div class="owl-carousel happening-carousel wow fadeInUp" data-wow-delay="0.1s">
                <?php 
                // Ensure variable exists
                if (!isset($whatsHappeningBlocks)) {
                    $whatsHappeningBlocks = [];
                }
                
                if (empty($whatsHappeningBlocks)): 
                    // Fallback to default content if no blocks in database
                ?>
                    <div class="testimonial-item p-3 position-relative">
                        <div class="d-flex align-items-center mb-4 position-relative">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('whats-happening-1.png') ?>" style="border-radius:5px">
                        </div>
                        <p class="mb-3 fw-bold">No content available</p>
                        <p class="small">Please add content blocks from the CMS.</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($whatsHappeningBlocks as $block): 
                        $hasVideo = !empty($block->video_url);
                        $hasExternalLink = !empty($block->external_link);
                        $hasImage = !empty($block->image);
                        // Background: video = happening-bg.png, no video = happening-bg-active.png
                        $bgClass = $hasVideo ? 'happening-bg-video' : 'happening-bg-active';
                    ?>
                        <?php if ($hasVideo && $hasImage): ?>
                            <!-- Layout with video: Image at top with play button -->
                            <div class="testimonial-item p-3 position-relative <?= $bgClass ?>">
                                <div class="d-flex align-items-center mb-4 position-relative">
                                    <img class="img-fluid rounded flex-shrink-0" 
                                         src="<?= base_url('img/' . htmlspecialchars($block->image)) ?>" 
                                         alt="<?= htmlspecialchars($block->title ?? '') ?>"
                                         style="border-radius:5px">
                                    <div class="position-absolute video top-50 start-50 translate-middle">
                                        <button type="button" class="btn-play zindex-3" data-video="<?= htmlspecialchars($block->video_url) ?>">
                                            <span></span>
                                        </button>
                                    </div>
                                </div>
                                
                                <?php if (!empty($block->title)): ?>
                                    <p class="mb-3 fw-bold"><?= htmlspecialchars($block->title) ?></p>
                                <?php endif; ?>
                                
                                <?php if (!empty($block->content)): ?>
                                    <p class="small mb-4"><?= nl2br(htmlspecialchars($block->content)) ?></p>
                                <?php endif; ?>
                                
                                <a href="#" class="rounded-btn m-3 position-absolute bottom-0 start-0" data-video="<?= htmlspecialchars($block->video_url) ?>">
                                    Watch Video <span class="arrow"><i class="bi bi-arrow-right"></i></span>
                                </a>
                            </div>
                        <?php else: ?>
                            <!-- Layout without video: Title, content, button, then image at bottom -->
                            <div class="testimonial-item p-3 position-relative <?= $bgClass ?>" 
                                 style="background: url('<?= base_url('img/happening-bg-active.png') ?>') top center no-repeat; background-size: cover;">
                                <?php if (!empty($block->title)): ?>
                                    <p class="mb-3 fw-bold"><?= htmlspecialchars($block->title) ?></p>
                                <?php endif; ?>
                                
                                <?php if (!empty($block->content)): ?>
                                    <p class="small mb-3"><?= nl2br(htmlspecialchars($block->content)) ?></p>
                                <?php endif; ?>
                                
                                <?php if ($hasExternalLink): ?>
                                    <a href="<?= htmlspecialchars($block->external_link) ?>" 
                                       <?= (strpos($block->external_link, 'http') === 0) ? 'target="_blank"' : '' ?> 
                                       class="rounded-btn mb-3">
                                        Read More <span class="arrow"><i class="bi bi-arrow-right"></i></span>
                                    </a>
                                <?php endif; ?>
                                
                                <?php if ($hasImage): ?>
                                    <div class="d-flex align-items-center mt-4 position-relative">
                                        <img class="img-fluid rounded flex-shrink-0" 
                                             src="<?= base_url('img/' . htmlspecialchars($block->image)) ?>" 
                                             alt="<?= htmlspecialchars($block->title ?? '') ?>"
                                             style="border-radius:5px">
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                <?php endif; ?>
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
                                <img class="img-fluid" src="<?= img_path('dept.-science-and-technology.png') ?>" alt="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= img_path('TRTI.png') ?>" alt="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= img_path('TSSC.png') ?>" alt="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= img_path('NSDC.png') ?>" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="row text-center">
                        <div class="col-md-4">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= img_path('skill-developement-nashik.png') ?>" alt="">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= img_path('NSTEDB.png') ?>" alt="">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="p-3">
                                <img class="img-fluid" src="<?= img_path('NULM.png') ?>" alt="">
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
                                            <img src="<?= img_path('certificate-1.jpg') ?>" alt="Team Image">
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
                                            <img src="<?= img_path('certificate-2.jpg') ?>" alt="Team Image">
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
                                            <img src="<?= img_path('certificate-3.jpg') ?>" alt="Team Image">
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
                                            <img src="<?= img_path('certificate-4.jpg') ?>" alt="Team Image">
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


                        <a href="<?= base_url('about') ?>" class="rounded-btn d-block mt-4 mx-auto" style="width:fit-content">Know more <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- About Us End Hundred Five-->

    <!-- whats-happening Modal Script -->
    <script>
        (function() {
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
            document.addEventListener('click', function(e) {
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
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
            });
        })();
    </script>
    <!-- whats-happening Modal Script End-->

    <!-- Note: React and ReactDOM are already loaded in the SPA template -->
    <!-- Standalone components (carousel.js, counters.js) are loaded dynamically by PageContent component -->

</div>
<!-- End Home Page Content -->