import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'react-bootstrap-icons';
import { contentBlocksAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './ContentBlocksEdit.css';

function ContentBlocksEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    block_type: 'whats-happening',
    title: '',
    content: '',
    image: '',
    video_url: '',
    external_link: '',
    is_active: true,
    sort_order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!isNew) {
      loadBlock();
    }
  }, [id]);

  const loadBlock = async () => {
    try {
      setLoading(true);
      const result = await contentBlocksAPI.get(id);
      setFormData(result.data);
      if (result.data.image) {
        setImagePreview(result.data.image);
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load content block',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotification({
        message: 'Please select an image file',
        variant: 'danger'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        message: 'File size must be less than 5MB',
        variant: 'danger'
      });
      return;
    }

    setUploading(true);
    setNotification(null);

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      const result = await contentBlocksAPI.uploadImage(uploadData);
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          image: result.filename
        }));
        setImagePreview(result.filename);
        setNotification({
          message: 'Image uploaded successfully',
          variant: 'success'
        });
      } else {
        setNotification({
          message: result.error || result.message || 'Upload failed',
          variant: 'danger'
        });
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to upload image',
        variant: 'danger'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      if (isNew) {
        await contentBlocksAPI.create(formData);
        setNotification({
          message: 'Content block created successfully',
          variant: 'success'
        });
      } else {
        await contentBlocksAPI.update(id, formData);
        setNotification({
          message: 'Content block updated successfully',
          variant: 'success'
        });
      }
      setTimeout(() => navigate('/content-blocks'), 1500);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to save content block',
        variant: 'danger'
      });
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = (filename) => {
    const pathname = window.location.pathname;
    let baseUrl = '';
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      baseUrl = '/index.php';
    }
    return `${baseUrl}/img/${filename}`;
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
          <h1 className="h3 mb-2">{isNew ? 'Create New Content Block' : 'Edit Content Block'}</h1>
          <p className="text-muted small">Manage "What's Happening" content</p>
        </div>
        <Button
          variant="outline"
          className="btn-cms-outline"
          onClick={() => navigate('/content-blocks')}
        >
          <ArrowLeft className="me-2" size={18} />
          Back
        </Button>
      </div>

      <Card className="card-cms">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control-cms"
                placeholder="e.g., I never imagined I could do this"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                className="form-control-cms"
                placeholder="Full content text"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <ImageIcon className="me-2" size={18} />
                Image
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="form-control-cms"
              />
              {uploading && (
                <Form.Text className="text-muted">Uploading...</Form.Text>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={getImageUrl(imagePreview)} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', marginRight: '10px' }}
                    onError={(e) => {
                      e.target.src = getImageUrl(imagePreview);
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-cms-outline"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                  >
                    <X className="me-1" size={14} />
                    Remove
                  </Button>
                </div>
              )}
              {!imagePreview && formData.image && (
                <div className="mt-2">
                  <img 
                    src={getImageUrl(formData.image)} 
                    alt="Current" 
                    style={{ maxWidth: '200px', maxHeight: '200px', marginRight: '10px' }}
                    onError={(e) => {
                      e.target.src = getImageUrl(formData.image);
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-cms-outline"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: '' }));
                      setImagePreview('');
                    }}
                  >
                    <X className="me-1" size={14} />
                    Remove
                  </Button>
                </div>
              )}
              <Form.Text className="text-muted">
                Upload an image file (JPEG, PNG, GIF, or WebP, max 5MB)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Video URL</Form.Label>
              <Form.Control
                type="text"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
              />
              <Form.Text className="text-muted">
                YouTube embed URL (optional)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>External Link</Form.Label>
              <Form.Control
                type="text"
                name="external_link"
                value={formData.external_link}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="e.g., https://example.com/article"
              />
              <Form.Text className="text-muted">
                Link to external article or page (optional)
              </Form.Text>
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
                  <Form.Text className="text-muted">
                    Lower numbers appear first
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline"
                className="btn-cms-outline"
                onClick={() => navigate('/content-blocks')}
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

export default ContentBlocksEdit;
