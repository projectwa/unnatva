<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UNNATVA CMS</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        #root {
            min-height: 100vh;
        }
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 1.2rem;
            color: #666;
        }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading">Loading CMS...</div>
    </div>
    
    <!-- React Admin SPA bundle (includes React) -->
    <script>
        // Ensure DOM is ready and add error handling before loading app.js
        (function() {
            console.log('Preparing to load React app...');
            console.log('Root element exists:', !!document.getElementById('root'));
            
            // Error handling for React app - catch ALL errors
            window.addEventListener('error', function(e) {
                console.error('=== GLOBAL ERROR HANDLER ===');
                console.error('JavaScript Error:', e.error);
                console.error('Error details:', {
                    message: e.message,
                    filename: e.filename,
                    lineno: e.lineno,
                    colno: e.colno,
                    error: e.error,
                    stack: e.error ? e.error.stack : 'No stack'
                });
                
                // Show error for ANY error, not just app.js errors
                const errorMsg = e.error ? e.error.message : e.message;
                const root = document.getElementById('root');
                if (root && !root.innerHTML.includes('Error Loading')) {
                    root.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>Error Loading CMS</h2><p>Check browser console (F12) for details.</p><p><strong>Error:</strong> ' + errorMsg + '</p><p><strong>File:</strong> ' + (e.filename || 'unknown') + '</p><p><strong>Line:</strong> ' + (e.lineno || 'unknown') + '</p><pre style="text-align: left; background: #f5f5f5; padding: 10px; max-height: 200px; overflow: auto;">' + (e.error && e.error.stack ? e.error.stack : 'No stack trace') + '</pre></div>';
                }
            }, true); // Use capture phase to catch more errors
            
            // Also catch unhandled promise rejections
            window.addEventListener('unhandledrejection', function(e) {
                console.error('=== UNHANDLED PROMISE REJECTION ===');
                console.error('Reason:', e.reason);
                console.error('Promise:', e.promise);
            });
            
            // Load the app.js script
            const script = document.createElement('script');
            script.src = '/cms7x9k2m4p8q1w5/app.js';
            script.onerror = function() {
                console.error('Failed to load app.js');
                const root = document.getElementById('root');
                if (root) {
                    root.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>Error Loading CMS</h2><p>Failed to load app.js file. Please check that the file exists and you have rebuilt the app.</p></div>';
                }
            };
            script.onload = function() {
                console.log('app.js script loaded');
                
                // Try to catch any errors from the IIFE execution
                try {
                    // Check if React is available
                    console.log('Checking for React...');
                    console.log('window.React:', typeof window.React);
                    console.log('window.ReactDOM:', typeof window.ReactDOM);
                    
                    // Check root element state
                    const root = document.getElementById('root');
                    console.log('Root element after script load:', root);
                    console.log('Root innerHTML length:', root ? root.innerHTML.length : 0);
                    console.log('Root children count:', root ? root.children.length : 0);
                    
                    // Wait a bit and check again
                    setTimeout(function() {
                        const root2 = document.getElementById('root');
                        console.log('Root after 500ms:', root2);
                        console.log('Root innerHTML after 500ms:', root2 ? root2.innerHTML.substring(0, 100) : 'null');
                        console.log('Root children after 500ms:', root2 ? root2.children.length : 0);
                        
                        if (root2 && (root2.innerHTML.includes('Loading CMS...') || root2.children.length === 0)) {
                            console.error('React did not mount!');
                            console.error('This suggests the IIFE executed but React.createRoot() failed or was not called.');
                            
                            // Try to manually check if we can access React
                            if (window.CMSApp) {
                                console.log('CMSApp global exists:', window.CMSApp);
                            } else {
                                console.warn('CMSApp global does not exist (this is normal for IIFE)');
                            }
                        }
                    }, 500);
                } catch (e) {
                    console.error('Error checking React mount:', e);
                }
            };
            document.body.appendChild(script);
        })();
    </script>
    <script>
        
        // Check if React mounted after a delay
        setTimeout(function() {
            const root = document.getElementById('root');
            if (root && (root.innerHTML.includes('Loading CMS...') || root.innerHTML.trim() === '')) {
                console.warn('React app may not have mounted. Checking...');
                console.log('Root innerHTML:', root.innerHTML);
                console.log('Root children:', root.children.length);
                
                // Check if React actually mounted
                if (root.children.length === 0 || root.innerHTML.includes('Loading CMS...')) {
                    root.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>CMS Not Loading</h2><p>The React app loaded but did not mount.</p><p>Please check:</p><ul style="text-align: left; display: inline-block;"><li>Browser console (F12) for errors</li><li>That app.js executed without errors</li><li>That ReactDOM.createRoot was called</li></ul><p><strong>Note:</strong> Open the browser console and look for any error messages.</p></div>';
                }
            }
        }, 5000);
    </script>
</body>
</html>

