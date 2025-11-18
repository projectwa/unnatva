import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'react-bootstrap-icons';
import { jobsAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './JobsEdit.css';

function JobsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    experience: '',
    category: '',
    deadline: '',
    is_active: true,
    sort_order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!isNew) {
      loadJob();
    }
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const result = await jobsAPI.get(id);
      setFormData(result.data);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load job listing',
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
        await jobsAPI.create(formData);
        setNotification({
          message: 'Job listing created successfully',
          variant: 'success'
        });
      } else {
        await jobsAPI.update(id, formData);
        setNotification({
          message: 'Job listing updated successfully',
          variant: 'success'
        });
      }
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to save job listing',
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
          <h1 className="h3 mb-2">{isNew ? 'Create New Job Listing' : 'Edit Job Listing'}</h1>
          <p className="text-muted small">Manage job openings</p>
        </div>
        <Button
          variant="outline"
          className="btn-cms-outline"
          onClick={() => navigate('/jobs')}
        >
          <ArrowLeft className="me-2" size={18} />
          Back
        </Button>
      </div>

      <Card className="card-cms">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Job Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control-cms"
                placeholder="e.g., Content Writer"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="Job description"
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="e.g., Nashik"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="e.g., 3 years experience"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="e.g., Content & Marketing"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Date of Application</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={formData.deadline || ''}
                    onChange={handleChange}
                    className="form-control-cms"
                  />
                  <Form.Text className="text-muted">
                    Leave empty for no deadline. Job will be hidden after this date.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={3}>
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
              <Col md={3}>
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
                onClick={() => navigate('/jobs')}
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

export default JobsEdit;
