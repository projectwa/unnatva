import React, { useState, useEffect } from 'react';
import { Container, Button, Badge, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash } from 'react-bootstrap-icons';
import { carouselAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './CarouselList.css';

function CarouselList() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const result = await carouselAPI.list();
      setSlides(result.data || []);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load carousel slides',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this slide?')) {
      return;
    }

    try {
      await carouselAPI.delete(id);
      setNotification({
        message: 'Slide deleted successfully',
        variant: 'success'
      });
      loadSlides();
    } catch (err) {
      setNotification({
        message: 'Failed to delete slide: ' + err.message,
        variant: 'danger'
      });
    }
  };

  const getImageUrl = (imageFilename) => {
    if (!imageFilename) return null;
    // Check if it's already a full URL
    if (imageFilename.startsWith('http://') || imageFilename.startsWith('https://')) {
      return imageFilename;
    }
    // Otherwise, construct path to img folder
    const basePath = window.location.pathname.split('/cms7x9k2m4p8q1w5')[0];
    return `${basePath}/img/${imageFilename}`;
  };

  return (
    <Container fluid>
      {notification && (
        <AlertNotification
          variant={notification.variant}
          message={notification.message}
          duration={5000}
          onDismiss={() => setNotification(null)}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-2">Carousel Slides</h1>
          <p className="text-muted small">Manage homepage carousel slides</p>
        </div>
        <Button
          className="btn-cms-primary"
          onClick={() => navigate('/carousel/new')}
        >
          <Plus className="me-2" size={18} />
          New Slide
        </Button>
      </div>

      {loading ? (
        <div className="cms-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : slides.length === 0 ? (
        <Card className="card-cms">
          <Card.Body className="text-center py-5">
            <p className="text-muted mb-0">No carousel slides found. Create your first slide to get started.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-3">
          {slides.map((slide) => {
            const imageUrl = getImageUrl(slide.image);
            return (
              <Col key={slide.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="card-cms h-100 carousel-slide-card">
                  {imageUrl && (
                    <div className="carousel-image-container">
                      <Card.Img
                        variant="top"
                        src={imageUrl}
                        alt={slide.heading || 'Carousel slide'}
                        className="carousel-image"
                      />
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title className="h6 mb-2">{slide.heading || 'Untitled'}</Card.Title>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg={slide.is_active ? 'success' : 'secondary'}>
                        {slide.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-muted small">Order: {slide.sort_order || 0}</span>
                    </div>
                    {slide.link && (
                      <p className="text-muted small mb-2">
                        <a href={slide.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          {slide.link}
                        </a>
                      </p>
                    )}
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-top-0">
                    <div className="d-flex justify-content-end">
                      <ActionMenu
                        actions={[
                          {
                            label: 'Edit',
                            icon: Pencil,
                            onClick: (e) => {
                              e?.stopPropagation();
                              navigate(`/carousel/${slide.id}`);
                            },
                            primary: true,
                            variant: 'primary'
                          },
                          {
                            label: 'Delete',
                            icon: Trash,
                            onClick: (e) => {
                              e?.stopPropagation();
                              handleDelete(slide.id, e);
                            },
                            primary: false,
                            variant: 'danger'
                          }
                        ]}
                        maxVisible={2}
                      />
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default CarouselList;
