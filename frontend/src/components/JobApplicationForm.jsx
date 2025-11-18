import React, { useState, useRef } from 'react';
import { Modal, Form, Alert } from 'react-bootstrap';
import { jobApplicationsAPI } from '../services/api';
import './JobApplicationForm.css';

function JobApplicationForm({ show, onHide, jobTitle, jobId }) {
  console.log('JobApplicationForm: Rendering with props:', { show, jobTitle, jobId });
  
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_number: '',
    city: '',
    applied_job_profile: jobTitle || '',
    job_listing_id: jobId || null,
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePath, setResumePath] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Validation state for each field
  const [validated, setValidated] = useState({
    name: null,
    email: null,
    contact_number: null,
    city: null,
    applied_job_profile: null,
    resume: null,
  });

  // Validation functions
  const validateName = (name) => {
    return name.trim().length >= 3;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContact = (contact) => {
    const contactRegex = /^[0-9]{10,15}$/;
    return contactRegex.test(contact.replace(/[\s-]/g, ''));
  };

  const validateCity = (city) => {
    return city.trim().length >= 2;
  };

  const validateJobProfile = (profile) => {
    return profile.trim().length >= 2;
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let isValid = false;

    switch (name) {
      case 'name':
        isValid = validateName(value);
        break;
      case 'email':
        isValid = validateEmail(value);
        break;
      case 'contact_number':
        isValid = validateContact(value);
        break;
      case 'city':
        isValid = validateCity(value);
        break;
      case 'applied_job_profile':
        isValid = validateJobProfile(value);
        break;
      default:
        return;
    }

    setValidated(prev => ({
      ...prev,
      [name]: isValid
    }));
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setValidated(prev => ({
        ...prev,
        resume: false
      }));
      return;
    }

    // Validate file type - only PDF allowed
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (extension !== 'pdf' && file.type !== 'application/pdf') {
      setError('Invalid file type. Only PDF files are allowed.');
      setValidated(prev => ({
        ...prev,
        resume: false
      }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setValidated(prev => ({
        ...prev,
        resume: false
      }));
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      console.log('JobApplicationForm: Uploading file:', file.name, file.size, file.type);
      console.log('JobApplicationForm: FormData created, keys:', Array.from(formData.keys()));

      const result = await jobApplicationsAPI.uploadResume(formData);
      console.log('JobApplicationForm: Upload successful:', result);
      
      setResumeFile(file);
      setResumePath(result.path);
      setError('');
      setValidated(prev => ({
        ...prev,
        resume: true
      }));
    } catch (err) {
      console.error('JobApplicationForm: Upload error:', err);
      console.error('JobApplicationForm: Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      // Show more detailed error message
      const errorMessage = err.message || 'Failed to upload resume';
      setError(errorMessage);
      setValidated(prev => ({
        ...prev,
        resume: false
      }));
      // Also clear the file input on error
      e.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const submissionData = {
        ...formData,
        resume_filename: resumeFile ? resumeFile.name : null,
        resume_path: resumePath,
      };

      await jobApplicationsAPI.submit(submissionData);
      setSuccess(true);
      
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      contact_number: '',
      city: '',
      applied_job_profile: jobTitle || '',
      job_listing_id: jobId || null,
    });
    setResumeFile(null);
    setResumePath('');
    setError('');
    setSuccess(false);
    setValidated({
      name: null,
      email: null,
      contact_number: null,
      city: null,
      applied_job_profile: null,
      resume: null,
    });
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="xl"
      centered
      className="custom-modal"
      contentClassName="border-0"
      backdrop={true}
      keyboard={true}
    >
      <Modal.Body className="p-0">
        <div className="row g-0">
          <div className="col-lg-12 form-section bg-white p-4">
            <button 
              type="button" 
              className="btn-close p-2 position-absolute top-0 end-0" 
              onClick={handleClose}
              aria-label="Close"
            ></button>
            <h3 className="mb-4">
              Join our Team, <span style={{color: '#A1A1A1'}}>Work at Unnatva</span>
            </h3>
        {success ? (
          <Alert variant="success">
            <strong>Success!</strong> Your application has been submitted successfully.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert variant="danger">{error}</Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="name"
                placeholder="Name*"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validated.name === true}
                isInvalid={validated.name === false}
                className="custom-form-control"
              />
              {validated.name === false && (
                <div className="field-feedback">
                  Name must be at least 3 characters
                </div>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email ID*"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validated.email === true}
                isInvalid={validated.email === false}
                className="custom-form-control"
              />
              {validated.email === false && (
                <div className="field-feedback">
                  Please enter a valid email address
                </div>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="contact_number"
                placeholder="Contact Number*"
                value={formData.contact_number}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validated.contact_number === true}
                isInvalid={validated.contact_number === false}
                className="custom-form-control"
              />
              {validated.contact_number === false && (
                <div className="field-feedback">
                  Please enter a valid contact number (10-15 digits)
                </div>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="city"
                placeholder="City*"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validated.city === true}
                isInvalid={validated.city === false}
                className="custom-form-control"
              />
              {validated.city === false && (
                <div className="field-feedback">
                  City must be at least 2 characters
                </div>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="applied_job_profile"
                placeholder="Applied Job Profile*"
                value={formData.applied_job_profile}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validated.applied_job_profile === true}
                isInvalid={validated.applied_job_profile === false}
                className="custom-form-control"
              />
              {validated.applied_job_profile === false && (
                <div className="field-feedback">
                  Job profile must be at least 2 characters
                </div>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <input
                ref={fileInputRef}
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,application/pdf"
                onChange={handleResumeChange}
                onBlur={(e) => {
                  setValidated(prev => ({
                    ...prev,
                    resume: resumePath ? true : (e.target.files.length > 0 ? null : false)
                  }));
                }}
                disabled={uploading}
                className="file-input-hidden"
                style={{
                  position: 'fixed',
                  top: '-9999px',
                  left: '-9999px',
                  width: '0.1px',
                  height: '0.1px',
                  opacity: 0,
                  overflow: 'hidden',
                  zIndex: -1,
                  visibility: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  pointerEvents: 'none'
                }}
              />
              {resumeFile ? (
                <div 
                  className="upload-box upload-success text-center"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="mb-0 text-success">
                    <i className="bi bi-file-earmark-pdf-fill me-2"></i>
                    <span className="resume-filename">{resumeFile.name}</span>
                    <small className="d-block mt-1 text-muted">Click to change file</small>
                  </p>
                </div>
              ) : (
                <div 
                  className={`upload-box text-center ${validated.resume === false ? 'upload-error' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="fw-normal mb-2">Upload resume in .pdf format</p>
                  <img 
                    src="/img/upload.png" 
                    alt="Upload" 
                    className="upload-icon"
                  />
                  {uploading && (
                    <p className="mt-2 text-muted mb-0">
                      <small>Uploading...</small>
                    </p>
                  )}
                  {validated.resume === false && !uploading && (
                    <p className="mt-2 text-danger mb-0">
                      <small>Please upload your resume</small>
                    </p>
                  )}
                </div>
              )}
            </Form.Group>
            
            <button 
              type="submit" 
              className="rounded-btn mt-3"
              disabled={submitting || uploading || !resumeFile}
              style={{
                borderRadius: '30px',
                padding: '8px 20px',
                backgroundColor: '#00a470',
                color: '#fff',
                border: 'none',
                cursor: submitting || uploading || !resumeFile ? 'not-allowed' : 'pointer',
                opacity: submitting || uploading || !resumeFile ? 0.6 : 1
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

export default JobApplicationForm;

