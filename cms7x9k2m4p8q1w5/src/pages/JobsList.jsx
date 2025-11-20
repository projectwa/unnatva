import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash, People } from 'react-bootstrap-icons';
import { jobsAPI } from '../services/api';
import PaginatedList from '../components/common/PaginatedList';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './JobsList.css';

function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const result = await jobsAPI.list();
      setJobs(result.data || []);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load jobs',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this job listing?')) {
      return;
    }

    try {
      await jobsAPI.delete(id);
      setNotification({
        message: 'Job listing deleted successfully',
        variant: 'success'
      });
      loadJobs();
    } catch (err) {
      setNotification({
        message: 'Failed to delete job: ' + (err.message || 'Unknown error'),
        variant: 'danger'
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    const deadline = new Date(dateString);
    deadline.setHours(23, 59, 59, 999);
    return deadline < new Date();
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'experience', label: 'Experience', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'deadline',
      label: 'Deadline',
      sortable: true,
      render: (value) => {
        if (!value) return <span className="text-muted">No deadline</span>;
        const expired = isExpired(value);
        return (
          <span className={expired ? 'text-danger' : 'text-primary'}>
            {formatDate(value)}
          </span>
        );
      }
    },
    {
      key: 'application_count',
      label: 'Applications',
      sortable: true,
      render: (value, job) => (
        <Button
          variant="link"
          className="p-0 text-decoration-none d-inline-flex align-items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/job-applications/job/${job.id}`);
          }}
          style={{ color: 'var(--cms-primary)' }}
        >
          <People size={18} />
          <Badge bg="primary" className="ms-1">
            {value || 0}
          </Badge>
        </Button>
      )
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
      render: (_, job) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit',
              icon: Pencil,
              onClick: (e) => {
                e?.stopPropagation();
                navigate(`/jobs/${job.id}`);
              },
              primary: true,
              variant: 'primary'
            },
            {
              label: 'Delete',
              icon: Trash,
              onClick: (e) => {
                e?.stopPropagation();
                handleDelete(job.id, e);
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
          <h1 className="h3 mb-2">Job Listings</h1>
          <p className="text-muted small">Manage job openings</p>
        </div>
        <Button
          className="btn-cms-primary"
          onClick={() => navigate('/jobs/new')}
        >
          <Plus className="me-2" size={18} />
          Add New Job
        </Button>
      </div>

      <PaginatedList
        data={jobs}
        columns={columns}
        itemsPerPage={10}
        loading={loading}
        emptyMessage="No job listings found. Create your first job listing to get started."
        showSearch={true}
        showPagination={true}
      />
    </Container>
  );
}

export default JobsList;
