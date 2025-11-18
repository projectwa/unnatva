import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'react-bootstrap-icons';
import { impactStatsAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './ImpactStatsEdit.css';

function ImpactStatsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    value: '',
    suffix: '',
    text: '',
    bg: '',
    is_active: true,
    sort_order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!isNew) {
      loadStat();
    }
  }, [id]);

  const loadStat = async () => {
    try {
      setLoading(true);
      const result = await impactStatsAPI.get(id);
      setFormData(result.data);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load stat',
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
        await impactStatsAPI.create(formData);
        setNotification({
          message: 'Stat created successfully',
          variant: 'success'
        });
      } else {
        await impactStatsAPI.update(id, formData);
        setNotification({
          message: 'Stat updated successfully',
          variant: 'success'
        });
      }
      setTimeout(() => navigate('/stats'), 1500);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to save stat',
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
          <h1 className="h3 mb-2">{isNew ? 'Create New Impact Stat' : 'Edit Impact Stat'}</h1>
          <p className="text-muted small">Manage impact statistics</p>
        </div>
        <Button
          variant="outline"
          className="btn-cms-outline"
          onClick={() => navigate('/stats')}
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
                  <Form.Label>Value *</Form.Label>
                  <Form.Control
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    required
                    className="form-control-cms"
                    placeholder="e.g., 4519"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Suffix</Form.Label>
                  <Form.Control
                    type="text"
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                    className="form-control-cms"
                    placeholder="e.g., +, %, Cr."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Text *</Form.Label>
              <Form.Control
                type="text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                required
                className="form-control-cms"
                placeholder="e.g., Lives Impacted"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Background Color</Form.Label>
              <Form.Control
                type="text"
                name="bg"
                value={formData.bg}
                onChange={handleChange}
                className="form-control-cms"
                placeholder="e.g., #00a470"
              />
              <Form.Text className="text-muted">
                Hex color code for stat background
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
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline"
                className="btn-cms-outline"
                onClick={() => navigate('/stats')}
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

export default ImpactStatsEdit;
