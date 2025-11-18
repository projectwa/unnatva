# React API Architecture Plan

## Overview
This document outlines the architecture for fetching content from CI4 backend and integrating it into React components using browser-native `fetch` API and Promises.

## Architecture Decision

### Content Delivery Strategy
- **Current Phase**: Migrate static content from CI4 views to React components
- **Future Phase**: Build CMS to store content in database
- **API Approach**: Use browser-native `fetch` API with Promises (no external libraries like Axios initially)

### Benefits of This Approach
1. **Native Browser API**: No additional dependencies
2. **Promise-based**: Clean async/await syntax
3. **Future-proof**: Easy to integrate with CMS database later
4. **Separation of Concerns**: CI4 handles data, React handles presentation

## API Structure

### CI4 API Endpoints (to be created)

#### Page Content Endpoints
```
GET /api/pages/home
GET /api/pages/about
GET /api/pages/impact
GET /api/pages/contact
GET /api/pages/success-stories
GET /api/pages/media
GET /api/pages/privacy-policy
```

#### Initiative Endpoints
```
GET /api/initiatives/entrepreneurship-development
GET /api/initiatives/skill-development
GET /api/initiatives/education
GET /api/initiatives/women-empowerment
```

### Response Format (JSON)
```json
{
  "success": true,
  "data": {
    "title": "Page Title",
    "sections": [
      {
        "id": "hero",
        "type": "hero",
        "content": {
          "heading": "Main Heading",
          "subheading": "Subheading text",
          "image": "/img/hero.jpg"
        }
      },
      {
        "id": "about",
        "type": "content",
        "content": {
          "heading": "About Section",
          "text": "Content text...",
          "items": [...]
        }
      }
    ],
    "meta": {
      "description": "Page meta description",
      "keywords": "page, keywords"
    }
  }
}
```

## React Service Layer

### File Structure
```
frontend/src/
├── services/
│   ├── api.js          # Base API service with fetch wrapper
│   ├── pages.js        # Page content API calls
│   └── initiatives.js  # Initiative content API calls
```

### Implementation Pattern

#### Base API Service (`services/api.js`)
```javascript
/**
 * Base API service using native fetch API
 * Handles common request/response logic
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  /**
   * Generic fetch wrapper with error handling
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise} - Response data
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();
```

#### Page Content Service (`services/pages.js`)
```javascript
import api from './api';

/**
 * Page content API service
 * Fetches page content from CI4 backend
 */

export const getPageContent = async (pageName) => {
  try {
    const data = await api.get(`/pages/${pageName}`);
    return data;
  } catch (error) {
    console.error(`Error fetching page content for ${pageName}:`, error);
    throw error;
  }
};

export const getHomePage = () => getPageContent('home');
export const getAboutPage = () => getPageContent('about');
export const getImpactPage = () => getPageContent('impact');
export const getContactPage = () => getPageContent('contact');
export const getSuccessStoriesPage = () => getPageContent('success-stories');
export const getMediaPage = () => getPageContent('media');
export const getPrivacyPolicyPage = () => getPageContent('privacy-policy');
```

#### Initiative Service (`services/initiatives.js`)
```javascript
import api from './api';

/**
 * Initiative content API service
 * Fetches initiative-specific content from CI4 backend
 */

export const getInitiativeContent = async (initiativeName) => {
  try {
    const data = await api.get(`/initiatives/${initiativeName}`);
    return data;
  } catch (error) {
    console.error(`Error fetching initiative content for ${initiativeName}:`, error);
    throw error;
  }
};

export const getEntrepreneurshipDevelopment = () => 
  getInitiativeContent('entrepreneurship-development');
export const getSkillDevelopment = () => 
  getInitiativeContent('skill-development');
export const getEducation = () => 
  getInitiativeContent('education');
export const getWomenEmpowerment = () => 
  getInitiativeContent('women-empowerment');
```

## React Component Integration

### Usage Pattern in Components
```javascript
import React, { useState, useEffect } from 'react';
import { getHomePage } from '../services/pages';

function HomePage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch content using Promise
    getHomePage()
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!content) return null;

  return (
    <div>
      <h1>{content.title}</h1>
      {content.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
}
```

### Alternative: Using async/await
```javascript
import React, { useState, useEffect } from 'react';
import { getHomePage } from '../services/pages';

function HomePage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await getHomePage();
        setContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContent();
  }, []);

  // ... rest of component
}
```

## CI4 API Controllers

### Structure
```
app/Controllers/Api/
├── Pages.php          # Page content endpoints
└── Initiatives.php    # Initiative content endpoints
```

### Example Controller (`app/Controllers/Api/Pages.php`)
```php
<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class Pages extends BaseController
{
    use ResponseTrait;

    /**
     * Get page content by name
     * GET /api/pages/{pageName}
     */
    public function getPage($pageName)
    {
        // TODO: Fetch from database when CMS is ready
        // For now, return static content or from views
        
        $content = $this->getPageContent($pageName);
        
        return $this->respond([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Get page content (placeholder for CMS integration)
     */
    private function getPageContent($pageName)
    {
        // Temporary: Return static structure
        // Future: Query database for content
        
        return [
            'title' => ucfirst($pageName),
            'sections' => [],
            'meta' => []
        ];
    }
}
```

## Migration Strategy

### Phase 1: Static Content (Current)
- Migrate HTML structure from CI4 views to React components
- Use static content initially
- Set up API service layer structure

### Phase 2: API Integration
- Create CI4 API controllers
- Return static content via API endpoints
- Update React components to fetch from API

### Phase 3: CMS Integration (Future)
- Build CMS database schema
- Create admin interface for content management
- Update CI4 API to fetch from database
- React components automatically use dynamic content

## Environment Configuration

### Vite Environment Variables (`.env`)
```env
VITE_API_BASE_URL=/api
```

### Development vs Production
- **Development**: Vite proxy handles `/api` requests
- **Production**: CI4 serves API endpoints directly

## Error Handling

### Network Errors
- Handle fetch failures gracefully
- Show user-friendly error messages
- Implement retry logic if needed

### API Errors
- Validate response structure
- Handle HTTP error codes
- Log errors for debugging

## Performance Considerations

### Caching
- Consider caching API responses
- Use React Query or SWR for advanced caching (optional)
- Implement cache invalidation strategy

### Loading States
- Show loading indicators during fetch
- Implement skeleton screens for better UX

## Testing Strategy

### Unit Tests
- Test API service functions
- Mock fetch responses
- Test error handling

### Integration Tests
- Test React components with API calls
- Test CI4 API endpoints
- End-to-end testing

## Notes

- **No Axios**: Using native `fetch` API to keep dependencies minimal
- **Promise-based**: All async operations use Promises/async-await
- **Future CMS**: Architecture designed to easily integrate database-driven content
- **Separation**: Clear separation between data (CI4) and presentation (React)

