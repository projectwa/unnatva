import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Person, Lock, ShieldCheck } from 'react-bootstrap-icons';
import { authAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import { getRecaptchaSiteKey } from '../utils/recaptcha';
import logoUrl from '../img/logo.svg?url';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [requiresRecaptcha, setRequiresRecaptcha] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaLoadedRef = useRef(false);
  const navigate = useNavigate();

  // Load reCAPTCHA v3 script
  useEffect(() => {
    const siteKey = getRecaptchaSiteKey();
    if (!siteKey) {
      console.warn('reCAPTCHA site key not found');
      return;
    }

    // Check if already loaded and ready
    if (window.grecaptcha && window.grecaptcha.execute) {
      // Use grecaptcha.ready() to ensure it's fully initialized
      window.grecaptcha.ready(() => {
        recaptchaLoadedRef.current = true;
        console.log('reCAPTCHA v3 already loaded and ready');
      });
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      // Wait for grecaptcha to be available
      const checkReady = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.execute) {
          window.grecaptcha.ready(() => {
            recaptchaLoadedRef.current = true;
            console.log('reCAPTCHA v3 loaded from existing script');
          });
          clearInterval(checkReady);
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkReady);
        if (!recaptchaLoadedRef.current) {
          console.error('reCAPTCHA v3 failed to load from existing script');
        }
      }, 5000);
      
      return;
    }

    // Load reCAPTCHA v3 script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait for grecaptcha to be available
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          recaptchaLoadedRef.current = true;
          console.log('reCAPTCHA v3 script loaded and ready');
        });
      } else {
        // Fallback: check periodically
        const checkReady = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            window.grecaptcha.ready(() => {
              recaptchaLoadedRef.current = true;
              console.log('reCAPTCHA v3 ready after delay');
            });
            clearInterval(checkReady);
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkReady);
          if (!recaptchaLoadedRef.current) {
            console.error('reCAPTCHA v3 failed to initialize');
          }
        }, 5000);
      }
    };
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA v3 script');
      recaptchaLoadedRef.current = false;
    };
    document.head.appendChild(script);
  }, []);

  // Load login attempts from localStorage
  useEffect(() => {
    const attempts = parseInt(localStorage.getItem('login_attempts') || '0', 10);
    setLoginAttempts(attempts);
    if (attempts >= 2) {
      setRequiresRecaptcha(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Execute reCAPTCHA v3 and get token
  const executeRecaptcha = async () => {
    if (!requiresRecaptcha) {
      return null;
    }

    const siteKey = getRecaptchaSiteKey();
    if (!siteKey) {
      throw new Error('reCAPTCHA configuration error. Please contact administrator.');
    }

    // Wait for grecaptcha to be ready
    return new Promise((resolve, reject) => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(async () => {
          try {
            if (!window.grecaptcha.execute) {
              throw new Error('reCAPTCHA execute function not available');
            }
            const token = await window.grecaptcha.execute(siteKey, { action: 'login' });
            console.log('reCAPTCHA v3 token generated successfully');
            resolve(token);
          } catch (error) {
            console.error('Error executing reCAPTCHA v3:', error);
            reject(new Error('reCAPTCHA verification failed. Please try again.'));
          }
        });
      } else {
        // Wait a bit and try again
        const checkInterval = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            clearInterval(checkInterval);
            window.grecaptcha.ready(async () => {
              try {
                const token = await window.grecaptcha.execute(siteKey, { action: 'login' });
                console.log('reCAPTCHA v3 token generated successfully (delayed)');
                resolve(token);
              } catch (error) {
                console.error('Error executing reCAPTCHA v3:', error);
                reject(new Error('reCAPTCHA verification failed. Please try again.'));
              }
            });
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!window.grecaptcha || !window.grecaptcha.execute) {
            reject(new Error('reCAPTCHA verification is not available. Please refresh the page and try again.'));
          }
        }, 5000);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let recaptchaToken = null;
      
      // Execute reCAPTCHA v3 if required (after 2 failed attempts)
      if (requiresRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha();
        } catch (recaptchaError) {
          setError(recaptchaError.message || 'reCAPTCHA verification failed. Please try again.');
          setLoading(false);
          return;
        }
      }

      const result = await authAPI.login(
        formData.username.trim(), 
        formData.password, 
        recaptchaToken
      );
      
      if (result.success && result.token) {
        // Reset login attempts on success
        localStorage.removeItem('login_attempts');
        localStorage.setItem('auth_token', result.token);
        window.dispatchEvent(new Event('auth-login'));
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      }
    } catch (err) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('login_attempts', newAttempts.toString());

      if (newAttempts >= 2) {
        setRequiresRecaptcha(true);
      }

      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="login-container d-flex align-items-center justify-content-center">
      <Card className="login-card">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <img 
              src={logoUrl} 
              alt="UNNATVA Logo" 
              className="mb-3"
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            <p className="text-muted small">Content Management System</p>
          </div>

          {error && (
            <AlertNotification
              variant="danger"
              message={error}
              duration={5000}
            />
          )}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <Person className="cms-icon-primary" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                  placeholder="Enter username"
                  autoFocus
                  className="form-control-cms"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <Lock className="cms-icon-primary" />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="Enter password"
                  className="form-control-cms"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {requiresRecaptcha && (
              <Form.Group className="mb-3">
                <div className="recaptcha-info">
                  <ShieldCheck className="cms-icon-primary me-2" />
                  <Form.Text className="text-muted">
                    Security verification will be performed automatically when you click Login
                  </Form.Text>
                </div>
                {errors.recaptcha && (
                  <div className="invalid-feedback d-block mt-2" style={{ color: '#dc3545' }}>
                    {errors.recaptcha}
                  </div>
                )}
              </Form.Group>
            )}

            <Button
              type="submit"
              className="btn-cms-primary w-100"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
