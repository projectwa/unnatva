import React, { useState, useEffect } from 'react';
import { Modal, Form, Alert } from 'react-bootstrap';
import { enquiriesAPI } from '../services/api';
import './EnquiryForm.css';

function EnquiryForm({ show, onHide, sourcePage = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    contact_number: '',
    business_email: '',
    areas_of_interest: [],
    source_page: sourcePage,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Validation state for each field
  const [validated, setValidated] = useState({
    name: null,
    business_email: null,
    contact_number: null,
  });

  // Available areas of interest
  const areas = [
    { value: 'entrepreneurship', label: 'Entrepreneurship' },
    { value: 'skill-development', label: 'Skill Development' },
    { value: 'women-empowerment', label: 'Women Empowerment' },
    { value: 'education', label: 'Education' },
  ];

  // Validation functions
  const validateName = (name) => {
    return name.trim().length >= 3;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContact = (contact) => {
    if (!contact || contact.trim() === '') return true; // Optional field
    const contactRegex = /^[0-9]{10,15}$/;
    return contactRegex.test(contact.replace(/[\s-]/g, ''));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation state when user starts typing
    if (validated[name] !== null) {
      setValidated(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleCheckboxChange = (areaValue) => {
    setFormData(prev => {
      const areas = prev.areas_of_interest || [];
      const index = areas.indexOf(areaValue);
      
      if (index > -1) {
        // Remove if already selected
        return {
          ...prev,
          areas_of_interest: areas.filter(a => a !== areaValue)
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          areas_of_interest: [...areas, areaValue]
        };
      }
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let isValid = false;

    switch (name) {
      case 'name':
        isValid = validateName(value);
        break;
      case 'business_email':
        isValid = validateEmail(value);
        break;
      case 'contact_number':
        isValid = validateContact(value);
        break;
      default:
        return;
    }

    setValidated(prev => ({
      ...prev,
      [name]: isValid
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validate required fields
    if (!validateName(formData.name)) {
      setValidated(prev => ({ ...prev, name: false }));
      setError('Please fill in all required fields correctly');
      setSubmitting(false);
      return;
    }

    if (!validateEmail(formData.business_email)) {
      setValidated(prev => ({ ...prev, business_email: false }));
      setError('Please enter a valid business email address');
      setSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        name: formData.name,
        company_name: formData.company_name || null,
        email: formData.business_email, // API expects 'email' field
        business_email: formData.business_email,
        contact_number: formData.contact_number || null,
        areas_of_interest: formData.areas_of_interest.length > 0 ? formData.areas_of_interest : null,
        source_page: sourcePage || getSourcePageFromURL(),
      };

      await enquiriesAPI.submit(submissionData);
      setSuccess(true);
      
      // Hide any images in the modal when success is shown
      setTimeout(() => {
        const modal = document.querySelector('.enquiry-modal');
        if (modal) {
          const images = modal.querySelectorAll('img[src*="enquiry-img"], .image-section img, img.rounded-circle');
          images.forEach(img => {
            img.style.display = 'none';
          });
          // Also hide image sections
          const imageSections = modal.querySelectorAll('.image-section');
          imageSections.forEach(section => {
            section.style.display = 'none';
          });
        }
      }, 100);
      
      // Reset form after 30 seconds and close modal
      setTimeout(() => {
        handleClose();
      }, 30000);
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const getSourcePageFromURL = () => {
    const path = window.location.pathname;
    if (path === '/' || path.includes('home')) return 'home';
    if (path.includes('impact')) return 'impact';
    if (path.includes('entrepreneurship-development')) return 'entrepreneurship-development';
    if (path.includes('skill-development')) return 'skill-development';
    if (path.includes('education')) return 'education';
    if (path.includes('women-empowerment')) return 'women-empowerment';
    return 'other';
  };

  const handleClose = () => {
    setFormData({
      name: '',
      company_name: '',
      contact_number: '',
      business_email: '',
      areas_of_interest: [],
      source_page: sourcePage,
    });
    setError('');
    setSuccess(false);
    setValidated({
      name: null,
      business_email: null,
      contact_number: null,
    });
    
    onHide();
  };

  // Force text color to #333333 after render
  useEffect(() => {
    if (show) {
      const forceTextColor = () => {
        const inputs = document.querySelectorAll('.enquiry-modal .custom-form-control');
        inputs.forEach(input => {
          if (input.style) {
            input.style.setProperty('color', '#333333', 'important');
          }
        });
      };
      
      // Run immediately and after a short delay to catch React-Bootstrap's styling
      forceTextColor();
      setTimeout(forceTextColor, 100);
      setTimeout(forceTextColor, 300);
    }
  }, [show, formData.name, formData.company_name, formData.contact_number, formData.business_email]);

  // Hide images when success is shown
  useEffect(() => {
    if (success) {
      const hideImages = () => {
        const modal = document.querySelector('.enquiry-modal');
        if (modal) {
          // Hide all images in the modal
          const images = modal.querySelectorAll('img');
          images.forEach(img => {
            img.style.display = 'none';
          });
          // Hide image sections
          const imageSections = modal.querySelectorAll('.image-section, [class*="image"]');
          imageSections.forEach(section => {
            if (section.tagName !== 'IMG') {
              section.style.display = 'none';
            }
          });
        }
      };
      
      hideImages();
      setTimeout(hideImages, 100);
      setTimeout(hideImages, 300);
    }
  }, [success]);

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      onExited={() => {
        // React-Bootstrap should handle cleanup automatically, but ensure body scroll is restored
        // Use requestAnimationFrame to ensure this runs after React-Bootstrap's cleanup
        requestAnimationFrame(() => {
          // Only restore if still locked
          if (document.body.classList.contains('modal-open')) {
            document.body.classList.remove('modal-open');
          }
          if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = '';
          }
          if (document.body.style.paddingRight) {
            document.body.style.paddingRight = '';
          }
        });
      }}
      size="xl"
      centered
      className="custom-modal enquiry-modal"
      contentClassName="border-0"
      backdrop={true}
      keyboard={true}
    >
      <Modal.Body className="p-0">
        <div className="row g-0">
          <div className={`${success ? 'col-lg-12' : 'col-lg-12'} form-section bg-white p-4 position-relative`}>
            {!success && (
              <>
                <button 
                  type="button" 
                  className="btn-close p-2 position-absolute top-0 end-0" 
                  onClick={handleClose}
                  aria-label="Close"
                ></button>
                <h3 className="mb-3">Help us know you better</h3>
                <p className="fw-semibold mb-3">How do you want to contribute?</p>
              </>
            )}
        {success ? (
          <div className="d-flex flex-column" style={{ width: '100%', maxWidth: '100%' }}>
            <button 
              type="button" 
              className="btn-close p-2 position-absolute top-0 end-0" 
              onClick={handleClose}
              aria-label="Close"
            ></button>
            <div className="success-message-text d-flex flex-column" style={{ textAlign: 'left', color: '#00a470', fontSize: '16px', fontWeight: '500', lineHeight: '1.6', width: '100%', maxWidth: '100%', paddingRight: '1rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Success!</strong>
              <span style={{ display: 'block' }}>Your enquiry has been submitted successfully.</span>
              <span style={{ display: 'block' }}>We'll get back to you soon.</span>
            </div>
          </div>
        ) : (
          <Form onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert variant="danger">{error}</Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validated.name === true}
                isInvalid={validated.name === false}
                className="custom-form-control"
                style={{ color: '#333333' }}
                required
              />
              {validated.name === false && (
                <div className="field-feedback">
                  Name must be at least 3 characters
                </div>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
                className="custom-form-control"
                style={{ color: '#333333' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="contact_number"
                placeholder="Contact Number"
                value={formData.contact_number}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validated.contact_number === true}
                isInvalid={validated.contact_number === false}
                className="custom-form-control"
                style={{ color: '#333333' }}
              />
              {validated.contact_number === false && (
                <div className="field-feedback">
                  Please enter a valid contact number (10-15 digits)
                </div>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="business_email"
                placeholder="Business Email"
                value={formData.business_email}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validated.business_email === true}
                isInvalid={validated.business_email === false}
                className="custom-form-control"
                style={{ color: '#333333' }}
                required
              />
              {validated.business_email === false && (
                <div className="field-feedback">
                  Please enter a valid business email address
                </div>
              )}
            </Form.Group>
            
            <p className="fw-semibold mt-3 mb-2">In which area do you want to create impact?</p>
            <div className="impact-options mb-3">
              {areas.map((area) => (
                <Form.Check
                  key={area.value}
                  inline
                  type="checkbox"
                  id={`area-${area.value}`}
                  checked={formData.areas_of_interest.includes(area.value)}
                  onChange={() => handleCheckboxChange(area.value)}
                  className="form-check-inline"
                  label={<span className="small">{area.label}</span>}
                />
              ))}
            </div>
            
            <button 
              type="submit" 
              className="rounded-btn mt-3"
              disabled={submitting}
              style={{
                borderRadius: '30px',
                padding: '8px 20px',
                backgroundColor: '#00a470',
                color: '#fff',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'} 
              <span className="arrow ms-2">
                <i className="bi bi-arrow-right"></i>
              </span>
            </button>
          </Form>
        )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default EnquiryForm;
