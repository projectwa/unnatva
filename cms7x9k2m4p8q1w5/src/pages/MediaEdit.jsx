import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'react-bootstrap-icons';
import { mediaAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './MediaEdit.css';

function MediaEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    filename: '',
    original_filename: '',
    file_path: '',
    file_type: '',
    mime_type: '',
    file_size: '',
    width: '',
    height: '',
    alt_text: '',
    caption: '',
    category: '',
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!isNew) {
      loadMedia();
    }
  }, [id]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const result = await mediaAPI.get(id);
      const item = result.data;
      setFormData(item);
      setTagsInput(Array.isArray(item.tags) ? item.tags.join(', ') : '');
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load media item',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData(prev => ({
      ...prev,
      tags: tags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const data = {
        ...formData,
        file_size: formData.file_size ? parseInt(formData.file_size) : null,
        width: formData.width ? parseInt(formData.width) : null,
        height: formData.height ? parseInt(formData.height) : null,
        tags: formData.tags
      };

      if (isNew) {
        await mediaAPI.create(data);
        setNotification({
          message: 'Media item created successfully',
          variant: 'success'
        });
      } else {
        await mediaAPI.update(id, data);
        setNotification({
          message: 'Media item updated successfully',
          variant: 'success'
        });
      }
      setTimeout(() => navigate('/media'), 1500);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to save media item',
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
          <h1 className="h3 mb-2">{isNew ? 'Upload New Media' : 'Edit Media Item'}</h1>
          <p className="text-muted small">Manage media files</p>
        </div>
        <Button
          variant="outline"
          className="btn-cms-outline"
          onClick={() => navigate('/media')}
        >
          <ArrowLeft className="me-2" size={18} />
          Back
        </Button>
      </div>

      <Card className="card-cms">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filename *</Form.Label>
                  <Form.Control
                    type="text"
                    name="filename"
                    value={formData.filename}
                    onChange={handleChange}
                    required
                    className="form-control-cms"
                    placeholder="e.g., image.jpg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Original Filename</Form.Label>
                  <Form.Control
                    type="text"
                    name="original_filename"
                    value={formData.original_filename}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="Original filename"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>File Path *</Form.Label>
              <Form.Control
                type="text"
                name="file_path"
                value={formData.file_path}
                onChange={handleChange}
                required
                className="form-control-cms"
                placeholder="e.g., /uploads/images/image.jpg"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>File Type *</Form.Label>
                  <Form.Control
                    type="text"
                    name="file_type"
                    value={formData.file_type}
                    onChange={handleChange}
                    required
                    className="form-control-cms"
                    placeholder="e.g., image, video, document"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>MIME Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="mime_type"
                    value={formData.mime_type}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="e.g., image/jpeg"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>File Size (bytes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="file_size"
                    value={formData.file_size}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="File size in bytes"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Width</Form.Label>
                  <Form.Control
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="Image width in pixels"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Height</Form.Label>
                  <Form.Control
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="Image height in pixels"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Alt Text</Form.Label>
              <Form.Control
                type="text"
                name="alt_text"
                value={formData.alt_text}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="Alternative text for images"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="Media caption"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="e.g., photos, videos, documents"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={tagsInput}
                    onChange={handleTagsChange}
                    className="form-control-cms"
                    placeholder="e.g., event, team, 2024"
                  />
                  <Form.Text className="text-muted">
                    Separate tags with commas
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline"
                className="btn-cms-outline"
                onClick={() => navigate('/media')}
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

export default MediaEdit;
