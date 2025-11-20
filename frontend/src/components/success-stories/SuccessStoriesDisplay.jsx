import React, { useState, useEffect } from 'react';
import { Container, Nav, Tab, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { successStoriesAPI } from '../../services/api';
import './SuccessStoriesDisplay.css';

function SuccessStoriesDisplay() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('entrepreneurship-development');

  const categories = [
    { key: 'entrepreneurship-development', label: 'Entrepreneurship Development' },
    { key: 'skill-development', label: 'Skill Development' },
    { key: 'women-empowerment', label: 'Women Empowerment' },
    { key: 'education', label: 'Education' },
  ];

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading success stories from API...');
      const data = await successStoriesAPI.getAll();
      console.log('Success stories loaded:', data);
      setStories(data);
    } catch (err) {
      console.error('Error loading success stories:', err);
      setError(err.message || 'Failed to load success stories');
    } finally {
      setLoading(false);
    }
  };

  const getStoriesByCategory = (category) => {
    return stories.filter(story => story.category === category);
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return null;
    // Handle both relative and absolute paths
    if (imageName.startsWith('http')) {
      return imageName;
    }
    // Check if we're in index.php path
    const pathname = window.location.pathname;
    const basePath = pathname.includes('/index.php') ? '/index.php' : '';
    return `${basePath}/img/${imageName}`;
  };

  const getQuoteIconUrl = () => {
    const pathname = window.location.pathname;
    const basePath = pathname.includes('/index.php') ? '/index.php' : '';
    return `${basePath}/img/quotes.svg`;
  };

  const formatCategoryLabel = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const getBannerImageUrl = () => {
    const pathname = window.location.pathname;
    const basePath = pathname.includes('/index.php') ? '/index.php' : '';
    return `${basePath}/img/banner-success-stories-top.png`;
  };

  return (
    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
      <>
        {/* Banner Section with Overlapping Content */}
        <div className="container-fluid m-0 p-0 pt-1 position-relative wow fadeIn" data-wow-delay="0.1s" style={{ position: 'relative' }}>
          <img 
            className="img-fluid w-100 banner-success-stories" 
            src={getBannerImageUrl()} 
            alt="Success Stories Banner"
          />
          <div className="banner-caption text-center">
            <h2 className="mb-3">Success Stories</h2>
            <h5>Hear it from our participants</h5>
          </div>
          
          {/* Category Tabs - Overlapping the banner */}
          <div className="tabs-overlay-container">
            <Nav variant="pills" className="mb-0 justify-content-center align-items-center" id="pills-tab" role="tablist">
              {categories.map((category, index) => {
                const categoryStories = getStoriesByCategory(category.key);
                const isActive = activeTab === category.key;
                return (
                  <Nav.Item key={category.key} role="presentation">
                    <Nav.Link
                      eventKey={category.key}
                      className={`fw-semibold rounded-btn rounded-pill position-relative ${isActive ? 'active' : ''}`}
                      id={`pills-${category.key}-tab`}
                      type="button"
                      role="tab"
                      aria-controls={`pills-${category.key}`}
                      aria-selected={isActive}
                    >
                      {category.label}
                      {categoryStories.length > 0 && (
                        <span className="badge bg-secondary ms-2">{categoryStories.length}</span>
                      )}
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </div>
        </div>

        {/* Story Content Section - Below banner */}
        <div className="container-fluid overflow-hidden px-lg-0" id="success-stories-content">
          <Tab.Content className="p-3" id="pills-tabContent">
            {categories.map((category) => {
              const categoryStories = getStoriesByCategory(category.key);
              const isActive = activeTab === category.key;
              
              return (
                <Tab.Pane 
                  key={category.key} 
                  eventKey={category.key}
                  id={`pills-${category.key}`}
                  role="tabpanel"
                  aria-labelledby={`pills-${category.key}-tab`}
                  className={isActive ? 'show active' : ''}
                >
                  {categoryStories.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No success stories available in this category yet.</p>
                    </div>
                  ) : (
                    <div className="stories-container">
                      {categoryStories.map((story, index) => {
                        const isEven = index % 2 === 0;
                        const imageUrl = getImageUrl(story.image);
                        
                        return (
                          <Card key={story.id || index} className="quote-box mb-4">
                            <Row className="g-0 align-items-center">
                              {/* Text Section */}
                              <Col lg={6} className={`p-4 p-md-5 d-flex flex-column flex-md-row ${!isEven ? 'order-lg-2' : ''}`}>
                                <div className="px-4 pb-4 pb-lg-0">
                                  <img 
                                    src={getQuoteIconUrl()} 
                                    alt="Quote icon" 
                                    style={{ width: '40px', height: '40px' }}
                                  />
                                </div>
                                <div>
                                  {story.quote && (
                                    <p className="text-dark fw-bold mb-4" style={{ textAlign: 'justify' }}>
                                      {story.quote}
                                    </p>
                                  )}
                                  {story.story && (
                                    <div className="small" style={{ textAlign: 'justify', lineHeight: '150%' }}>
                                      {story.story.split('\n\n').map((paragraph, pIndex) => (
                                        <p key={pIndex} className="mb-4">
                                          {paragraph}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              
                              {/* Image and Details Section */}
                              <Col lg={6} className={`d-flex flex-column justify-content-center ${!isEven ? 'order-lg-1' : ''}`}>
                                <div className="h-100 d-flex flex-column story-image p-4 p-md-5">
                                  <div className="photo-content">
                                    {imageUrl && (
                                      <img 
                                        className="img-fluid mb-3" 
                                        src={imageUrl} 
                                        alt={story.name || 'Success story'} 
                                      />
                                    )}
                                    {story.name && <p className="mb-0">Name: {story.name}</p>}
                                    {story.place && <p className="mb-0">Place: {story.place}</p>}
                                    {story.course && <p className="mb-0">Course: {story.course}</p>}
                                    {story.profession && <p className="mb-0">Current Profession: {story.profession}</p>}
                                    {story.turnover && <p className="mb-0">Turnover: {story.turnover}</p>}
                                    {story.employment_generated && (
                                      <p className="mb-0">Employment Generation: {story.employment_generated}</p>
                                    )}
                                    {story.metadata && typeof story.metadata === 'object' && (
                                      <>
                                        {story.metadata.salary && (
                                          <p className="mb-0">
                                            {story.metadata.salary_type === 'monthly' ? 'Monthly' : 'Annual'} Salary: {story.metadata.salary}
                                          </p>
                                        )}
                                        {story.metadata.employed_at && (
                                          <p className="mb-0">Employed at: {story.metadata.employed_at}</p>
                                        )}
                                        {story.metadata.before_training && (
                                          <p className="mb-0">Before Training: {story.metadata.before_training}</p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </Tab.Pane>
              );
            })}
          </Tab.Content>
        </div>
      </>
    </Tab.Container>
  );
}

export default SuccessStoriesDisplay;

