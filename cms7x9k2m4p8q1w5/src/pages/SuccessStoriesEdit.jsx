import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'react-bootstrap-icons';
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
  const [notification, setNotification] = useState(null);

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
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load story',
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
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="form-control-cms"
                    placeholder="Entrepreneurship, Education"
                  />
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
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="Image filename or URL"
              />
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
