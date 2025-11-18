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
        setHtml(content);
        setLoading(false);
        
        // Dispatch custom event to notify that content is loaded
        window.dispatchEvent(new CustomEvent('pageContentLoaded', { 
          detail: { endpoint: apiEndpoint } 
        }));
        
        // Initialize scripts after content is loaded
        setTimeout(() => {
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

