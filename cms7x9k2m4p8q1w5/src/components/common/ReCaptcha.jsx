import React, { useEffect, useRef } from 'react';

/**
 * ReCaptcha Component
 * Loads and renders Google reCAPTCHA v2 widget
 * 
 * @param {string} siteKey - Google reCAPTCHA site key
 * @param {function} onChange - Callback when reCAPTCHA is completed: (token) => void
 * @param {function} onExpired - Callback when reCAPTCHA expires: () => void
 * @param {function} onError - Callback when reCAPTCHA errors: () => void
 */
function ReCaptcha({ 
  siteKey, 
  onChange, 
  onExpired, 
  onError 
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const isLoadedRef = useRef(false);

  // Load reCAPTCHA script
  useEffect(() => {
    if (!siteKey) {
      console.warn('ReCaptcha: siteKey is required');
      return;
    }

    // Check if script is already loaded
    if (window.grecaptcha && window.grecaptcha.render) {
      isLoadedRef.current = true;
      renderWidget();
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        isLoadedRef.current = true;
        renderWidget();
      });
      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isLoadedRef.current = true;
      renderWidget();
    };
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
      if (onError) onError();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup: reset widget if it exists
      if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (e) {
          console.warn('Error resetting reCAPTCHA:', e);
        }
      }
    };
  }, [siteKey]);

  // Render the widget
  const renderWidget = () => {
    if (!isLoadedRef.current || !window.grecaptcha || !containerRef.current) {
      return;
    }

    // Clear container
    containerRef.current.innerHTML = '';

    try {
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          if (onChange) onChange(token);
        },
        'expired-callback': () => {
          if (onExpired) onExpired();
        },
        'error-callback': () => {
          if (onError) onError();
        },
      });
    } catch (error) {
      console.error('Error rendering reCAPTCHA:', error);
      if (onError) onError();
    }
  };

  // Re-render widget when siteKey changes
  useEffect(() => {
    if (isLoadedRef.current && containerRef.current && widgetIdRef.current !== null) {
      renderWidget();
    }
  }, [siteKey]);

  return (
    <div 
      ref={containerRef} 
      className="recaptcha-container"
      style={{ display: 'flex', justifyContent: 'center' }}
    />
  );
}

export default ReCaptcha;

