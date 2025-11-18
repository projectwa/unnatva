import React, { useState } from 'react';
import { jobApplicationsAPI } from '../services/api';
import './JobApplicationForm.css';

function JobApplicationForm({ show, onHide, jobTitle, jobId }) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      setError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const result = await jobApplicationsAPI.uploadResume(formData);
      setResumeFile(file);
      setResumePath(result.path);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to upload resume');
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
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
      <div className="modal-backdrop fade show" onClick={handleClose}></div>
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="row g-0">
            <div className="col-lg-12 form-section bg-white">
              <button 
                type="button" 
                className="btn-close p-2" 
                onClick={handleClose}
                aria-label="Close"
              ></button>
              <h3 className="mb-4">Join our Team, <span style={{color: '#A1A1A1'}}>Work at Unnatva</span></h3>
              
              {success ? (
                <div className="alert alert-success">
                  <strong>Success!</strong> Your application has been submitted successfully.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}
                  
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Name*"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email ID*"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  
                  <input
                    type="text"
                    name="contact_number"
                    className="form-control"
                    placeholder="Contact Number*"
                    value={formData.contact_number}
                    onChange={handleChange}
                    required
                  />
                  
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="City*"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  
                  <input
                    type="text"
                    name="applied_job_profile"
                    className="form-control"
                    placeholder="Applied Job Profile*"
                    value={formData.applied_job_profile}
                    onChange={handleChange}
                    required
                  />
                  
                  <div className="upload-box text-center" id="uploadBox">
                    <p className="fw-normal">Upload your resume here</p>
                    <img src="/img/upload.png" alt="Upload" className="upload-icon" />
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      className="file-input"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      disabled={uploading}
                    />
                    {resumeFile && (
                      <p className="mt-2 text-success">
                        <small>✓ {resumeFile.name}</small>
                      </p>
                    )}
                    {uploading && (
                      <p className="mt-2 text-muted">
                        <small>Uploading...</small>
                      </p>
                    )}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="rounded-btn mt-3"
                    disabled={submitting || uploading || !resumeFile}
                  >
                    {submitting ? 'Submitting...' : 'Submit'} 
                    <span className="arrow">
                      <i className="bi bi-arrow-right"></i>
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobApplicationForm;

