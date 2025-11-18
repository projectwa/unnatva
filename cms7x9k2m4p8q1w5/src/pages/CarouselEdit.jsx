import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'react-bootstrap-icons';
import { carouselAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './CarouselEdit.css';

function CarouselEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    heading: '',
    highlighted_words: [],
    image: '',
    link: '',
    is_active: true,
    sort_order: 0,
  });
  const [highlightedWordsInput, setHighlightedWordsInput] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!isNew) {
      loadSlide();
    }
  }, [id]);

  const loadSlide = async () => {
    try {
      setLoading(true);
      const result = await carouselAPI.get(id);
      const slide = result.data;
      setFormData(slide);
      setHighlightedWordsInput(Array.isArray(slide.highlighted_words) 
        ? slide.highlighted_words.join(', ') 
        : '');
      
      // Set image preview if image exists
      if (slide.image) {
        const imageUrl = slide.image.startsWith('http') 
          ? slide.image 
          : `/img/${slide.image}`;
        setImagePreview(imageUrl);
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load slide',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleHighlightedWordsChange = (e) => {
    const value = e.target.value;
    setHighlightedWordsInput(value);
    const words = value.split(',').map(w => w.trim()).filter(w => w);
    setFormData(prev => ({
      ...prev,
      highlighted_words: words
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setNotification({
        message: 'Please select an image file',
        variant: 'danger'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        message: 'Image size must be less than 5MB',
        variant: 'danger'
      });
      return;
    }

    setUploadingImage(true);
    setNotification(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await carouselAPI.uploadImage(formData);
      
      setFormData(prev => ({
        ...prev,
        image: result.filename
      }));

      // Set preview
      if (result.url) {
        setImagePreview(result.url);
      } else {
        setImagePreview(`/img/${result.filename}`);
      }

      setNotification({
        message: 'Image uploaded successfully',
        variant: 'success'
      });
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to upload image',
        variant: 'danger'
      });
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    setImagePreview(null);
  };

  const getImageUrl = (imageFilename) => {
    if (!imageFilename) return null;
    if (imageFilename.startsWith('http://') || imageFilename.startsWith('https://')) {
      return imageFilename;
    }
    const basePath = window.location.pathname.split('/cms7x9k2m4p8q1w5')[0];
    return `${basePath}/img/${imageFilename}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const data = {
        ...formData,
        highlighted_words: formData.highlighted_words
      };

      if (isNew) {
        await carouselAPI.create(data);
        setNotification({
          message: 'Slide created successfully',
          variant: 'success'
        });
      } else {
        await carouselAPI.update(id, data);
        setNotification({
          message: 'Slide updated successfully',
          variant: 'success'
        });
      }
      setTimeout(() => navigate('/carousel'), 1500);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to save slide',
        variant: 'danger'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="cms-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

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
          <h1 className="h3 mb-2">{isNew ? 'Create New Slide' : 'Edit Slide'}</h1>
          <p className="text-muted small">Manage carousel slide content</p>
        </div>
        <Button
          variant="outline"
          className="btn-cms-outline"
          onClick={() => navigate('/carousel')}
        >
          <ArrowLeft className="me-2" size={18} />
          Back
        </Button>
      </div>

      <Card className="card-cms">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Heading *</Form.Label>
              <Form.Control
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                required
                className="form-control-cms"
                placeholder="Carousel heading"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Highlighted Words</Form.Label>
              <Form.Control
                type="text"
                value={highlightedWordsInput}
                onChange={handleHighlightedWordsChange}
                className="form-control-cms"
                placeholder="word1, word2, word3"
              />
              <Form.Text className="text-muted">
                Comma-separated list of words to highlight
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image *</Form.Label>
              
              {imagePreview ? (
                <div className="mb-3">
                  <div className="position-relative d-inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: 'var(--cms-radius-md)',
                        border: '1px solid var(--cms-gray-300)'
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2"
                      onClick={handleRemoveImage}
                      style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Form.Control
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      required
                      className="form-control-cms"
                      placeholder="image-filename.jpg"
                    />
                    <Form.Text className="text-muted">
                      Image filename (or upload new image below)
                    </Form.Text>
                  </div>
                </div>
              ) : (
                <Form.Control
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="form-control-cms mb-2"
                  placeholder="image-filename.jpg"
                />
              )}
              
              <div>
                <Form.Label className="btn btn-outline-secondary btn-sm">
                  <Upload className="me-2" size={16} />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ display: 'none' }}
                  />
                </Form.Label>
                <Form.Text className="d-block text-muted">
                  Upload an image file (JPG, PNG, GIF, WEBP - max 5MB)
                </Form.Text>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="https://example.com"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="is_active"
                    name="is_active"
                    label="Active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sort Order</Form.Label>
                  <Form.Control
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    className="form-control-cms"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline"
                className="btn-cms-outline"
                onClick={() => navigate('/carousel')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-cms-primary"
                disabled={saving}
              >
                <Save className="me-2" size={18} />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CarouselEdit;
