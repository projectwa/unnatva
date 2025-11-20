/**
 * Generic page content component
 * Fetches server-rendered HTML from CI4 API and injects it
 */

import React, { useEffect, useState, useRef } from 'react';
import SEO from '../seo/SEO';

function PageContent({ apiEndpoint, title, description, keywords }) {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  // Set body class when HTML content changes
  useEffect(() => {
    if (!html) return;
    
    // Use a small timeout to ensure DOM is updated
    const timer = setTimeout(() => {
      const pageContent = document.querySelector('.page-content');
      if (pageContent) {
        const pageType = pageContent.getAttribute('data-page');
        if (pageType) {
          // Remove existing page classes
          document.body.classList.remove('act_home', 'act_about', 'act_contact', 'act_impact', 'act_successStory', 'act_ourInitiatives', 'act_media');
          // Add appropriate class
          if (pageType.includes('entrepreneurship') || pageType.includes('skill') || pageType.includes('education') || pageType.includes('women')) {
            document.body.classList.add('act_ourInitiatives');
          } else if (pageType === 'home') {
            document.body.classList.add('act_home');
          } else if (pageType === 'about') {
            document.body.classList.add('act_about');
          } else if (pageType === 'contact') {
            document.body.classList.add('act_contact');
          } else if (pageType === 'impact') {
            document.body.classList.add('act_impact');
          } else if (pageType === 'success-stories') {
            document.body.classList.add('act_successStory');
          } else if (pageType === 'media') {
            document.body.classList.add('act_media');
          }
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [html]);

  useEffect(() => {
    setLoading(true);
    setHtml(''); // Clear previous content
    
    fetch(apiEndpoint)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(content => {
        if (!content || content.trim().length === 0) {
          throw new Error('Empty response from server');
        }
        
        // Remove old Bootstrap modal HTML from content
        // This prevents the old modal from appearing behind the React form
        let cleanedContent = content;
        
        // Create a temporary DOM element to parse and clean HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        // Find and remove all popupModal elements and their entire content
        const modals = tempDiv.querySelectorAll('#popupModal');
        modals.forEach(modal => {
          // Remove the entire modal including all its children
          modal.remove();
        });
        
        // Get cleaned HTML
        cleanedContent = tempDiv.innerHTML;
        
        setHtml(cleanedContent);
        setLoading(false);
        
        // Dispatch custom event to notify that content is loaded
        window.dispatchEvent(new CustomEvent('pageContentLoaded', { 
          detail: { endpoint: apiEndpoint } 
        }));
        
        // Initialize scripts after content is loaded
        setTimeout(() => {
          // Load standalone React components (carousel, counters) if needed
          const loadStandaloneComponent = (scriptPath, checkElement) => {
            if (document.querySelector(checkElement) && !document.querySelector(`script[src="${scriptPath}"]`)) {
              // Get base URL from current page (handles both / and /index.php/ paths)
              const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
              const fullPath = basePath + scriptPath;
              
              const script = document.createElement('script');
              script.src = fullPath;
              script.defer = true;
              script.onerror = () => {
                console.error(`Failed to load component: ${fullPath}`);
                console.error('Make sure to run: cd frontend && npm run build:components');
              };
              script.onload = () => {
                console.log(`Successfully loaded standalone component: ${fullPath}`);
              };
              document.body.appendChild(script);
              console.log(`Loading standalone component: ${fullPath}`);
            }
          };

          // Load carousel component if carousel element exists
          loadStandaloneComponent('/js/react/components/carousel.js', '#home-carousel');
          
          // Load counters component if counters element exists
          loadStandaloneComponent('/js/react/components/counters.js', '#impact-counters');

          // Remove any old Bootstrap modals that might have been injected
          const removeOldModals = () => {
            const modals = document.querySelectorAll('#popupModal');
            modals.forEach(modal => {
              // Only remove if it's not the placeholder
              if (modal.querySelector('.form-section')) {
                // This is the full modal, remove the form-section content
                const formSection = modal.querySelector('.form-section');
                if (formSection) {
                  formSection.remove();
                }
                // Hide the modal itself
                modal.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; z-index: -9999 !important; position: fixed !important; top: -9999px !important; left: -9999px !important; width: 0 !important; height: 0 !important; overflow: hidden !important;';
              }
            });
          };
          
          // Remove modals immediately and after a delay
          removeOldModals();
          setTimeout(removeOldModals, 100);
          setTimeout(removeOldModals, 500);

          // Handle media page category button clicks and active state
          const initMediaCategoryButtons = () => {
            const mediaPage = document.querySelector('.page-content[data-page="media"]');
            if (!mediaPage) return;

            const categoryButtons = mediaPage.querySelectorAll('.nav-pills a[data-bs-toggle="pill"]');
            const tabPanes = mediaPage.querySelectorAll('.tab-pane');

            categoryButtons.forEach(button => {
              // Remove existing listeners by cloning
              const newButton = button.cloneNode(true);
              button.parentNode.replaceChild(newButton, button);

              newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const targetTab = newButton.getAttribute('href');
                if (!targetTab) return;

                // Get fresh references to all buttons and panes
                const allButtons = mediaPage.querySelectorAll('.nav-pills a[data-bs-toggle="pill"]');
                const allPanes = mediaPage.querySelectorAll('.tab-pane');

                // Remove active class from all buttons
                allButtons.forEach(btn => {
                  btn.classList.remove('active');
                });

                // Add active class to clicked button
                newButton.classList.add('active');

                // Hide all tab panes
                allPanes.forEach(pane => {
                  pane.classList.remove('show', 'active');
                  pane.classList.add('fade');
                });

                // Show target tab pane
                const targetPane = mediaPage.querySelector(targetTab);
                if (targetPane) {
                  targetPane.classList.add('show', 'active');
                  targetPane.classList.remove('fade');
                }

                // Update Bootstrap's internal state if available
                if (window.bootstrap && window.bootstrap.Tab) {
                  try {
                    const tab = new window.bootstrap.Tab(newButton);
                    tab.show();
                  } catch (err) {
                    // Bootstrap Tab might not be available, that's okay
                  }
                }
              });
            });
          };

          // Initialize media category buttons
          initMediaCategoryButtons();
          setTimeout(initMediaCategoryButtons, 100);
          setTimeout(initMediaCategoryButtons, 500);

          // Attach enquiry form handlers to buttons
          const attachEnquiryFormHandlers = () => {
            // Find all buttons with data-enquiry-form attribute or buttons that should open enquiry form
            const enquiryButtons = document.querySelectorAll('[data-enquiry-form], [data-bs-toggle="modal"][data-bs-target="#popupModal"]');
            
            if (enquiryButtons.length === 0) {
              console.log('No enquiry buttons found');
              return;
            }
            
            console.log(`Found ${enquiryButtons.length} enquiry buttons`);
            
            enquiryButtons.forEach((button, index) => {
              // Skip if already processed (has data-enquiry-handler attribute)
              if (button.hasAttribute('data-enquiry-handler')) {
                return;
              }
              
              // Mark as processed
              button.setAttribute('data-enquiry-handler', 'true');
              
              button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                console.log('Enquiry button clicked', button);
                
                // Prevent Bootstrap modal from showing
                const modal = document.getElementById('popupModal');
                if (modal) {
                  // Hide Bootstrap modal if it's visible
                  if (window.bootstrap && window.bootstrap.Modal) {
                    const bsModal = window.bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                      bsModal.hide();
                    }
                  }
                  // Also hide it directly
                  modal.style.display = 'none';
                  modal.classList.remove('show');
                  document.body.classList.remove('modal-open');
                  const backdrop = document.querySelector('.modal-backdrop');
                  if (backdrop) {
                    backdrop.remove();
                  }
                }
                
                // Get source page from button data attribute or URL
                const sourcePage = button.getAttribute('data-source-page') || 
                                  getSourcePageFromURL();
                
                console.log('Dispatching openEnquiryForm event with sourcePage:', sourcePage);
                
                // Dispatch custom event to open enquiry form
                const event = new CustomEvent('openEnquiryForm', { 
                  detail: { sourcePage },
                  bubbles: true,
                  cancelable: true
                });
                window.dispatchEvent(event);
              }, true); // Use capture phase
            });
          };

          const getSourcePageFromURL = () => {
            const path = window.location.pathname;
            if (path === '/' || path.includes('home')) return 'home';
            if (path.includes('impact')) return 'impact';
            if (path.includes('entrepreneurship-development')) return 'entrepreneurship-development';
            if (path.includes('skill-development')) return 'skill-development';
            if (path.includes('education')) return 'education';
            if (path.includes('women-empowerment')) return 'women-empowerment';
            return 'other';
          };

          // Attach handlers immediately
          attachEnquiryFormHandlers();
          
          // Prevent Bootstrap modal from opening for enquiry form buttons
          const preventBootstrapModal = (e) => {
            const target = e.target.closest('[data-bs-toggle="modal"][data-bs-target="#popupModal"]');
            if (target && target.hasAttribute('data-enquiry-handler')) {
              // This button already has our handler, let it handle the click
              return;
            }
            
            if (target) {
              // Check if this button should trigger React form instead
              const sourcePage = target.getAttribute('data-source-page');
              if (sourcePage || target.hasAttribute('data-source-page')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Hide modal if it's trying to open
                const modal = document.getElementById('popupModal');
                if (modal) {
                  if (window.bootstrap && window.bootstrap.Modal) {
                    const bsModal = window.bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                      bsModal.hide();
                    }
                  }
                  modal.style.display = 'none';
                  modal.classList.remove('show');
                  document.body.classList.remove('modal-open');
                  const backdrop = document.querySelector('.modal-backdrop');
                  if (backdrop) {
                    backdrop.remove();
                  }
                }
                
                // Dispatch React form event
                const page = sourcePage || getSourcePageFromURL();
                window.dispatchEvent(new CustomEvent('openEnquiryForm', { 
                  detail: { sourcePage: page },
                  bubbles: true,
                  cancelable: true
                }));
                
                return false;
              }
            }
          };
          
          // Add global click handler to prevent Bootstrap modal (but don't interfere with our handlers)
          document.addEventListener('click', preventBootstrapModal, true); // Use capture phase
          
          // Re-attach handlers after delays to catch dynamically rendered buttons (like ImpactCounters)
          setTimeout(() => {
            attachEnquiryFormHandlers();
          }, 100);
          setTimeout(() => {
            attachEnquiryFormHandlers();
          }, 500);
          setTimeout(() => {
            attachEnquiryFormHandlers();
          }, 1000);

          // WOW.js initialization
          if (window.WOW) {
            new window.WOW().init();
          }
          
          // Counter animation
          if (window.counterUp) {
            const counters = document.querySelectorAll('[data-toggle="counter-up"]');
            counters.forEach(counter => {
              window.counterUp(counter);
            });
          }
          
          // Owl Carousel initialization
          if (window.$ && window.$.fn.owlCarousel) {
            // Vendor carousel
            if (document.querySelector('.vendor-carousel2')) {
              window.$('.vendor-carousel2').owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: false,
                autoplay: true,
                autoplayTimeout: 3000,
                responsive: {
                  0: { items: 2 },
                  576: { items: 3 },
                  768: { items: 4 },
                  992: { items: 5 },
                  1200: { items: 6 }
                }
              });
            }
            
            // Happening carousel
            if (document.querySelector('.happening-carousel')) {
              window.$('.happening-carousel').owlCarousel({
                loop: true,
                margin: 30,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                responsive: {
                  0: { items: 1 },
                  768: { items: 2 },
                  992: { items: 3 }
                }
              });
            }
          }
          
          // Video Modal Logic
          const modal = document.getElementById('videoModal');
          const iframe = document.getElementById('youtubeVideo');
          const closeBtn = modal?.querySelector('.close');
          
          const openModal = (url) => {
            if (modal && iframe) {
              const sep = url.includes('?') ? '&' : '?';
              iframe.src = url + sep + 'autoplay=1&modestbranding=1&rel=0';
              modal.style.display = 'block';
              document.body.style.overflow = 'hidden';
            }
          };
          
          const closeModal = () => {
            if (modal && iframe) {
              modal.style.display = 'none';
              iframe.src = '';
              document.body.style.overflow = '';
            }
          };
          
          document.addEventListener('click', function (e) {
            const trigger = e.target.closest('[data-video]');
            if (trigger) {
              e.preventDefault();
              openModal(trigger.getAttribute('data-video'));
              return;
            }
            if (e.target === modal) {
              closeModal();
            }
          });
          
          closeBtn?.addEventListener('click', closeModal);
          document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal?.style.display === 'block') closeModal();
          });
        }, 100);
      })
      .catch(error => {
        console.error('Error loading page content:', error);
        console.error('API Endpoint:', apiEndpoint);
        setHtml(`<div class="container py-6"><div class="alert alert-danger"><h4>Error Loading Content</h4><p>${error.message}</p><p>Please try refreshing the page or contact support if the problem persists.</p></div></div>`);
        setLoading(false);
      });
  }, [apiEndpoint]);

  if (loading) {
    return (
      <>
        <SEO title={title} description={description} keywords={keywords} />
        <div className="container py-6 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title={title} description={description} keywords={keywords} />
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}

export default PageContent;

