<!-- Modal - REMOVED: Replaced by React-Bootstrap EnquiryForm -->
<!-- Old Bootstrap modal HTML commented out to prevent rendering -->
<!--
<div class="modal fade custom-modal" id="popupModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
            <div class="row g-0">
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
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
-->
<!-- Create a placeholder div to prevent JavaScript errors if code tries to access #popupModal -->
<div id="popupModal" style="display: none !important; visibility: hidden !important; position: absolute !important; top: -9999px !important; left: -9999px !important; width: 0 !important; height: 0 !important; overflow: hidden !important; z-index: -9999 !important;" aria-hidden="true"></div>

<!-- Footer Start -->
<div class="container-fluid bg-dark footer mb-6 mb-0 py-6 wow fadeIn" data-wow-delay="0.1s">
    <div class="container">
        <div class="row g-3">
            <div class="col-12 col-sm-12 col-md-4 me-0 me-md-5">
                <h2 class="text-primary mb-4 footer-title">
                    Unnatva Foundation
                    <small>A non-profit arm of <a href="https://udyogwardhini.com" target="_blank" class="text-dark">Udyogwardhini</a></small>
                </h2>
                <p class="my-2 d-flex align-items-start" style="max-width:85%"><img class="img-fluid me-2" src="<?= img_path('footer-location.png') ?>" alt="">Head office: 3, Nirman Inspire, Kanherewadi, Opp. Old CBS, Nashik</p>
                <p class="mb-2 d-flex align-items-center"><a href="mailto:hello@unnatva.org" class="text-dark"><img class="img-fluid me-2" src="<?= img_path('footer-email.png') ?>" alt="">Email: hello@unnatva.org</a></p>
            </div>
            
            <div class="col-12 col-sm-6 col-md-3 me-0 me-md-5">
                <div class="row">
                    <div class="col-6 col-md-6 p-md-0">
                        <a class="btn btn-link" href="<?= base_url() ?>">Home</a>
                        <a class="btn btn-link" href="<?= base_url('about') ?>">About Us</a>
                        <a class="btn btn-link" href="<?= base_url('impact') ?>">Impact</a>
                        <a class="btn btn-link" href="<?= base_url() ?>">Annual Report</a>
                    </div>
                    <div class="col-6 col-md-6 p-md-0">
                        <a class="btn btn-link" href="<?= base_url('about#nationalAwards') ?>">Awards</a>
                        <a class="btn btn-link" href="<?= base_url('about#ourTeam') ?>">Our Team</a>
                        <a class="btn btn-link" href="<?= base_url('about#careers') ?>">Careers</a>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-2">
                <a class="btn btn-link" href="<?= base_url('media') ?>">Media</a>
                <a class="btn btn-link" href="https://www.linkedin.com/company/unnatva-foundation/" target="_blank">LinkedIN</a>
                <a class="btn btn-link" href="<?= base_url('privacy-policy') ?>">Privacy Policy</a>
            </div>
            <div class="col-md-12 mt-4">
                <div class="social-links d-flex">
                    <a href="<?= base_url('contact') ?>" class="rounded-btn social-btn me-1" style="width:fit-content"><span>Contact Us</span> <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>
                    <a href="https://www.instagram.com/unnatva_foundation?igsh=OXA1cHB1dmwwMmoz" target="_blank" class="btn social-btn me-1"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/company/unnatva-foundation/" class="btn social-btn me-1" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                    <a href="https://www.facebook.com/profile.php?id=61570081064824" class="btn social-btn me-1" target="_blank"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://youtube.com/@unnatvafoundation?si=r5bL30awDIv8pt2W" class="btn social-btn me-0" target="_blank"><i class="fab fa-youtube"></i></a> 
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Footer End -->

<!-- Copyright Start -->
<div class="container-fluid copyright text-light py-1 wow fadeIn" data-wow-delay="0.1s">
    <div class="container">
        <div class="row">
            <div class="col-md-12 text-end mb-3 mb-md-0">
                &nbsp;
            </div>
        </div>
    </div>
</div>
<!-- Copyright End -->

<!-- Back to Top -->
<a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>

<!-- JavaScript Libraries -->
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= lib_path('wow/wow.min.js') ?>"></script>
<script src="<?= lib_path('easing/easing.min.js') ?>"></script>
<script src="<?= lib_path('waypoints/waypoints.min.js') ?>"></script>
<script src="<?= lib_path('owlcarousel/owl.carousel.min.js') ?>"></script>
<script src="<?= lib_path('slick/slick.min.js') ?>"></script>
<script src="<?= lib_path('counterup/counterup.min.js') ?>"></script>
<script src="<?= lib_path('lightbox/js/lightbox.min.js') ?>" type="text/javascript"></script>
<!-- Template Javascript -->
<script src="<?= js_path('main.js') ?>"></script>

<!-- Prevent old Bootstrap modal from showing (replaced by React-Bootstrap EnquiryForm) -->
<script>
  (function() {
    function hideOldModal() {
      // Hide all popupModal instances
      const modals = document.querySelectorAll('#popupModal');
      modals.forEach(modal => {
        modal.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; z-index: -9999 !important; position: fixed !important; top: -9999px !important; left: -9999px !important; width: 0 !important; height: 0 !important; overflow: hidden !important;';
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-modal', 'false');
        
        // Hide all children with aggressive styles
        const children = modal.querySelectorAll('*');
        children.forEach(child => {
          child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important; overflow: hidden !important; position: absolute !important; top: -9999px !important; left: -9999px !important; z-index: -9999 !important;';
        });
      });
      
      // Remove backdrop
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => {
        backdrop.remove();
      });
      
      // Remove modal-open class
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    // Hide immediately
    hideOldModal();
    
    // Hide on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hideOldModal);
    } else {
      hideOldModal();
    }
    
    // Hide after a short delay to catch late renders
    setTimeout(hideOldModal, 100);
    setTimeout(hideOldModal, 500);
    setTimeout(hideOldModal, 1000);
    
    // Prevent Bootstrap from showing the modal
    if (window.bootstrap && window.bootstrap.Modal) {
      // Override Modal.show() for popupModal
      const originalShow = window.bootstrap.Modal.prototype.show;
      window.bootstrap.Modal.prototype.show = function() {
        if (this._element && this._element.id === 'popupModal') {
          hideOldModal();
          return;
        }
        return originalShow.call(this);
      };
    }
    
    // Watch for modal show events and prevent them
    document.addEventListener('show.bs.modal', function(e) {
      if (e.target && e.target.id === 'popupModal') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        hideOldModal();
        return false;
      }
    }, true);
    
    // Watch for shown events and hide immediately
    document.addEventListener('shown.bs.modal', function(e) {
      if (e.target && e.target.id === 'popupModal') {
        hideOldModal();
      }
    }, true);
    
    // Continuously monitor and hide
    setInterval(hideOldModal, 500);
    
    // Also remove modal HTML if it gets injected dynamically
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Check if the added node is the modal or contains it
            if (node.id === 'popupModal' || node.querySelector && node.querySelector('#popupModal')) {
              hideOldModal();
              // Try to remove it entirely
              const modalToRemove = node.id === 'popupModal' ? node : node.querySelector('#popupModal');
              if (modalToRemove && modalToRemove.parentNode) {
                // Don't remove the placeholder, but hide everything else
                const formSection = modalToRemove.querySelector('.form-section');
                if (formSection) {
                  formSection.remove();
                }
              }
            }
          }
        });
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  })();
</script>

<!-- Job Application Form is handled by React SPA (loaded via / route) -->

