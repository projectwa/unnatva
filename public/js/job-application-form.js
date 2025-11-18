/**
 * Job Application Form Handler
 * Handles form submission and resume upload for job applications
 */

(function() {
  'use strict';

  let currentJobId = null;
  let currentJobTitle = null;
  let resumePath = null;
  let resumeFilename = null;

  // API base URL

  function getApiBase() {
    const pathname = window.location.pathname;
    if (pathname.includes('/index.php')) {
      return '/index.php/cms7x9k2m4p8q1w5/api';
    }
    return '/cms7x9k2m4p8q1w5/api';
  }

  // Upload resume
  async function uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    console.log('Uploading file:', file.name, file.size, file.type);
    console.log('API Base:', getApiBase());
    console.log('Upload URL:', `${getApiBase()}/job-applications/upload-resume`);

    try {
      const response = await fetch(`${getApiBase()}/job-applications/upload-resume`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        // Don't set Content-Type header - let browser set it with boundary
      });

      console.log('Upload response status:', response.status);
      const text = await response.text();
      console.log('Upload response text:', text);

      if (!response.ok) {
        let error;
        try {
          error = JSON.parse(text);
        } catch (e) {
          error = { error: text || 'Upload failed' };
        }
        throw new Error(error.error || error.message || 'Upload failed');
      }

      return JSON.parse(text);
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  }

  // Submit application
  async function submitApplication(formData) {
    const response = await fetch(`${getApiBase()}/job-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch (e) {
        error = { error: text || 'Submission failed' };
      }
      throw new Error(error.error || error.message || 'Submission failed');
    }

    return await response.json();
  }

  // Create and show modal
  function showApplicationForm(jobId, jobTitle) {
    currentJobId = jobId;
    currentJobTitle = jobTitle;
    resumePath = null;
    resumeFilename = null;

    // Create modal HTML
    const modalHTML = `
      <div class="modal fade custom-modal show" id="popupModalapply" tabindex="-1" style="display: block;" aria-hidden="false">
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content">
            <div class="row g-0">
              <div class="col-lg-12 form-section bg-white">
                <button type="button" class="btn-close p-2" data-bs-dismiss="modal" aria-label="Close" onclick="closeApplicationForm()"></button>
                <h3 class="mb-4">Join our Team, <span style="color:#A1A1A1">Work at Unnatva</span></h3>
                <div id="form-alert"></div>
                <form id="job-application-form">
                  <input type="text" name="name" class="form-control" placeholder="Name*" required>
                  <input type="email" name="email" class="form-control" placeholder="Email ID*" required>
                  <input type="text" name="contact_number" class="form-control" placeholder="Contact Number*" required>
                  <input type="text" name="city" class="form-control" placeholder="City*" required>
                  <input type="text" name="applied_job_profile" class="form-control" placeholder="Applied Job Profile*" value="${jobTitle || ''}" required>
                  <div class="upload-box text-center" id="uploadBox">
                    <p class="fw-normal">Upload your resume here</p>
                    <img src="/img/upload.png" alt="Upload" class="upload-icon">
                    <input type="file" id="resume" name="resume" class="file-input" accept=".pdf,.doc,.docx" required>
                    <div id="resume-status"></div>
                  </div>
                  <button type="submit" class="rounded-btn mt-3" id="submit-btn">
                    Submit <span class="arrow"><i class="bi bi-arrow-right"></i></span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" onclick="closeApplicationForm()"></div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('popupModalapply');
    if (existingModal) {
      existingModal.remove();
    }
    const existingBackdrop = document.querySelector('.modal-backdrop');
    if (existingBackdrop && existingBackdrop.onclick && existingBackdrop.onclick.toString().includes('closeApplicationForm')) {
      existingBackdrop.remove();
    }

    // Insert modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Handle resume upload
    const resumeInput = document.getElementById('resume');
    const resumeStatus = document.getElementById('resume-status');
    
    resumeInput.addEventListener('change', async function(e) {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        showAlert('Invalid file type. Only PDF, DOC, and DOCX files are allowed.', 'danger');
        resumeInput.value = '';
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('File size must be less than 5MB', 'danger');
        resumeInput.value = '';
        return;
      }

      resumeStatus.innerHTML = '<p class="mt-2 text-muted"><small>Uploading...</small></p>';
      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;

      try {
        const result = await uploadResume(file);
        resumePath = result.path;
        resumeFilename = result.filename;
        resumeStatus.innerHTML = `<p class="mt-2 text-success"><small>✓ ${file.name}</small></p>`;
        showAlert('', ''); // Clear any errors
      } catch (err) {
        showAlert(err.message || 'Failed to upload resume', 'danger');
        resumeInput.value = '';
        resumeStatus.innerHTML = '';
      } finally {
        submitBtn.disabled = false;
      }
    });

    // Handle form submission
    const form = document.getElementById('job-application-form');
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!resumePath) {
        showAlert('Please upload a resume', 'danger');
        return;
      }

      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting... <span class="arrow"><i class="bi bi-arrow-right"></i></span>';

      const formData = {
        name: form.querySelector('[name="name"]').value,
        email: form.querySelector('[name="email"]').value,
        contact_number: form.querySelector('[name="contact_number"]').value,
        city: form.querySelector('[name="city"]').value,
        applied_job_profile: form.querySelector('[name="applied_job_profile"]').value,
        job_listing_id: currentJobId,
        resume_filename: resumeFilename,
        resume_path: resumePath,
      };

      try {
        await submitApplication(formData);
        showAlert('Success! Your application has been submitted successfully.', 'success');
        setTimeout(() => {
          closeApplicationForm();
        }, 2000);
      } catch (err) {
        showAlert(err.message || 'Failed to submit application', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit <span class="arrow"><i class="bi bi-arrow-right"></i></span>';
      }
    });
  }

  // Close modal
  window.closeApplicationForm = function() {
    const modal = document.getElementById('popupModalapply');
    if (modal) {
      modal.remove();
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.onclick && backdrop.onclick.toString().includes('closeApplicationForm')) {
      backdrop.remove();
    }
    currentJobId = null;
    currentJobTitle = null;
    resumePath = null;
    resumeFilename = null;
  };

  // Show alert
  function showAlert(message, type) {
    const alertDiv = document.getElementById('form-alert');
    if (!message) {
      alertDiv.innerHTML = '';
      return;
    }
    alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Handle Apply Now button clicks
    document.querySelectorAll('.apply-now-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const jobId = btn.getAttribute('data-job-id');
        const jobTitle = btn.getAttribute('data-job-title');
        showApplicationForm(jobId, jobTitle);
      });
    });
  });
})();

