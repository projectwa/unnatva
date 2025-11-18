/**
 * Entry point for Impact Counters component
 * Builds as standalone component for embedding in CI4 views
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import ImpactCounters from '../../standalone/ImpactCounters';

// Mount component when DOM is ready
if (typeof document !== 'undefined') {
  const mountCounters = () => {
    const element = document.getElementById('impact-counters');
    if (element && !element.hasAttribute('data-mounted')) {
      const statsData = element.getAttribute('data-stats');
      if (statsData) {
        try {
          const stats = JSON.parse(statsData);
          const root = ReactDOM.createRoot(element);
          root.render(React.createElement(ImpactCounters, { stats }));
          element.setAttribute('data-mounted', 'true');
        } catch (error) {
          console.error('Error parsing impact stats:', error);
        }
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCounters);
  } else {
    mountCounters();
  }
}

