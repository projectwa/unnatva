import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Save, X } from 'react-bootstrap-icons';
import { mediaAPI } from '../../services/api';

function MediaEditModal({ show, onHide, mediaItem, onSave }) {
  const [formData, setFormData] = useState({
    caption: '',
    alt_text: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mediaItem) {
      setFormData({
        caption: mediaItem.caption || '',
        alt_text: mediaItem.alt_text || '',
      });
      setError(null);
    }
  }, [mediaItem, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await mediaAPI.updateCaptionAlt(mediaItem.id, formData);
      if (onSave) {
        onSave();
      }
      onHide();
    } catch (err) {
      setError(err.message || 'Failed to update media item');
    } finally {
      setSaving(false);
    }
  };

  if (!mediaItem) return null;

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Media</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Alt Text</Form.Label>
            <Form.Control
              type="text"
              name="alt_text"
              value={formData.alt_text}
              onChange={handleChange}
              placeholder="Alternative text for images"
            />
            <Form.Text className="text-muted">
              Describe the image for accessibility
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Media caption"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={onHide}
            disabled={saving}
          >
            <X className="me-2" size={18} />
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
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default MediaEditModal;

