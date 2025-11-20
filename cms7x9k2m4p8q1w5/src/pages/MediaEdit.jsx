import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'react-bootstrap-icons';
import { mediaAPI, mediaCategoriesAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './MediaEdit.css';

function MediaEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNew) {
      loadCategories();
    } else {
      // If editing, redirect to list (editing is done via modal now)
      navigate('/media');
    }
  }, [id, isNew, navigate]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const result = await mediaCategoriesAPI.list();
      if (result && result.data) {
        const activeCategories = result.data
          .filter(cat => cat.is_active)
          .map(cat => cat.name);
        setCategories(activeCategories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      const extension = file.name.split('.').pop().toLowerCase();
      const mimeType = file.type;

      if (!allowedExtensions.includes(extension) || !allowedTypes.includes(mimeType)) {
        errors.push(`${file.name}: Invalid file type. Only JPEG, PNG, and WEBP images are allowed.`);
        return;
      }

      // Validate file size (max 850KB)
      if (file.size > 850 * 1024) {
        errors.push(`${file.name}: File size exceeds 850KB limit.`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setNotification({
        message: errors.join('\n'),
        variant: 'danger'
      });
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    e.target.value = ''; // Reset input
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setNotification({
        message: 'Please select at least one image to upload',
        variant: 'warning'
      });
      return;
    }

    if (!selectedCategory || selectedCategory === '') {
      setNotification({
        message: 'Please select a category',
        variant: 'warning'
      });
      return;
    }

    setUploading(true);
    setNotification(null);
    setUploadProgress({});

    try {
      const formData = new FormData();
      
      // Append all files - use 'images' as key for multiple files
      selectedFiles.forEach((file) => {
        formData.append('images[]', file);
      });
      
      // Append category if selected
      if (selectedCategory) {
        formData.append('category', selectedCategory);
      }

      const result = await mediaAPI.uploadMultiple(formData);

      if (result.success) {
        const successCount = result.data ? result.data.length : 0;
        const errorCount = result.errors ? result.errors.length : 0;
        
        let message = `${successCount} file(s) uploaded successfully.`;
        if (errorCount > 0) {
          message += ` ${errorCount} file(s) failed: ${result.errors.join(', ')}`;
        }

        setNotification({
          message,
          variant: errorCount > 0 ? 'warning' : 'success'
        });

        // Clear form
        setSelectedFiles([]);
        setSelectedCategory('');

        // Redirect to media list after a short delay
        setTimeout(() => {
          navigate('/media');
        }, 2000);
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to upload images',
        variant: 'danger'
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isNew) {
    return null; // Editing is done via modal
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
          <h1 className="h3 mb-2">Upload Multiple Images</h1>
          <p className="text-muted small">Upload multiple images at once (Max 850KB per image, JPEG/PNG/WEBP only)</p>
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
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control-cms"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Select a category to organize your images (required)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Images *</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                className="form-control-cms"
                disabled={uploading}
              />
              <Form.Text className="text-muted">
                Select multiple images. Each image must be JPEG, PNG, or WEBP format and not exceed 850KB.
              </Form.Text>
            </Form.Group>

            {selectedFiles.length > 0 && (
              <div className="mb-3">
                <Form.Label>Selected Files ({selectedFiles.length})</Form.Label>
                <div className="selected-files-list">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="selected-file-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                          <div className="fw-bold">{file.name}</div>
                          <div className="text-muted small">{formatFileSize(file.size)}</div>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline"
                className="btn-cms-outline"
                onClick={() => navigate('/media')}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-cms-primary"
                disabled={uploading || selectedFiles.length === 0 || !selectedCategory}
              >
                <Upload className="me-2" size={18} />
                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Image(s)`}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MediaEdit;
