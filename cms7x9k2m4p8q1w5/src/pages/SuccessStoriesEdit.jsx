import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'react-bootstrap-icons';
import { successStoriesAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './SuccessStoriesEdit.css';

function SuccessStoriesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    slug: '',
    category: '',
    name: '',
    quote: '',
    story: '',
    image: '',
    place: '',
    course: '',
    profession: '',
    turnover: '',
    employment_generated: '',
    is_featured: false,
    is_published: false,
    sort_order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!isNew) {
      loadStory();
    }
  }, [id]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const result = await successStoriesAPI.get(id);
      setFormData(result.data);
      if (result.data.image) {
        setImagePreview(result.data.image);
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load story',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setNotification({
        message: 'Invalid file type. Only JPEG, PNG, and WEBP images are allowed.',
        variant: 'danger'
      });
      e.target.value = ''; // Reset file input
      return;
    }

    // Validate file size (850KB max)
    if (file.size > 850 * 1024) {
      setNotification({
        message: 'File size must be less than 850KB',
        variant: 'danger'
      });
      e.target.value = ''; // Reset file input
      return;
    }

    setUploading(true);
    setNotification(null);

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      const result = await successStoriesAPI.uploadImage(uploadData);
      
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
      e.target.value = ''; // Reset file input
    }
  };

  const getImageUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    let pathname = window.location.pathname;
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      pathname = pathname.split('/index.php/cms7x9k2m4p8q1w5')[0];
    } else if (pathname.includes('/cms7x9k2m4p8q1w5')) {
      pathname = pathname.split('/cms7x9k2m4p8q1w5')[0];
    }
    const basePath = pathname || '';
    return `${basePath}/img/${filename}`;
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
        await successStoriesAPI.create(formData);
        setNotification({
          message: 'Story created successfully',
          variant: 'success'
        });
      } else {
        await successStoriesAPI.update(id, formData);
        setNotification({
          message: 'Story updated successfully',
          variant: 'success'
        });
      }
      setTimeout(() => navigate('/stories'), 1500);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to save story',
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
          <h1 className="h3 mb-2">{isNew ? 'Create New Success Story' : 'Edit Success Story'}</h1>
          <p className="text-muted small">Manage success story content</p>
        </div>
        <Button
          variant="outline"
          className="btn-cms-outline"
          onClick={() => navigate('/stories')}
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
                  <Form.Label>Slug *</Form.Label>
                  <Form.Control
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="form-control-cms"
                    placeholder="john-doe-entrepreneur"
                  />
                  <Form.Text className="text-muted">
                    URL-friendly identifier (lowercase, hyphens)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="form-control-cms"
                  >
                    <option value="">Select a category</option>
                    <option value="entrepreneurship-development">Entrepreneurship Development</option>
                    <option value="skill-development">Skill Development</option>
                    <option value="women-empowerment">Women Empowerment</option>
                    <option value="education">Education</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control-cms"
                placeholder="Person's name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quote *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                required
                className="form-control-cms"
                placeholder="Inspirational quote"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Story</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="story"
                value={formData.story}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="Full story text"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <ImageIcon className="me-2" size={18} />
                Image
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                className="form-control-cms"
              />
              <Form.Text className="text-muted">
                Accepted formats: JPEG, PNG, WEBP. Maximum file size: 850KB
              </Form.Text>
              {uploading && (
                <Form.Text className="text-muted d-block">Uploading...</Form.Text>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={getImageUrl(imagePreview)} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', marginRight: '10px', borderRadius: '8px' }}
                    onError={(e) => {
                      e.target.src = getImageUrl(imagePreview);
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-cms-outline mt-2"
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
                  <Form.Text className="text-muted">Current image: {formData.image}</Form.Text>
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-cms-outline ms-2"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                  >
                    <X className="me-1" size={14} />
                    Clear
                  </Button>
                </div>
              )}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Place</Form.Label>
                  <Form.Control
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="Location"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <Form.Control
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="Course name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profession</Form.Label>
                  <Form.Control
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="Profession"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Turnover</Form.Label>
                  <Form.Control
                    type="text"
                    name="turnover"
                    value={formData.turnover}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="Business turnover"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Employment Generated</Form.Label>
              <Form.Control
                type="text"
                name="employment_generated"
                value={formData.employment_generated}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="Number of jobs created"
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="is_featured"
                    name="is_featured"
                    label="Featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="is_published"
                    name="is_published"
                    label="Published"
                    checked={formData.is_published}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
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
                onClick={() => navigate('/stories')}
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

export default SuccessStoriesEdit;
