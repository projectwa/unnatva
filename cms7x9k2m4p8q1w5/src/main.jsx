import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './app/App';
import './styles/main.css';

// Ensure DOM is ready and add error handling
function initApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }
  
  try {
    console.log('Initializing React app...');
    console.log('Root element before render:', rootElement);
    console.log('Root innerHTML before render:', rootElement.innerHTML.substring(0, 100));
    
    const root = ReactDOM.createRoot(rootElement);
    console.log('ReactDOM.createRoot called, root object:', root);
    
    // Add error boundary
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      
      componentDidCatch(error, errorInfo) {
        console.error('=== React Error Boundary caught an error ===');
        console.error('Error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error Info:', errorInfo);
        console.error('Component Stack:', errorInfo.componentStack);
      }
      
      render() {
        if (this.state.hasError) {
          const error = this.state.error;
          const errorMessage = error?.message || error?.toString() || 'An unknown error occurred';
          const errorStack = error?.stack || 'No stack trace available';
          
          return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>Error Loading CMS</h2>
              <p>Check browser console (F12) for details.</p>
              <div style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
                <p><strong>Error:</strong> {errorMessage}</p>
                <p><strong>File:</strong> {error?.fileName || 'unknown'}</p>
                <p><strong>Line:</strong> {error?.lineNumber || 'unknown'}</p>
                <p><strong>Stack trace:</strong></p>
                <pre style={{ background: '#fff', padding: '10px', maxHeight: '200px', overflow: 'auto', fontSize: '12px' }}>
                  {errorStack}
                </pre>
              </div>
            </div>
          );
        }
        
        return this.props.children;
      }
    }
    
    // Disable StrictMode temporarily to prevent double renders that might cause issues
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    
    console.log('React app initialized successfully');
    
    // Check root immediately after render
    setTimeout(() => {
      console.log('Root element after render (100ms):', rootElement);
      console.log('Root innerHTML after render:', rootElement.innerHTML.substring(0, 200));
      console.log('Root children after render:', rootElement.children.length);
      console.log('Root first child:', rootElement.firstChild);
    }, 100);
    
    // Check again after a longer delay
    setTimeout(() => {
      console.log('Root element after render (1000ms):', rootElement);
      console.log('Root innerHTML after render (1000ms):', rootElement.innerHTML.substring(0, 200));
      console.log('Root children after render (1000ms):', rootElement.children.length);
    }, 1000);
  } catch (error) {
    console.error('Error initializing React app:', error);
    console.error('Error stack:', error.stack);
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>Error Loading CMS</h2><p>' + error.message + '</p></div>';
  }
}

// Add global error handlers to prevent page reloads
window.addEventListener('error', (event) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('JavaScript Error:', event.error?.message || event.message || 'Unknown error');
  console.error('Error details:', {
    error: event.error,
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
  // Don't prevent default - let React Error Boundary handle it
  // event.preventDefault();
  return false;
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('=== UNHANDLED PROMISE REJECTION ===');
  console.error('Unhandled promise rejection:', event.reason);
  console.error('Reason details:', {
    reason: event.reason,
    message: event.reason?.message,
    stack: event.reason?.stack
  });
  // Don't prevent default - let React Error Boundary handle it
  // event.preventDefault();
  return false;
});

// Execute immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

