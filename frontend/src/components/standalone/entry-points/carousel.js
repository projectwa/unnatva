/**
 * Entry point for Home Carousel component
 * Builds as standalone component for embedding in CI4 views
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import HomeCarousel from '../../standalone/HomeCarousel';

// Mount component when DOM is ready
if (typeof document !== 'undefined') {
  const mountCarousel = () => {
    const element = document.getElementById('home-carousel');
    console.log('Carousel entry point - Looking for element:', element);
    
    if (!element) {
      console.warn('Carousel entry point - Element #home-carousel not found');
      return;
    }
    
    if (element.hasAttribute('data-mounted')) {
      console.log('Carousel entry point - Already mounted, skipping');
      return;
    }
    
    const slidesData = element.getAttribute('data-slides');
    console.log('Carousel entry point - Slides data:', slidesData);
    
    if (!slidesData || slidesData === '[]' || slidesData.trim() === '') {
      console.warn('Carousel entry point - No slides data provided');
      return;
    }
    
    try {
      const slides = JSON.parse(slidesData);
      console.log('Carousel entry point - Parsed slides:', slides);
      console.log('Carousel entry point - Slides count:', slides?.length || 0);
      
      if (!Array.isArray(slides) || slides.length === 0) {
        console.warn('Carousel entry point - No slides in array');
        return;
      }
      
      const root = ReactDOM.createRoot(element);
      root.render(React.createElement(HomeCarousel, { slides }));
      element.setAttribute('data-mounted', 'true');
      console.log('Carousel entry point - Component mounted successfully');
    } catch (error) {
      console.error('Carousel entry point - Error parsing carousel slides:', error);
      console.error('Carousel entry point - Slides data that failed:', slidesData);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCarousel);
  } else {
    mountCarousel();
  }
}

