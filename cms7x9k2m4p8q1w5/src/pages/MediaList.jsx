import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash } from 'react-bootstrap-icons';
import { mediaAPI } from '../services/api';
import PaginatedList from '../components/common/PaginatedList';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './MediaList.css';

function MediaList() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const result = await mediaAPI.list();
      setMedia(result.data || []);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load media items',
        variant: 'danger'
      });
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

  const columns = [
    { key: 'filename', label: 'Filename', sortable: true },
    { key: 'file_type', label: 'Type', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'file_size',
      label: 'Size',
      sortable: true,
      render: (value) => formatFileSize(value)
    },
    {
      key: 'dimensions',
      label: 'Dimensions',
      sortable: false,
      render: (_, item) => item.width && item.height ? `${item.width}×${item.height}` : '-'
    },
    {
      key: 'created_at',
      label: 'Uploaded',
      sortable: true,
      render: (value) => formatDate(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, item) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit',
              icon: Pencil,
              onClick: (e) => {
                e?.stopPropagation();
                navigate(`/media/${item.id}`);
              },
              primary: true,
              variant: 'primary'
            },
            {
              label: 'Delete',
              icon: Trash,
              onClick: (e) => {
                e?.stopPropagation();
                handleDelete(item.id, e);
              },
              primary: false,
              variant: 'danger'
            }
          ]}
          maxVisible={2}
        />
      )
    }
  ];

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
        <Button
          className="btn-cms-primary"
          onClick={() => navigate('/media/new')}
        >
          <Plus className="me-2" size={18} />
          Upload Media
        </Button>
      </div>

      <PaginatedList
        data={media}
        columns={columns}
        itemsPerPage={10}
        loading={loading}
        emptyMessage="No media items found. Upload your first media file to get started."
        showSearch={true}
        showPagination={true}
      />
    </Container>
  );
}

export default MediaList;
