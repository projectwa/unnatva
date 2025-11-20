import React, { useState, useEffect } from 'react';
import { Container, Button, Badge, Row, Col, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash, Folder2 } from 'react-bootstrap-icons';
import { mediaAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import CategoryManager from '../components/media/CategoryManager';
import MediaEditModal from '../components/media/MediaEditModal';
import './MediaList.css';

function MediaList() {
  const [media, setMedia] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMedia();
  }, [selectedCategory]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      setNotification(null);
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const result = await mediaAPI.list(params);
      
      if (result && result.data) {
        setMedia(Array.isArray(result.data) ? result.data : []);
      } else if (Array.isArray(result)) {
        setMedia(result);
      } else {
        setMedia([]);
      }
      
      // Set categories if available
      if (result && result.categories) {
        setCategories(result.categories);
      }
    } catch (err) {
      console.error('Error loading media:', err);
      setNotification({
        message: err.message || 'Failed to load media items',
        variant: 'danger'
      });
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this media item?')) {
      return;
    }

    try {
      await mediaAPI.delete(id);
      setNotification({
        message: 'Media item deleted successfully',
        variant: 'success'
      });
      loadMedia();
    } catch (err) {
      setNotification({
        message: 'Failed to delete media item: ' + err.message,
        variant: 'danger'
      });
    }
  };

  const getImageUrl = (filePath) => {
    if (!filePath) return null;
    // Check if it's already a full URL
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    // Otherwise, construct path to img folder
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
    
    return `${basePath}/img/${filePath}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const isImage = (mimeType, fileType) => {
    if (fileType === 'image') return true;
    if (mimeType && mimeType.startsWith('image/')) return true;
    return false;
  };

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
          <h1 className="h3 mb-2">Media Library</h1>
          <p className="text-muted small">Manage media files</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            onClick={() => setShowCategoryManager(true)}
          >
            <Folder2 className="me-2" size={18} />
            Manage Category
          </Button>
          <Button
            className="btn-cms-primary"
            onClick={() => navigate('/media/new')}
          >
            <Plus className="me-2" size={18} />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-4">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </div>
      )}

      {loading ? (
        <div className="cms-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : media.length === 0 ? (
        <Card className="card-cms">
          <Card.Body className="text-center py-5">
            <p className="text-muted mb-0">
              {selectedCategory !== 'all' 
                ? `No media items found in "${selectedCategory}" category.`
                : 'No media items found. Upload your first media file to get started.'}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-3">
          {media.map((item) => {
            if (!item || !item.id) {
              console.warn('Invalid media item data:', item);
              return null;
            }
            
            const imageUrl = isImage(item.mime_type, item.file_type) ? getImageUrl(item.file_path) : null;
            
            return (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="card-cms h-100 media-item-card">
                  {imageUrl && (
                    <div className="media-image-container">
                      <Card.Img
                        variant="top"
                        src={imageUrl}
                        alt={item.alt_text || item.filename || 'Media item'}
                        className="media-image"
                        onError={(e) => {
                          console.error('Image load error:', imageUrl);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {!imageUrl && (
                    <div className="media-image-container media-placeholder">
                      <div className="media-placeholder-content">
                        <span className="media-file-icon">📄</span>
                        <span className="media-file-type">{item.file_type || 'File'}</span>
                      </div>
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title className="h6 mb-2" title={item.filename}>
                      {item.filename || 'Untitled'}
                    </Card.Title>
                    {item.category && (
                      <Badge bg="secondary" className="mb-2">
                        {item.category}
                      </Badge>
                    )}
                    <div className="media-meta small text-muted">
                      {item.width && item.height && (
                        <div>{item.width}×{item.height}</div>
                      )}
                      {item.file_size && (
                        <div>{formatFileSize(item.file_size)}</div>
                      )}
                      {item.created_at && (
                        <div>{formatDate(item.created_at)}</div>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-top-0">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMedia(item);
                          setShowEditModal(true);
                        }}
                      >
                        <Pencil className="me-2" size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id, e);
                        }}
                      >
                        <Trash className="me-2" size={14} />
                        Delete
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <CategoryManager
        show={showCategoryManager}
        onHide={() => {
          setShowCategoryManager(false);
          loadMedia(); // Reload to refresh categories
        }}
      />

      <MediaEditModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setEditingMedia(null);
        }}
        mediaItem={editingMedia}
        onSave={() => {
          loadMedia();
        }}
      />
    </Container>
  );
}

export default MediaList;
