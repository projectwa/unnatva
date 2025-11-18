import React, { useState, useEffect } from 'react';
import { Container, Button, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash } from 'react-bootstrap-icons';
import { contentBlocksAPI } from '../services/api';
import PaginatedList from '../components/common/PaginatedList';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './ContentBlocksList.css';

function ContentBlocksList() {
  const [blocks, setBlocks] = useState([]);
  const [filterType, setFilterType] = useState('whats-happening');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      const result = await contentBlocksAPI.list();
      setBlocks(result.data || []);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load content blocks',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this content block?')) {
      return;
    }

    try {
      await contentBlocksAPI.delete(id);
      setNotification({
        message: 'Content block deleted successfully',
        variant: 'success'
      });
      loadBlocks();
    } catch (err) {
      setNotification({
        message: 'Failed to delete content block: ' + err.message,
        variant: 'danger'
      });
    }
  };

  const filteredData = filterType 
    ? blocks.filter(block => block.block_type === filterType)
    : blocks;

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'block_type', label: 'Type', sortable: true },
    { key: 'image', label: 'Image', sortable: false },
    {
      key: 'content',
      label: 'Content Preview',
      sortable: false,
      render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge bg={value ? 'success' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { key: 'sort_order', label: 'Order', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, block) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit',
              icon: Pencil,
              onClick: (e) => {
                e?.stopPropagation();
                navigate(`/content-blocks/${block.id}`);
              },
              primary: true,
              variant: 'primary'
            },
            {
              label: 'Delete',
              icon: Trash,
              onClick: (e) => {
                e?.stopPropagation();
                handleDelete(block.id, e);
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
          <h1 className="h3 mb-2">What's Happening Now?</h1>
          <p className="text-muted small">Manage content blocks</p>
        </div>
        <Button
          className="btn-cms-primary"
          onClick={() => navigate('/content-blocks/new')}
        >
          <Plus className="me-2" size={18} />
          New Block
        </Button>
      </div>

      <div className="mb-3">
        <Form.Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-control-cms"
          style={{ maxWidth: '300px' }}
        >
          <option value="whats-happening">What's Happening</option>
          <option value="">All Types</option>
        </Form.Select>
      </div>

      <PaginatedList
        data={filteredData}
        columns={columns}
        itemsPerPage={10}
        loading={loading}
        emptyMessage="No content blocks found. Create your first block to get started."
        showSearch={true}
        showPagination={true}
      />
    </Container>
  );
}

export default ContentBlocksList;
