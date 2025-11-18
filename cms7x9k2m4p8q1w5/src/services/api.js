// Determine API base based on current pathname
// Handle both /cms7x9k2m4p8q1w5/api and /index.php/cms7x9k2m4p8q1w5/api
const pathname = window.location.pathname;
let API_BASE = '/cms7x9k2m4p8q1w5/api';
if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
  API_BASE = '/index.php/cms7x9k2m4p8q1w5/api';
}

/**
 * Get authentication token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    // Debug logging
    console.log('API Request - Token found in localStorage, adding Authorization header');
    console.log('API Request - Token (first 20 chars):', token.substring(0, 20) + '...');
  } else {
    console.log('API Request - No token in localStorage');
  }

  // Don't redirect on 401 for auth/check and auth/logout endpoints
  const isAuthCheck = endpoint === '/auth/check';
  const isLogout = endpoint === '/auth/logout';
  
  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies (session) in requests
    });
  } catch (networkError) {
    // Network error - don't cause page reload
    console.error('API Network Error:', networkError);
    if (isAuthCheck) {
      // For auth/check, return unauthenticated on network error
      return { authenticated: false };
    }
    if (isLogout) {
      // For logout, network errors are okay - we're logging out anyway
      return { success: true };
    }
    throw new Error('Network error. Please check your connection.');
  }
  
  if (response.status === 401 && !isAuthCheck && !isLogout) {
    // Unauthorized - clear token and redirect to login (except for auth/check and auth/logout)
    localStorage.removeItem('auth_token');
    // Use navigate instead of window.location to avoid full page reload
    // But we can't use navigate here, so we'll let the Router handle it
    throw new Error('Unauthorized');
  }
  
  // For logout, 401 is acceptable (token might already be invalid)
  if (response.status === 401 && isLogout) {
    return { success: true };
  }

  // Read response as text first (can only read once)
  const text = await response.text();
  
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  let data;
  
  // For auth/check, handle 401 gracefully even if response is not JSON
  if (isAuthCheck && response.status === 401) {
    try {
      if (contentType && contentType.includes('application/json')) {
        data = JSON.parse(text);
      } else {
        // If not JSON, return default unauthenticated response
        data = { authenticated: false };
      }
      return data;
    } catch (e) {
      // If parsing fails, return default unauthenticated response
      return { authenticated: false };
    }
  }
  
  if (contentType && contentType.includes('application/json')) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If JSON parsing fails, log the actual response
      console.error('API Error - Failed to parse JSON:', text.substring(0, 500));
      throw new Error('Server returned invalid response. Check console for details.');
    }
  } else {
    // Response is not JSON (probably HTML error page)
    console.error('API Error - HTML response received:', text.substring(0, 500));
    throw new Error(`Server error (${response.status}). Check console for details.`);
  }
  
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

/**
 * Auth API
 */
export const authAPI = {
  login: async (username, password, recaptchaToken = null) => {
    const body = { username, password };
    if (recaptchaToken) {
      body.recaptcha_token = recaptchaToken;
    }
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  logout: async () => {
    // Logout endpoint - don't throw error on 401 since we're logging out anyway
    try {
      return await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (err) {
      // If logout fails (e.g., token already invalid), that's okay - we're logging out anyway
      if (err.message === 'Unauthorized') {
        return { success: true }; // Return success even if unauthorized
      }
      throw err;
    }
  },

  check: async () => {
    return apiRequest('/auth/check');
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
  },
};

/**
 * Dashboard API
 */
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest('/dashboard/stats');
  },
};

/**
 * Pages API
 */
export const pagesAPI = {
  list: async () => {
    return apiRequest('/pages');
  },

  get: async (id) => {
    return apiRequest(`/pages/${id}`);
  },

  create: async (data) => {
    return apiRequest('/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/pages/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Carousel API
 */
export const carouselAPI = {
  list: async () => {
    return apiRequest('/carousel');
  },

  get: async (id) => {
    return apiRequest(`/carousel/${id}`);
  },

  create: async (data) => {
    return apiRequest('/carousel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/carousel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/carousel/${id}`, {
      method: 'DELETE',
    });
  },

  uploadImage: async (formData) => {
    const token = getAuthToken();
    const pathname = window.location.pathname;
    let API_BASE = '/cms7x9k2m4p8q1w5/api';
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      API_BASE = '/index.php/cms7x9k2m4p8q1w5/api';
    }

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/carousel/upload-image`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch (e) {
        error = { error: text || 'Upload failed' };
      }
      throw new Error(error.error || error.message || 'Upload failed');
    }

    return await response.json();
  },
};

/**
 * Impact Stats API
 */
export const impactStatsAPI = {
  list: async () => {
    return apiRequest('/impact-stats');
  },

  get: async (id) => {
    return apiRequest(`/impact-stats/${id}`);
  },

  create: async (data) => {
    return apiRequest('/impact-stats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/impact-stats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/impact-stats/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Success Stories API
 */
export const successStoriesAPI = {
  list: async () => {
    return apiRequest('/success-stories');
  },

  get: async (id) => {
    return apiRequest(`/success-stories/${id}`);
  },

  create: async (data) => {
    return apiRequest('/success-stories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/success-stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/success-stories/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Media Items API
 */
export const mediaAPI = {
  list: async () => {
    return apiRequest('/media-items');
  },

  get: async (id) => {
    return apiRequest(`/media-items/${id}`);
  },

  create: async (data) => {
    return apiRequest('/media-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/media-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/media-items/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Settings API
 */
export const settingsAPI = {
  list: async () => {
    return apiRequest('/settings');
  },

  get: async (id) => {
    return apiRequest(`/settings/${id}`);
  },

  create: async (data) => {
    return apiRequest('/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  bulkUpdate: async (settings) => {
    return apiRequest('/settings/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
  },

  delete: async (id) => {
    return apiRequest(`/settings/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Content Blocks API (for "What's Happening" section)
 */
export const contentBlocksAPI = {
  list: async (type) => {
    const url = type ? `/content-blocks?type=${type}` : '/content-blocks';
    return apiRequest(url);
  },

  get: async (id) => {
    return apiRequest(`/content-blocks/${id}`);
  },

  create: async (data) => {
    return apiRequest('/content-blocks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/content-blocks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/content-blocks/${id}`, {
      method: 'DELETE',
    });
  },

  uploadImage: async (formData) => {
    const token = getAuthToken();
    const pathname = window.location.pathname;
    let API_BASE = '/cms7x9k2m4p8q1w5/api';
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      API_BASE = '/index.php/cms7x9k2m4p8q1w5/api';
    }

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/content-blocks/upload-image`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch (e) {
        error = { error: text || 'Upload failed' };
      }
      throw new Error(error.error || error.message || 'Upload failed');
    }

    return await response.json();
  },
};

/**
 * Jobs API
 */
export const jobsAPI = {
  list: async () => {
    return apiRequest('/jobs');
  },

  get: async (id) => {
    return apiRequest(`/jobs/${id}`);
  },

  create: async (data) => {
    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Job Applications API (public - no auth required for submission)
 */
export const jobApplicationsAPI = {
  // Public submission (no auth token needed)
  submit: async (data) => {
    const pathname = window.location.pathname;
    let API_BASE = '/cms7x9k2m4p8q1w5/api';
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      API_BASE = '/index.php/cms7x9k2m4p8q1w5/api';
    }

    const response = await fetch(`${API_BASE}/job-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
  },

  uploadResume: async (formData) => {
    const pathname = window.location.pathname;
    let API_BASE = '/cms7x9k2m4p8q1w5/api';
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      API_BASE = '/index.php/cms7x9k2m4p8q1w5/api';
    }

    const response = await fetch(`${API_BASE}/job-applications/upload-resume`, {
      method: 'POST',
      headers: {},
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch (e) {
        error = { error: text || 'Upload failed' };
      }
      throw new Error(error.error || error.message || 'Upload failed');
    }

    return await response.json();
  },

  // Admin methods (require auth)
  list: async (jobListingId = null) => {
    const url = jobListingId ? `/job-applications?job_listing_id=${jobListingId}` : '/job-applications';
    return apiRequest(url);
  },

  get: async (id) => {
    return apiRequest(`/job-applications/${id}`);
  },

  update: async (id, data) => {
    return apiRequest(`/job-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/job-applications/${id}`, {
      method: 'DELETE',
    });
  },

  exportExcel: async (jobListingId = null) => {
    const token = getAuthToken();
    const pathname = window.location.pathname;
    let API_BASE = '/cms7x9k2m4p8q1w5/api';
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      API_BASE = '/index.php/cms7x9k2m4p8q1w5/api';
    }

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = jobListingId 
      ? `${API_BASE}/job-applications/export/excel?job_listing_id=${jobListingId}`
      : `${API_BASE}/job-applications/export/excel`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch (e) {
        error = { error: text || 'Export failed' };
      }
      throw new Error(error.error || error.message || 'Export failed');
    }

    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `job_applications_${new Date().toISOString().split('T')[0]}.csv`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Convert response to blob and trigger download
    const blob = await response.blob();
    const url_blob = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_blob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url_blob);
    document.body.removeChild(a);

    return { success: true, filename };
  },

  downloadResume: async (id) => {
    const token = getAuthToken();
    const pathname = window.location.pathname;
    let API_BASE = '/cms7x9k2m4p8q1w5/api';
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      API_BASE = '/index.php/cms7x9k2m4p8q1w5/api';
    }

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/job-applications/${id}/download-resume`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch (e) {
        error = { error: text || 'Download failed' };
      }
      throw new Error(error.error || error.message || 'Download failed');
    }

    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'resume.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Convert response to blob and trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true, filename };
  },
};

