/**
 * Base API service using native fetch API
 * Uses Promises for async operations
 * 
 * Architecture Decision:
 * - Using browser-native fetch API (no Axios dependency)
 * - Promise-based for future CMS database integration
 * - CI4 will serve content via API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Job Applications API (public - no auth required for submission)
 */
export const jobApplicationsAPI = {
  // Public submission (no auth token needed)
  submit: async (data) => {
    // Determine correct API base URL - public API routes are at /api (not /cms7x9k2m4p8q1w5/api)
    const pathname = window.location.pathname;
    let apiBase = '/api';
    if (pathname.includes('/index.php')) {
      apiBase = '/index.php/api';
    }
    
    const url = `${apiBase}/job-applications`;
    console.log('Submitting application to:', url);
    console.log('Submission data:', data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    console.log('Submit response status:', response.status);
    const text = await response.text();
    console.log('Submit response text:', text);

    if (!response.ok) {
      let error;
      try {
        error = JSON.parse(text);
      } catch (e) {
        error = { error: text || 'Submission failed' };
      }
      throw new Error(error.error || error.message || 'Submission failed');
    }

    return JSON.parse(text);
  },

  uploadResume: async (formData) => {
    // Determine correct API base URL - public API routes are at /api (not /cms7x9k2m4p8q1w5/api)
    const pathname = window.location.pathname;
    let apiBase = '/api';
    if (pathname.includes('/index.php')) {
      apiBase = '/index.php/api';
    }
    
    const url = `${apiBase}/job-applications/upload-resume`;
    console.log('Uploading resume to:', url);
    console.log('FormData keys:', Array.from(formData.keys()));
    console.log('File in FormData:', formData.get('resume'));
    
    const response = await fetch(url, {
      method: 'POST',
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
      body: formData,
      credentials: 'include',
    });

    console.log('Upload response status:', response.status);
    console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));
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
  },
};

class ApiService {
  /**
   * Generic fetch wrapper with error handling
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise} - Response data
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default headers (will be merged with options.headers)
    const defaultHeaders = {
      'Accept': 'application/json',
    };

    // Only set Content-Type if not FormData (FormData sets it automatically with boundary)
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
    
    const defaultOptions = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Response data
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object|FormData} body - Request body (object for JSON, FormData for file uploads)
   * @returns {Promise} - Response data
   */
  async post(endpoint, body) {
    const options = {
      method: 'POST',
    };

    // If body is FormData, don't stringify and let fetch set Content-Type automatically
    // Otherwise, stringify JSON and set Content-Type header
    if (body instanceof FormData) {
      options.body = body;
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    } else {
      options.body = JSON.stringify(body);
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    return this.request(endpoint, options);
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @returns {Promise} - Response data
   */
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Response data
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();

