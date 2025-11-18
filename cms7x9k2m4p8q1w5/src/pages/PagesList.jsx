import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash } from 'react-bootstrap-icons';
import { pagesAPI } from '../services/api';
import PaginatedList from '../components/common/PaginatedList';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './PagesList.css';

function PagesList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const result = await pagesAPI.list();
      setPages(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load pages');
      setNotification({
        message: err.message || 'Failed to load pages',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      await pagesAPI.delete(id);
      setNotification({
        message: 'Page deleted successfully',
        variant: 'success'
      });
      loadPages();
    } catch (err) {
      setNotification({
        message: 'Failed to delete page: ' + err.message,
        variant: 'danger'
      });
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true
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
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, page) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit',
              icon: Pencil,
              onClick: (e) => {
                e?.stopPropagation();
                navigate(`/pages/${page.id}`);
              },
              primary: true,
              variant: 'primary'
            },
            {
              label: 'Delete',
              icon: Trash,
              onClick: (e) => {
                e?.stopPropagation();
                handleDelete(page.id, e);
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

  const renderRow = (page, index) => (
    <div
      key={page.id}
      className="cms-list-item card-cms p-3 mb-2"
      onClick={() => navigate(`/pages/${page.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">{page.title}</h6>
          <small className="text-muted">{page.slug}</small>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Badge bg={page.is_published ? 'success' : 'secondary'}>
            {page.is_published ? 'Published' : 'Draft'}
          </Badge>
          <ActionMenu
            actions={[
              {
                label: 'Edit',
                icon: Pencil,
                onClick: (e) => {
                  e?.stopPropagation();
                  navigate(`/pages/${page.id}`);
                },
                primary: true,
                variant: 'primary'
              },
              {
                label: 'Delete',
                icon: Trash,
                onClick: (e) => {
                  e?.stopPropagation();
                  handleDelete(page.id, e);
                },
                primary: false,
                variant: 'danger'
              }
            ]}
            maxVisible={2}
          />
        </div>
      </div>
    </div>
  );

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
          <h1 className="h3 mb-2">Pages</h1>
          <p className="text-muted small">Manage your website pages</p>
        </div>
        <Button
          className="btn-cms-primary"
          onClick={() => navigate('/pages/new')}
        >
          <Plus className="me-2" size={18} />
          New Page
        </Button>
      </div>

      <PaginatedList
        data={pages}
        columns={columns}
        itemsPerPage={10}
        loading={loading}
        emptyMessage="No pages found. Create your first page to get started."
        showSearch={true}
        showPagination={true}
      />
    </Container>
  );
}

export default PagesList;
