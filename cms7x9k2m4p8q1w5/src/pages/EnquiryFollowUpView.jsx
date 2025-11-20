import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Badge, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Clock } from 'react-bootstrap-icons';
import { enquiriesAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './EnquiryFollowUpView.css';

function EnquiryFollowUpView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [enquiry, setEnquiry] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showAddFollowUp, setShowAddFollowUp] = useState(false);
  const [newFollowUpText, setNewFollowUpText] = useState('');
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [statusChangeModal, setStatusChangeModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [enquiryRes, followUpsRes, historyRes] = await Promise.all([
        enquiriesAPI.get(id),
        enquiriesAPI.getFollowUps(id),
        enquiriesAPI.getStatusHistory(id)
      ]);

      if (enquiryRes.success && enquiryRes.data) {
        setEnquiry(enquiryRes.data);
        setNewStatus(enquiryRes.data.status || 'new');
      }

      if (followUpsRes.success && followUpsRes.data) {
        setFollowUps(Array.isArray(followUpsRes.data) ? followUpsRes.data : []);
      }

      if (historyRes.success && historyRes.data) {
        setStatusHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setNotification({
        message: err.message || 'Failed to load enquiry data',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFollowUp = async () => {
    if (!newFollowUpText.trim()) {
      setNotification({
        message: 'Please enter follow-up text',
        variant: 'warning'
      });
      return;
    }

    try {
      setSavingFollowUp(true);
      const result = await enquiriesAPI.addFollowUp(id, newFollowUpText);
      
      if (result.success) {
        setFollowUps(prev => [result.data, ...prev]);
        setNewFollowUpText('');
        setShowAddFollowUp(false);
        setNotification({
          message: 'Follow-up added successfully',
          variant: 'success'
        });
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to add follow-up',
        variant: 'danger'
      });
    } finally {
      setSavingFollowUp(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || newStatus === enquiry?.status) {
      setStatusChangeModal(false);
      return;
    }

    try {
      setSavingStatus(true);
      const result = await enquiriesAPI.update(id, { status: newStatus });
      
      if (result.success) {
        setEnquiry(prev => ({ ...prev, status: newStatus }));
        await loadData(); // Reload to get updated status history
        setStatusChangeModal(false);
        setNotification({
          message: 'Status updated successfully',
          variant: 'success'
        });
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to update status',
        variant: 'danger'
      });
    } finally {
      setSavingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'new':
        return 'primary';
      case 'contacted':
        return 'info';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatSourcePage = (sourcePage) => {
    if (!sourcePage) return '-';
    return sourcePage.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!enquiry) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <p>Enquiry not found</p>
          <Button onClick={() => navigate('/enquiries')} className="btn-cms-primary">
            <ArrowLeft className="me-2" size={18} />
            Back to Enquiries
          </Button>
        </div>
      </Container>
    );
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
        <Button
          variant="link"
          onClick={() => navigate('/enquiries')}
          className="p-0 text-decoration-none"
        >
          <ArrowLeft className="me-2" size={18} />
          Back to Enquiries
        </Button>
        <div className="d-flex gap-2">
          <Button
            variant="outline"
            className="btn-cms-outline"
            onClick={() => setStatusChangeModal(true)}
          >
            Change Status
          </Button>
          <Button
            className="btn-cms-primary"
            onClick={() => setShowAddFollowUp(true)}
          >
            <Plus className="me-2" size={18} />
            Add Follow-up
          </Button>
        </div>
      </div>

      {/* Enquiry Details */}
      <div className="card-cms mb-4">
        <div className="card-header">
          <h3 className="h5 mb-0">Enquiry Details</h3>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <strong>Name:</strong> {enquiry.name}
            </div>
            <div className="col-md-6">
              <strong>Email:</strong> {enquiry.business_email || enquiry.email}
            </div>
            <div className="col-md-6">
              <strong>Contact:</strong> {enquiry.contact_number || '-'}
            </div>
            <div className="col-md-6">
              <strong>City:</strong> {enquiry.city || '-'}
            </div>
            {enquiry.company_name && (
              <div className="col-md-6">
                <strong>Company:</strong> {enquiry.company_name}
              </div>
            )}
            <div className="col-md-6">
              <strong>Source Page:</strong> {formatSourcePage(enquiry.source_page)}
            </div>
            <div className="col-md-6">
              <strong>Status:</strong>{' '}
              <Badge bg={getStatusBadgeVariant(enquiry.status)}>
                {enquiry.status || 'new'}
              </Badge>
            </div>
            <div className="col-md-6">
              <strong>Created:</strong> {formatDate(enquiry.created_at)}
            </div>
            {enquiry.message && (
              <div className="col-12">
                <strong>Message:</strong>
                <p className="mt-2 mb-0">{enquiry.message}</p>
              </div>
            )}
            {enquiry.notes && (
              <div className="col-12">
                <strong>Notes:</strong>
                <p className="mt-2 mb-0">{enquiry.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status History */}
      {statusHistory.length > 0 && (
        <div className="card-cms mb-4">
          <div className="card-header">
            <h3 className="h5 mb-0">
              <Clock className="me-2" size={18} />
              Status History
            </h3>
          </div>
          <div className="card-body">
            <div className="status-history-list">
              {statusHistory.map((entry, idx) => (
                <div key={idx} className="status-history-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Badge bg={getStatusBadgeVariant(entry.old_status)} className="me-2">
                        {entry.old_status || 'N/A'}
                      </Badge>
                      <span className="mx-2">→</span>
                      <Badge bg={getStatusBadgeVariant(entry.new_status)}>
                        {entry.new_status}
                      </Badge>
                    </div>
                    <small className="text-muted">{formatDate(entry.changed_at)}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Follow-ups */}
      <div className="card-cms">
        <div className="card-header">
          <h3 className="h5 mb-0">Follow-ups</h3>
        </div>
        <div className="card-body">
          {followUps.length === 0 ? (
            <p className="text-muted">No follow-ups yet. Click "Add Follow-up" to add one.</p>
          ) : (
            <div className="follow-ups-text-view">
              {followUps.map((followUp) => (
                <div key={followUp.id} className="follow-up-item">
                  <div className="follow-up-header">
                    <small className="text-muted">{formatDate(followUp.created_at)}</small>
                  </div>
                  <div className="follow-up-content">
                    {followUp.follow_up_text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Follow-up Modal */}
      <Modal show={showAddFollowUp} onHide={() => setShowAddFollowUp(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Follow-up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Follow-up Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={newFollowUpText}
              onChange={(e) => setNewFollowUpText(e.target.value)}
              placeholder="Enter follow-up details..."
              className="form-control-cms"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddFollowUp(false);
              setNewFollowUpText('');
            }}
          >
            Cancel
          </Button>
          <Button
            className="btn-cms-primary"
            onClick={handleAddFollowUp}
            disabled={savingFollowUp || !newFollowUpText.trim()}
          >
            {savingFollowUp ? 'Saving...' : 'Add Follow-up'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Status Modal */}
      <Modal show={statusChangeModal} onHide={() => setStatusChangeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Status</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="form-control-cms"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setStatusChangeModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn-cms-primary"
            onClick={handleStatusChange}
            disabled={savingStatus || newStatus === enquiry.status}
          >
            {savingStatus ? 'Saving...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EnquiryFollowUpView;

