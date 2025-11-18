import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Badge } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Trash, FileExcel } from 'react-bootstrap-icons';
import { jobApplicationsAPI } from '../services/api';
import PaginatedList from '../components/common/PaginatedList';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './JobApplicationsList.css';

function JobApplicationsList() {
  const [searchParams] = useSearchParams();
  const jobListingId = searchParams.get('job_listing_id');
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadApplications();
  }, [jobListingId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const result = await jobApplicationsAPI.list(jobListingId);
      setApplications(result.data || []);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load applications',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async (id, applicantName) => {
    try {
      const response = await fetch(
        `/index.php/cms7x9k2m4p8q1w5/api/job-applications/${id}/download-resume`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${applicantName}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setNotification({
        message: 'Resume downloaded successfully',
        variant: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Failed to download resume: ' + (err.message || 'Unknown error'),
        variant: 'danger'
      });
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      await jobApplicationsAPI.delete(id);
      setNotification({
        message: 'Application deleted successfully',
        variant: 'success'
      });
      loadApplications();
    } catch (err) {
      setNotification({
        message: 'Failed to delete application: ' + (err.message || 'Unknown error'),
        variant: 'danger'
      });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await jobApplicationsAPI.update(id, { status: newStatus });
      setNotification({
        message: 'Status updated successfully',
        variant: 'success'
      });
      loadApplications();
    } catch (err) {
      setNotification({
        message: 'Failed to update status: ' + (err.message || 'Unknown error'),
        variant: 'danger'
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      await jobApplicationsAPI.exportExcel(jobListingId);
      setNotification({
        message: 'Applications exported successfully',
        variant: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Failed to export: ' + (err.message || 'Unknown error'),
        variant: 'danger'
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'shortlisted': return 'success';
      case 'reviewed': return 'info';
      case 'rejected': return 'danger';
      default: return 'warning';
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'contact_number', label: 'Contact', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'applied_job_profile', label: 'Job Profile', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, item) => (
        <Form.Select
          value={value || 'pending'}
          onChange={(e) => handleStatusChange(item.id, e.target.value)}
          size="sm"
          className="form-control-cms"
          style={{ minWidth: '120px' }}
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </Form.Select>
      )
    },
    {
      key: 'created_at',
      label: 'Applied Date',
      sortable: true,
      render: (value) => formatDate(value)
    },
    {
      key: 'resume',
      label: 'Resume',
      sortable: false,
      render: (_, item) => item.resume_filename ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Download Resume</Tooltip>}
        >
          <Button
            variant="outline"
            size="sm"
            className="btn-cms-outline"
            onClick={() => handleDownloadResume(item.id, item.name)}
          >
            <Download size={16} />
          </Button>
        </OverlayTrigger>
      ) : (
        <span className="text-muted">No resume</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, item) => (
        <ActionMenu
          actions={[
            {
              label: 'Delete',
              icon: Trash,
              onClick: (e) => {
                e?.stopPropagation();
                handleDelete(item.id, e);
              },
              primary: true,
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
          <h1 className="h3 mb-2">Job Applications</h1>
          <p className="text-muted small">
            {jobListingId ? 'Applications for this job' : 'All job applications'}
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline"
            className="btn-cms-outline"
            onClick={handleExportExcel}
          >
            <FileExcel className="me-2" size={18} />
            Export Excel
          </Button>
          <Button
            variant="outline"
            className="btn-cms-outline"
            onClick={() => navigate('/jobs')}
          >
            <ArrowLeft className="me-2" size={18} />
            Back to Jobs
          </Button>
        </div>
      </div>

      <PaginatedList
        data={applications}
        columns={columns}
        itemsPerPage={10}
        loading={loading}
        emptyMessage="No applications found."
        showSearch={true}
        showPagination={true}
      />
    </Container>
  );
}

export default JobApplicationsList;
