import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash } from 'react-bootstrap-icons';
import { impactStatsAPI } from '../services/api';
import PaginatedList from '../components/common/PaginatedList';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './ImpactStatsList.css';

function ImpactStatsList() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await impactStatsAPI.list();
      setStats(result.data || []);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load impact stats',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this stat?')) {
      return;
    }

    try {
      await impactStatsAPI.delete(id);
      setNotification({
        message: 'Stat deleted successfully',
        variant: 'success'
      });
      loadStats();
    } catch (err) {
      setNotification({
        message: 'Failed to delete stat: ' + err.message,
        variant: 'danger'
      });
    }
  };

  const columns = [
    { key: 'value', label: 'Value', sortable: true },
    { key: 'suffix', label: 'Suffix', sortable: true },
    { key: 'text', label: 'Text', sortable: true },
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
      render: (_, stat) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit',
              icon: Pencil,
              onClick: (e) => {
                e?.stopPropagation();
                navigate(`/stats/${stat.id}`);
              },
              primary: true,
              variant: 'primary'
            },
            {
              label: 'Delete',
              icon: Trash,
              onClick: (e) => {
                e?.stopPropagation();
                handleDelete(stat.id, e);
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
          <h1 className="h3 mb-2">Impact Stats</h1>
          <p className="text-muted small">Manage impact statistics</p>
        </div>
        <Button
          className="btn-cms-primary"
          onClick={() => navigate('/stats/new')}
        >
          <Plus className="me-2" size={18} />
          New Stat
        </Button>
      </div>

      <PaginatedList
        data={stats}
        columns={columns}
        itemsPerPage={10}
        loading={loading}
        emptyMessage="No impact stats found. Create your first stat to get started."
        showSearch={true}
        showPagination={true}
      />
    </Container>
  );
}

export default ImpactStatsList;
