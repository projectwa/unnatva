<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title><?= esc($title ?? 'UNNATVA | Our Impact') ?></title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">
    <?= view('layouts/head') ?>

</head>

<body class="<?= esc($bodyClass ?? 'act_impact') ?>">
    <?= view('layouts/header') ?>

    <!-- Our Segments Start -->
    <section class="services pb-5 pt-0" id="services">
        <div class="container-fluid p-0">
            <div class="section-header bg-primary d-flex justify-content-center align-items-center" style="min-height:324px">
                <div class="col-12 wow fadeIn" data-wow-delay="0.1s" style="visibility: visible; animation-delay: 0.1s; animation-name: fadeIn;">
                    <div class="counter-bg d-block mx-auto">
                        <img src="https://imaginewebtech.info/d1/unnatva/img/counter-bg-1.svg" class="img-fluid" alt="">
                        <div class="position-absolute top-50 start-50 translate-middle">
                            <div>
                                <h2 class="text-center">Our Impact</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Our Segments End -->

    
    <style>
      /* 1/7th width on ≥1200px screens (Bootstrap's xl) */
      @media (min-width: 1200px) {
      /* Optional: ensure numbers and lines align nicely */
        .col-xl-1-7 {
          flex: 0 0 14.2857143%;
          max-width: 14.2857143%;
          border-right:1px solid #dfdfdf;
        }
        .col-xl-1-7:last-child {
          border-right:0px solid #dfdfdf;
        }
      }
      /* Optional: ensure numbers and lines align nicely */
      .counter-counting h4 {
        line-height: 1;
      }
      .stat-line-top,
      .stat-line-bottom {
        margin: 0; 
        line-height: 1.2;
        color:#33B68D !important
      }
    </style>
    
    <div class="container-fluid booking pb-5 wow fadeIn" data-wow-delay="0.1s">
      <div class="container-fluid mx-auto position-relative">
        <div class="bg-white shadow counter-box zindex-dropdown mx-auto">
          <div class="row g-4">
            <!-- 1 -->
            <div class="col-6 col-md-4 col-lg-3 col-xl-1-7">
              <div class="skills-item text-center rounded pt-2 h-100 wow fadeInUp" data-wow-delay="0.1s">
                <div class="counter-counting d-flex justify-content-center">
                  <p class="fs-2 fw-bold text-dark" data-toggle="counter-up">24,815</p>
                </div>
                <p class="mb-0 textgreen">Lives <br>Impacted</p>
              </div>
            </div>
    
            <!-- 2 -->
            <div class="col-6 col-md-4 col-lg-3 col-xl-1-7">
              <div class="skills-item text-center rounded pt-2 h-100 wow fadeInUp" data-wow-delay="0.15s">
                <div class="counter-counting d-flex justify-content-center">
                  <p class="fs-2 fw-bold text-dark" data-toggle="counter-up">18,867</p>
                </div>
                <p class="mb-0 textgreen">Youth <br>Skilled</p>
              </div>
            </div>
    
            <!-- 3 -->
            <div class="col-6 col-md-4 col-lg-3 col-xl-1-7">
              <div class="skills-item text-center rounded pt-2 h-100 wow fadeInUp" data-wow-delay="0.2s">
                <div class="counter-counting d-flex justify-content-center">
                  <p class="fs-2 fw-bold text-dark" data-toggle="counter-up">4,948</p>
                </div>
                <p class="mb-0 textgreen">Entrepreneurs <br>Supported</p>
              </div>
            </div>
    
            <!-- 4 -->
            <div class="col-6 col-md-4 col-lg-3 col-xl-1-7">
              <div class="skills-item text-center rounded pt-2 h-100 wow fadeInUp" data-wow-delay="0.25s">
                <div class="counter-counting d-flex justify-content-center">
                  <p class="fs-2 fw-bold text-dark" data-toggle="counter-up">4,963</p>
                </div>
                <p class="mb-0 textgreen">Women <br>Empowered</p>
              </div>
            </div>
    
            <!-- 5 -->
            <div class="col-6 col-md-4 col-lg-3 col-xl-1-7">
              <div class="skills-item text-center rounded pt-2 h-100 wow fadeInUp" data-wow-delay="0.3s">
                <div class="counter-counting d-flex justify-content-center">
                  <p class="fs-2 fw-bold text-dark" data-toggle="counter-up">1,000</p>
                </div>
                <p class="mb-0 textgreen">Students <br>Skilled</p>
              </div>
            </div>
    
            <!-- 6 (Presence in 11 States) -->
            <div class="col-6 col-md-4 col-lg-3 col-xl-1-7">
              <div class="skills-item text-center rounded pt-0 h-100 wow fadeInUp" data-wow-delay="0.35s">
                <p class="stat-line-top mb-3 text-muted">Presence in</p>
                <div class="counter-counting d-flex justify-content-center">
                  <p class="fs-2 fw-bold text-dark" data-toggle="counter-up">11</p>
                </div>
                <p class="stat-line-bottom textgreen">States</p>
              </div>
            </div>
    
            <!-- 7 (Backed by 15 CSR partners) -->
            <div class="col-6 col-md-4 col-lg-3 col-xl-1-7 mx-auto">
              <div class="skills-item text-center rounded pt-0 h-100 wow fadeInUp" data-wow-delay="0.4s">
                <p class="stat-line-top mb-3 text-muted">Backed by</p>
                <div class="counter-counting d-flex justify-content-center">
                  <p class="fs-2 fw-bold text-dark" data-toggle="counter-up">15</p>
                </div>
                <p class="stat-line-bottom textgreen">CSR partners</p>
              </div>
            </div>
    
          </div><!-- /.row -->
        </div>
      </div>
    </div>
    

    <div class="container-fluid dotted-bg pb-5 px-0 wow fadeIn" data-wow-delay="0.3s">
        <div class="imact-banner">
            <div class="row g-4">
                <div class="col-10 mx-auto">
                    <img class="img-fluid p-0 d-block mx-auto" src="<?= img_path('Map.png') ?>">
                </div>
            </div>
        </div>
    </div>
    
    <!--div class="container-fluid d-block d-md-none bg-light pb-5 px-0 wow fadeIn" data-wow-delay="0.3s">
        <div class="row g-4">
            <div class="col-10 mx-auto">
                <img class="img-fluid d-block mx-auto" src="<?= img_path('impact-mobile-dashboard.png') ?>">
            </div>
        </div>
    </div-->
    
    <!-- whats-happening Start -->
    <div class="container-fluid mobile-bg py-5" id="whats-happening">
        <div class="container py-0 px-lg-5">
            <div class="text-center mx-auto mb-5 d-flex justify-content-center wow fadeInDown" data-wow-delay="0.1s">
                <h2 class="pb-3 mb-0 section-title">Ongoing Programmes and Partnerships</h2>
            </div>
            <div class="owl-carousel happening-carousel wow fadeInDown" data-wow-delay="0.1s">
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-1.png') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid d-block mx-auto" src="<?= img_path('Swades-Foundation-logo.svg') ?>">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">Swades Foundation</h5>
                    <p class="small mb-1"><b>USP:</b> Reaching remote resource-scarce villages with little to no access to opportunities</p>
                    <p class="small mb-1"><b>Intervention:</b> Community-based and Center-based Skilling</p>
                    <p class="small mb-1"><b>Geography:</b> Igatpuri, Trimbak, Peth and Surgana, Maharashtra</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Rural and tribal youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 2,000+ annually</p>
                    <p class="small mb-1"><b>Courses:</b> 20+ courses including Asst. Electrician, Solar Technician, Aari work, SMO</p>
                </div>
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-2.png') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('CreditAccess-logo.png') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">CreditAccess India Foundation</h5>
                    <p class="small mb-1"><b>USP:</b> Making concentrated inroads in particular villages with limited opportunities</p>
                    <p class="small mb-1"><b>Intervention:</b> Community-based and Center-based Skilling</p>
                    <p class="small mb-1"><b>Geography:</b> Madhya Pradesh and Telangana</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Rural youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 600</p>
                    <p class="small mb-1"><b>Courses:</b> General Duty Assistant, Asst. Electrician, Asst. Mason, Tailoring, Solar Technician</p>
                </div>
                <!--div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-3.png') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('BCLPL-logo.png') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">BCLPL</h5>
                    <p class="small mb-1"><b>USP:</b> Technical center-based skilling with opportunities to pursue both jobs and entrepreneurship</p>
                    <p class="small mb-1"><b>Intervention:</b> Center-based Skilling</p>
                    <p class="small mb-1"><b>Geography:</b> Nashik, Maharashtra</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Unemployed youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 100+ annually</p>
                    <p class="small mb-1"><b>Courses:</b> Mobile Repairing, CNC, Asst. Electrician, Computer Hardware and Networking</p>
                </div-->
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-3.png') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('BCLPL-logo.png') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">Blue Cross Laboratories Pvt. Ltd.</h5>
                    <p class="small mb-1"><b>USP:</b> Conducting center-based skill development courses focusing on placements in nearby companies and guidance on self-employment.</p>
                    <p class="small mb-1"><b>Intervention:</b> Skill Development</p>
                    <p class="small mb-1"><b>Geography:</b> Nashik, Maharashtra</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Women and youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 200+ annually</p>
                    <p class="small mb-1"><b>Courses:</b> Mobile Repair, Assistant Electrician, CNC Operator, Computer Hardware and Networking</p>
                </div>
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-4.png') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('Godrej-Boyce-logo.png') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">Godrej & Boyce</h5>
                    <p class="small mb-1"><b>USP:</b> Reaching remote tribal villages and creating construction-related employment opportunities</p>
                    <p class="small mb-1"><b>Intervention:</b> Community-based Skilling</p>
                    <p class="small mb-1"><b>Geography:</b> Maharashtra and Rajasthan</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Rural and tribal youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 100</p>
                    <p class="small mb-1"><b>Courses:</b> Bar-Bender and RCC</p>
                </div>
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-5.png') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('infra-market-logo.png') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">Infra Market</h5>
                    <p class="small mb-1"><b>USP:</b> Working simultaneously across 9 districts in the construction domain</p>
                    <p class="small mb-1"><b>Intervention:</b> Community-based skilling and upskilling</p>
                    <p class="small mb-1"><b>Geography:</b> Haryana, Madhya Pradesh, Chhattisgarh, Jharkhand, Rajasthan, Maharashtra, Karnataka, Telangana, Andhra Pradesh</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Rural youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 2,500</p>
                    <p class="small mb-1"><b>Courses:</b> 20+ construction-related trades</p>
                </div>
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-6.png') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('aak-logo.png') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">AAK</h5>
                    <p class="small mb-1"><b>USP:</b> Engaging youth from remote tribal and semi-urban areas, equipping them with skills for self-employment and secure industry jobs.</p>
                    <p class="small mb-1"><b>Intervention:</b> Center-based and Community-Based Skill Development</p>
                    <p class="small mb-1"><b>Geography:</b> Khalapur (Raigad), Maharashtra</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Rural and Urban Youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 500</p>
                    <p class="small mb-1"><b>Courses:</b> 10+ including HVAC Technician, Multi-Skill Technician (Electrical), Carpenter, Plumber, Assistant Electrician, Welder</p>
                </div>
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-7.webp') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('aditya-birla-logo.png') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">Aditya Birla Fashion and Retail Ltd.</h5>
                    <p class="small mb-1"><b>USP:</b> Conducting community-based skill development courses with a focus on empowering women and integrating them into the formal economy.</p>
                    <p class="small mb-1"><b>Intervention:</b> Skill Development</p>
                    <p class="small mb-1"><b>Geography:</b> Panvel, Maharashtra, and Anekal, Karnataka</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Women and youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 450</p>
                    <p class="small mb-1"><b>Courses:</b> Aari Work, Jewellery Making, Patient Care Assistant, Beautician, Warehouse Packer, and Assistant Electrician</p>
                </div>
                
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-8.webp') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('sai-logo.webp') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">Sai Life Sciences</h5>
                    <p class="small mb-1"><b>USP:</b> Breaking cultural and language barriers to engage unemployed youth in donor-specific communities</p>
                    <p class="small mb-1"><b>Intervention:</b> Community-based and Center-based Skilling</p>
                    <p class="small mb-1"><b>Geography:</b> Hyderabad and Shamirpet, Telangana</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Rural and tribal youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 400</p>
                    <p class="small mb-1"><b>Courses:</b> Asst. Electrician, Plumber, Solar Technician, EV repair and assembly</p>
                </div>
                
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-9.webp') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('rpg-logo.webp') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">RPG</h5>
                    <p class="small mb-1"><b>USP:</b> Curating a tailored programme at donor-specified locations with location-specific linkages</p>
                    <p class="small mb-1"><b>Intervention:</b> Center-based Skilling and Women’s Entrepreneurship Development</p>
                    <p class="small mb-1"><b>Geography:</b> Mumbai (semi-urban), Nasik, Maharashtra</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Women from low-income backgrounds</p>
                    <p class="small mb-1"><b>Total Reach:</b> 250</p>
                    <p class="small mb-1"><b>Courses:</b> GDA in skilling and women’s entrepreneurship</p>
                </div>
                
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-10.webp') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('sun-pharma-logo.webp') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">Sun Pharma</h5>
                    <p class="small mb-1"><b>USP:</b> Initiating linkages and local partnerships to launch programmes in donor-specific locations</p>
                    <p class="small mb-1"><b>Intervention:</b> Women’s Entrepreneurship</p>
                    <p class="small mb-1"><b>Geography:</b> Silvassa, Vadodara, Ankleshwar, Dewas</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Aspiring women entrepreneurs from low income backgrounds</p>
                    <p class="small mb-1"><b>Total Reach:</b> 400</p>
                    <p class="small mb-1"><b>Courses:</b> Women’s entrepreneurship development</p>
                </div>
                
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-11.webp') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('tdk-logo.webp') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">TDK</h5>
                    <p class="small mb-1"><b>USP:</b> Engaging business aspirants in specific new age technical domains</p>
                    <p class="small mb-1"><b>Intervention:</b> Technical Entrepreneurship Development</p>
                    <p class="small mb-1"><b>Geography:</b> Nasik, Maharashtra</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Aspiring entrepreneurs from low-income backgrounds</p>
                    <p class="small mb-1"><b>Total Reach:</b> 100</p>
                    <p class="small mb-1"><b>Courses:</b> Solar, EV, Electric Contractor</p>
                </div>
                    
                <div class="testimonial-item p-3 position-relative bg-white">
                    <div class="d-flex align-items-center mb-4 position-relative">
                        <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('ongoing-programmes-12.webp') ?>" style="border-radius:5px">
                        <div class="position-absolute bottom-0 start-0 p-3">
                            <img class="img-fluid rounded flex-shrink-0" src="<?= img_path('mst-logo.png') ?>" style="border-radius:5px">
                        </div>
                    </div>
                    <h5 class="mb-3 fw-bold title">Department of Science & Technology</h5>
                    <p class="small mb-1"><b>USP:</b> Conducting entrepreneurship development courses in technical domains such as Solar, EV and general entrepreneurship.</p>
                    <p class="small mb-1"><b>Intervention:</b> Entrepreneurship Development</p>
                    <p class="small mb-1"><b>Geography:</b> Nasik, Maharashtra</p>
                    <p class="small mb-1"><b>Beneficiaries:</b> Women and youth</p>
                    <p class="small mb-1"><b>Total Reach:</b> 100+ annually</p>
                    <p class="small mb-1"><b>Courses:</b> Women's Entrepreneurship Development, Technical Entrepreneurship Development, and Faculty Entrepreneurship Development</p>
                </div>
                
            </div>
        </div>
    </div>
    <!-- whats-happening End -->

    <!-- About Start -->
    <div class="container-xxl py-6" id="about">
        <div class="container">
            <div class="row g-0 align-items-center">
                <div class="text-center mx-auto mb-5 d-flex justify-content-center wow fadeInUp" data-wow-delay="0.1s">
                    <h2 class="pb-0 mb-0 section-title middleBottomRight">Invest in India’s Future: Partner With Us</h2>
                </div>
                <div class="col-lg-10 mx-auto">
                    <p class="mb-3 lh-lg">At Unnatva Foundation, we are equipping underserved youth with the skills and entrepreneurial mindset needed to build sustainable careers and businesses. But real impact happens when we come together.</p>
                    <p class="mb-0 lh-lg">Your partnership can:</p>
                    <p class="mb-0 lh-lg">✅ Skill youth for high-demand industries</p>
                    <p class="mb-0 lh-lg">✅ Support aspiring entrepreneurs in launching and scaling their businesses</p>
                    <p class="mb-0 lh-lg">✅ Drive long-term economic growth and social impact</p>
                    <p class="mb-0 lh-lg">Join us in shaping India’s skilled workforce and creating long-term impact.</p> 
                    <p class="mb-0 lh-lg">Let’s build a brighter, more inclusive future together.</p>
                </div>
                <div class="col-lg-10 mt-5 text-center mx-auto">
                    <a href="#" class="rounded-btn" data-bs-toggle="modal" data-bs-target="#popupModal">Partner with us <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>
                </div>

                <!-- Modal -->
                <div class="modal fade custom-modal" id="popupModal" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                      <div class="row g-0">
                        <!-- Form Section -->
                        <div class="col-lg-12 form-section">
                          <button type="button" class="btn-close p-2" data-bs-dismiss="modal" aria-label="Close"></button>
                          <h3>Help us know you better</h3>
                          <p class="fw-semibold">How do you want to contribute?</p>
                          <form>
                            <input type="text" class="form-control" placeholder="Name">
                            <input type="text" class="form-control" placeholder="Company Name">
                            <input type="text" class="form-control" placeholder="Contact Number">
                            <input type="email" class="form-control" placeholder="Business Email">
                
                            <p class="fw-semibold mt-3">In which area do you want to create impact?</p>
                            <div class="impact-options">
                              <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="entrepreneurship">
                                <label class="form-check-label small" for="entrepreneurship">Entrepreneurship</label>
                              </div>
                              <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="skillDev">
                                <label class="form-check-label small" for="skillDev">Skill Development</label>
                              </div>
                              <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="womenEmp">
                                <label class="form-check-label small" for="womenEmp">Women Empowerment</label>
                              </div>
                              <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="education">
                                <label class="form-check-label small" for="education">Education</label>
                              </div>
                            </div>
                
                            <a href="#" class="rounded-btn">Submit <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>
                            <!--button type="submit" class="btn btn-success submit-btn">
                              Submit <i class="bi bi-arrow-right"></i>
                            </button-->
                          </form>
                        </div>
                
                        <!-- Image Section
                        <div class="col-lg-6 image-section">
                          
                        </div> -->
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Modal End-->    
               
            </div>
        </div>
    </div>
    <!-- About End -->


    
    <?= view('layouts/footer') ?>

</body>

</html>