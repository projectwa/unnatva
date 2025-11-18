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
    if (element && !element.hasAttribute('data-mounted')) {
      const slidesData = element.getAttribute('data-slides');
      if (slidesData) {
        try {
          const slides = JSON.parse(slidesData);
          const root = ReactDOM.createRoot(element);
          root.render(React.createElement(HomeCarousel, { slides }));
          element.setAttribute('data-mounted', 'true');
        } catch (error) {
          console.error('Error parsing carousel slides:', error);
        }
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCarousel);
  } else {
    mountCarousel();
  }
}

