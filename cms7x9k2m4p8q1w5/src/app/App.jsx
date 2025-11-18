import React, { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';

function App() {
  console.log('App component rendering...');
  
  // Determine basename based on actual pathname - only calculate once
  // If pathname includes /index.php/, use that, otherwise use the clean path
  const basename = useMemo(() => {
    const pathname = window.location.pathname;
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      return '/index.php/cms7x9k2m4p8q1w5';
    } else if (pathname.startsWith('/cms7x9k2m4p8q1w5')) {
      return '/cms7x9k2m4p8q1w5';
    }
    return '/cms7x9k2m4p8q1w5';
  }, []); // Empty dependency array - only calculate once
  
  console.log('Using basename:', basename);
  
  try {
    return (
      <BrowserRouter basename={basename}>
        <Router />
      </BrowserRouter>
    );
  } catch (error) {
    console.error('App component error:', error);
    console.error('Error stack:', error.stack);
    return (
      <div style={{ padding: '20px', background: '#fee', border: '2px solid red' }}>
        <h2>Error in App Component</h2>
        <p><strong>Error:</strong> {error.message}</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', fontSize: '12px' }}>
          {error.stack}
        </pre>
      </div>
    );
  }
}

export default App;

