/**
 * Media Gallery Component
 * Standalone component that can be embedded in CI4 views
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Spinner, Alert } from 'react-bootstrap';

function MediaGallery({ categories: initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get base URL for API calls
  const getBaseUrl = () => {
    // Always use root path for API calls
    // API routes are at /api/... so we don't need to include the current page path
    let pathname = window.location.pathname;
    
    // Handle /index.php/... pattern
    if (pathname.includes('/index.php/')) {
      // Extract base path up to /index.php
      const indexPhpIndex = pathname.indexOf('/index.php/');
      return pathname.substring(0, indexPhpIndex + '/index.php'.length);
    } else if (pathname.includes('/index.php')) {
      // Handle /index.php (no trailing slash)
      const indexPhpIndex = pathname.indexOf('/index.php');
      return pathname.substring(0, indexPhpIndex + '/index.php'.length);
    }
    
    // For regular paths, remove the last segment (current page)
    // e.g., /media -> '', /about -> ''
    const segments = pathname.split('/').filter(s => s);
    if (segments.length > 0) {
      // Remove the last segment (current page)
      segments.pop();
    }
    return segments.length > 0 ? '/' + segments.join('/') : '';
  };

  // Load categories on mount if not provided
  useEffect(() => {
    if (categories.length === 0) {
      loadCategories();
    } else {
      // Set first category as selected
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    }
  }, []);

  // Load images when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadImages(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/media/categories`);
      if (!response.ok) throw new Error('Failed to load categories');
      const result = await response.json();
      if (result.success && result.data) {
        setCategories(result.data);
        // Set first category as selected
        if (result.data.length > 0) {
          setSelectedCategory(result.data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    }
  };

  const loadImages = async (category) => {
    if (!category) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/api/media/by-category?category=${encodeURIComponent(category)}`;
      console.log('Fetching images from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('API Error Response (first 500 chars):', text.substring(0, 500));
        throw new Error(`Failed to load images: ${response.status} ${response.statusText}`);
      }
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 500));
        throw new Error('Server returned non-JSON response. Check API route configuration.');
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success && result.data) {
        setImages(result.data);
        console.log(`Loaded ${result.data.length} images for category: ${category}`);
      } else {
        setImages([]);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error('Error loading images:', err);
      setError(err.message || 'Failed to load images. Check console for details.');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise construct path
    const baseUrl = getBaseUrl();
    return `${baseUrl}/img/${imagePath}`;
  };

  return (
    <div className="container-fluid destination py-5">
      <Container className="py-5" style={{ maxWidth: '100%', padding: '0 15px' }}>
        <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '500px' }}>
          <h2 className="mb-4">Media</h2>
        </div>
        
        <div className="tab-class text-center">
          <Nav variant="pills" className="d-inline-flex justify-content-center mb-5" as="ul">
            {categories.map((category) => (
              <Nav.Item key={category} as="li">
                <Nav.Link
                  active={selectedCategory === category}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category);
                  }}
                  style={{
                    backgroundColor: selectedCategory === category ? '#00a470' : 'transparent',
                    color: selectedCategory === category ? '#fff' : '#000',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {category}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          
          <div className="tab-content">
            <div className="tab-pane fade show p-0 active">
              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              {!loading && !error && images.length === 0 && (
                <div className="text-center py-5">
                  <p className="text-muted">No images found in this category.</p>
                </div>
              )}
              
              {!loading && !error && images.length > 0 && (
                <>
                  <style>{`
                    .media-masonry-container {
                      column-count: 4;
                      column-gap: 10px;
                      line-height: 0;
                      width: 100%;
                    }
                    .media-masonry-item {
                      display: inline-block;
                      width: 100%;
                      margin-bottom: 10px;
                      break-inside: avoid;
                      page-break-inside: avoid;
                      -webkit-column-break-inside: avoid;
                    }
                    .media-masonry-container .destination-img {
                      max-height: none !important;
                      height: auto !important;
                      overflow: hidden !important;
                    }
                    .media-masonry-container .destination-img .search-icon {
                      position: absolute;
                      width: 100%;
                      height: 100%;
                      top: 0;
                      left: 0;
                      display: flex;
                      justify-content: flex-end;
                      align-items: flex-start;
                      padding: 20px 20px 0 0;
                      transition: all 0.5s;
                      background: transparent;
                      z-index: 2;
                    }
                    .media-masonry-container .destination-img .search-icon a {
                      text-decoration: none;
                      display: inline-block;
                      width: 40px;
                      height: 40px;
                      line-height: 40px;
                      text-align: center;
                      background-color: transparent;
                      border-radius: 4px;
                      box-shadow: none;
                      transition: all 0.5s;
                    }
                    .media-masonry-container .destination-img .search-icon a i {
                      opacity: 0;
                      transition: all 0.5s;
                      color: #fff !important;
                      font-size: 16px;
                      line-height: 40px;
                    }
                    .media-masonry-container .destination-img:hover .search-icon {
                      background: rgba(0, 164, 112, 0.2) !important;
                    }
                    .media-masonry-container .destination-img:hover .search-icon a {
                      background-color: #00a470;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .media-masonry-container .destination-img:hover .search-icon a i {
                      opacity: 1 !important;
                    }
                    .media-masonry-container .destination-img img {
                      transition: transform 0.5s;
                    }
                    .media-masonry-container .destination-img:hover img {
                      transform: scale(1.1);
                    }
                    @media (max-width: 1200px) {
                      .media-masonry-container {
                        column-count: 3;
                      }
                    }
                    @media (max-width: 768px) {
                      .media-masonry-container {
                        column-count: 2;
                      }
                    }
                    @media (max-width: 576px) {
                      .media-masonry-container {
                        column-count: 1;
                      }
                    }
                  `}</style>
                  <div className="media-masonry-container">
                    {images.map((image) => {
                      const imageUrl = image.image_url || getImageUrl(image.file_path);
                      return (
                        <div 
                          key={image.id}
                          className="media-masonry-item"
                          style={{
                            display: 'inline-block',
                            width: '100%',
                            marginBottom: '10px',
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid'
                          }}
                        >
                        <div 
                          className="destination-img"
                          style={{
                            width: '100%',
                            height: 'auto',
                            overflow: 'hidden',
                            position: 'relative',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            padding: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <img
                            className="img-fluid"
                            src={imageUrl}
                            alt={image.alt_text || image.filename || 'Media image'}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block',
                              objectFit: 'contain',
                              objectPosition: 'center',
                              borderRadius: '4px'
                            }}
                            onError={(e) => {
                              console.error('Image load error:', imageUrl);
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="search-icon">
                            <a
                              href={imageUrl}
                              data-lightbox={`media-${selectedCategory}`}
                              title={image.caption || image.alt_text || image.filename}
                              style={{ textDecoration: 'none' }}
                            >
                              <i className="fa fa-plus-square fa-1x"></i>
                            </a>
                          </div>
                        </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default MediaGallery;

