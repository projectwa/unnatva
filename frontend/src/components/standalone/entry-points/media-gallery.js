/**
 * Entry point for Media Gallery component
 * Builds as standalone component for embedding in CI4 views
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import MediaGallery from '../../standalone/MediaGallery';

// Mount component when DOM is ready
if (typeof document !== 'undefined') {
  const mountMediaGallery = () => {
    const element = document.getElementById('media-gallery');
    console.log('Media Gallery entry point - Looking for element:', element);
    
    if (!element) {
      console.warn('Media Gallery entry point - Element #media-gallery not found');
      return;
    }
    
    if (element.hasAttribute('data-mounted')) {
      console.log('Media Gallery entry point - Already mounted, skipping');
      return;
    }
    
    // Get categories from data attribute if provided
    const categoriesData = element.getAttribute('data-categories');
    let categories = [];
    
    if (categoriesData && categoriesData !== '[]' && categoriesData.trim() !== '') {
      try {
        categories = JSON.parse(categoriesData);
        console.log('Media Gallery entry point - Parsed categories:', categories);
      } catch (error) {
        console.error('Media Gallery entry point - Error parsing categories:', error);
      }
    }
    
    const root = ReactDOM.createRoot(element);
    root.render(React.createElement(MediaGallery, { categories }));
    element.setAttribute('data-mounted', 'true');
    console.log('Media Gallery entry point - Component mounted successfully');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountMediaGallery);
  } else {
    mountMediaGallery();
  }
}

