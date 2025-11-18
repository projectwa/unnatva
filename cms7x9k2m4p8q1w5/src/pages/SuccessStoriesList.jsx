import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash, Star } from 'react-bootstrap-icons';
import { successStoriesAPI } from '../services/api';
import PaginatedList from '../components/common/PaginatedList';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './SuccessStoriesList.css';

function SuccessStoriesList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const result = await successStoriesAPI.list();
      setStories(result.data || []);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load success stories',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this story?')) {
      return;
    }

    try {
      await successStoriesAPI.delete(id);
      setNotification({
        message: 'Story deleted successfully',
        variant: 'success'
      });
      loadStories();
    } catch (err) {
      setNotification({
        message: 'Failed to delete story: ' + err.message,
        variant: 'danger'
      });
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'quote',
      label: 'Quote',
      sortable: false,
      render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
    },
    {
      key: 'is_published',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge bg={value ? 'success' : 'secondary'}>
          {value ? 'Published' : 'Draft'}
        </Badge>
      )
    },
    {
      key: 'is_featured',
      label: 'Featured',
      sortable: true,
      render: (value) => value ? (
        <Star className="cms-icon-primary" size={18} fill="currentColor" />
      ) : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, story) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit',
              icon: Pencil,
              onClick: (e) => {
                e?.stopPropagation();
                navigate(`/stories/${story.id}`);
              },
              primary: true,
              variant: 'primary'
            },
            {
              label: 'Delete',
              icon: Trash,
              onClick: (e) => {
                e?.stopPropagation();
                handleDelete(story.id, e);
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
          <h1 className="h3 mb-2">Success Stories</h1>
          <p className="text-muted small">Manage success stories</p>
        </div>
        <Button
          className="btn-cms-primary"
          onClick={() => navigate('/stories/new')}
        >
          <Plus className="me-2" size={18} />
          New Story
        </Button>
      </div>

      <PaginatedList
        data={stories}
        columns={columns}
        itemsPerPage={10}
        loading={loading}
        emptyMessage="No success stories found. Create your first story to get started."
        showSearch={true}
        showPagination={true}
      />
    </Container>
  );
}

export default SuccessStoriesList;
