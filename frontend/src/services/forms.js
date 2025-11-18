/**
 * Form submission API service
 * Handles form submissions to CI4 backend using fetch API
 * Supports both JSON and FormData (for file uploads)
 */

import api from './api';

/**
 * Submit contact form
 * @param {object} formData - Form data object
 * @returns {Promise} - Submission result
 */
export const submitContactForm = async (formData) => {
  try {
    const data = await api.post('/forms/contact', formData);
    return data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

/**
 * Submit newsletter subscription
 * @param {object} formData - Form data with email
 * @returns {Promise} - Submission result
 */
export const subscribeNewsletter = async (formData) => {
  try {
    const data = await api.post('/forms/newsletter', formData);
    return data;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
};

/**
 * Submit contribution form (from footer modal)
 * @param {FormData} formData - FormData object (may include files)
 * @returns {Promise} - Submission result
 */
export const submitContributionForm = async (formData) => {
  try {
    // If formData is a plain object, convert to FormData
    // If it's already FormData (with files), use as-is
    let dataToSend = formData;
    
    if (!(formData instanceof FormData)) {
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          // Handle checkboxes/arrays
          formData[key].forEach(value => fd.append(`${key}[]`, value));
        } else {
          fd.append(key, formData[key]);
        }
      });
      dataToSend = fd;
    }

    const data = await api.post('/forms/contribution', dataToSend);
    return data;
  } catch (error) {
    console.error('Error submitting contribution form:', error);
    throw error;
  }
};

/**
 * Generic form submission
 * @param {string} formType - Type of form (e.g., 'contact', 'newsletter')
 * @param {object|FormData} formData - Form data
 * @returns {Promise} - Submission result
 */
export const submitForm = async (formType, formData) => {
  try {
    const data = await api.post(`/forms/${formType}`, formData);
    return data;
  } catch (error) {
    console.error(`Error submitting ${formType} form:`, error);
    throw error;
  }
};

