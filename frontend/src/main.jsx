/**
 * Main entry point for React SPA
 * This is the entry point that will be built as app.js
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import './styles/footer-overrides.css';
import './styles/header-overrides.css';

// Initialize WOW.js and other libraries when available
if (typeof window !== 'undefined') {
  // These will be loaded from the SPA template
  window.addEventListener('DOMContentLoaded', () => {
    if (window.WOW) {
      new window.WOW().init();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

