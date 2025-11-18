import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'react-bootstrap-icons';
import { pagesAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './PagesEdit.css';

function PagesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    body_class: '',
    content: '',
    is_published: true,
    sort_order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!isNew) {
      loadPage();
    }
  }, [id]);

  const loadPage = async () => {
    try {
      setLoading(true);
      const result = await pagesAPI.get(id);
      setFormData(result.data);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load page',
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
        await pagesAPI.create(formData);
        setNotification({
          message: 'Page created successfully',
          variant: 'success'
        });
      } else {
        await pagesAPI.update(id, formData);
        setNotification({
          message: 'Page updated successfully',
          variant: 'success'
        });
      }
      setTimeout(() => navigate('/pages'), 1500);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to save page',
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
          <h1 className="h3 mb-2">{isNew ? 'Create New Page' : 'Edit Page'}</h1>
          <p className="text-muted small">Manage page content and settings</p>
        </div>
        <Button
          variant="outline"
          className="btn-cms-outline"
          onClick={() => navigate('/pages')}
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
                    placeholder="page-slug"
                  />
                  <Form.Text className="text-muted">
                    URL-friendly identifier (e.g., "about-us")
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="form-control-cms"
                    placeholder="Page Title"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="Page content (HTML allowed)"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Meta Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="SEO meta title"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Body Class</Form.Label>
                  <Form.Control
                    type="text"
                    name="body_class"
                    value={formData.body_class}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="act_page"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="SEO meta description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meta Keywords</Form.Label>
              <Form.Control
                type="text"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="keyword1, keyword2, keyword3"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
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
                onClick={() => navigate('/pages')}
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

export default PagesEdit;
