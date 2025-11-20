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
  const fileInputRef = React.useRef(null);

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

    // Validate file size (max 850KB)
    if (file.size > 850 * 1024) {
      setNotification({
        message: 'Image size must not exceed 850KB',
        variant: 'danger'
      });
      return;
    }

    // Validate image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      
      const width = img.width;
      const height = img.height;
      const requiredWidth = 912;
      const requiredHeight = 921;
      
      if (width !== requiredWidth || height !== requiredHeight) {
        setNotification({
          message: `Image dimensions must be exactly ${requiredWidth}x${requiredHeight}px. Current: ${width}x${height}px`,
          variant: 'danger'
        });
        setUploadingImage(false);
        e.target.value = '';
        return;
      }
      
      // Continue with upload after dimension validation
      await performUpload(file, e);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setNotification({
        message: 'Failed to load image. Please try another file.',
        variant: 'danger'
      });
      setUploadingImage(false);
      e.target.value = '';
    };
    
    img.src = objectUrl;
  };

  const performUpload = async (file, e) => {
    setUploadingImage(true);
    setNotification(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('Preparing to upload image:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const result = await carouselAPI.uploadImage(formData);
      
      console.log('Upload result:', result);
      
      if (!result || !result.filename) {
        throw new Error('Upload succeeded but no filename returned');
      }
      
      setFormData(prev => ({
        ...prev,
        image: result.filename
      }));

      // Set preview - use the correct path
      if (result.url) {
        setImagePreview(result.url);
      } else {
        // Construct preview URL using the same logic as getImageUrl
        const pathname = window.location.pathname;
        let basePath = '';
        if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
          basePath = pathname.split('/index.php/cms7x9k2m4p8q1w5')[0];
        } else if (pathname.includes('/cms7x9k2m4p8q1w5')) {
          basePath = pathname.split('/cms7x9k2m4p8q1w5')[0];
        }
        setImagePreview(`${basePath}/img/${result.filename}`);
      }

      setNotification({
        message: 'Image uploaded successfully',
        variant: 'success'
      });
    } catch (err) {
      console.error('Image upload error:', err);
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
    // Get the base path by removing the CMS path segment
    let pathname = window.location.pathname;
    
    // Handle /index.php/cms7x9k2m4p8q1w5/... pattern
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      pathname = pathname.split('/index.php/cms7x9k2m4p8q1w5')[0];
    }
    // Handle /cms7x9k2m4p8q1w5/... pattern
    else if (pathname.includes('/cms7x9k2m4p8q1w5')) {
      pathname = pathname.split('/cms7x9k2m4p8q1w5')[0];
    }
    
    // If pathname is empty or just '/', use root
    const basePath = pathname || '';
    
    return `${basePath}/img/${imageFilename}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that image is provided
    if (!formData.image || formData.image.trim() === '') {
      setNotification({
        message: 'Please upload an image for this slide',
        variant: 'danger'
      });
      return;
    }
    
    setSaving(true);
    setNotification(null);

    try {
      // Ensure highlighted_words is an array (not null or undefined)
      const highlightedWords = Array.isArray(formData.highlighted_words) 
        ? formData.highlighted_words 
        : [];
      
      const data = {
        heading: formData.heading || '',
        highlighted_words: highlightedWords,
        image: formData.image || '',
        link: formData.link || '',
        is_active: formData.is_active !== undefined ? formData.is_active : true,
        sort_order: formData.sort_order !== undefined ? parseInt(formData.sort_order, 10) : 0
      };

      console.log('Submitting carousel data:', data);
      console.log('highlighted_words type:', typeof data.highlighted_words, Array.isArray(data.highlighted_words));

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
      console.error('Error saving carousel slide:', err);
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
                    <Form.Text className="text-muted">
                      Current image: {formData.image}
                    </Form.Text>
                  </div>
                </div>
              ) : (
                <div className="mb-3">
                  <div className="alert alert-info" style={{ fontSize: '0.875rem' }}>
                    <strong>Image Requirements:</strong>
                    <ul className="mb-0 mt-2" style={{ paddingLeft: '20px' }}>
                      <li>Dimensions: <strong>912 x 921 pixels</strong> (exact size required)</li>
                      <li>File size: <strong>Maximum 850KB</strong></li>
                      <li>Formats: JPG, PNG, GIF, or WEBP</li>
                    </ul>
                  </div>
                </div>
              )}
              
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-cms-outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  <Upload className="me-2" size={16} />
                  {uploadingImage ? 'Uploading...' : imagePreview ? 'Replace Image' : 'Upload Image'}
                </Button>
                {!imagePreview && (
                  <Form.Text className="d-block text-muted mt-2">
                    Please upload an image file matching the requirements above
                  </Form.Text>
                )}
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
