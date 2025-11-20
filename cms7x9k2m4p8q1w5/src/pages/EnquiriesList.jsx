import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Badge, Modal, Table, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FileExcel, Trash, ChatDots, Pencil, ChevronDown, ChevronRight, Building, Envelope, Phone, Newspaper, Calendar } from 'react-bootstrap-icons';
import { enquiriesAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './EnquiriesList.css';

function EnquiriesList() {
  const navigate = useNavigate();
  
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    source_page: '',
    search: ''
  });
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadEnquiries();
    setCurrentPage(1); // Reset to first page when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setNotification(null);
      
      const result = await enquiriesAPI.list(filters);
      
      if (result && result.data) {
        setEnquiries(Array.isArray(result.data) ? result.data : []);
      } else if (Array.isArray(result)) {
        setEnquiries(result);
      } else {
        setEnquiries([]);
      }
    } catch (err) {
      console.error('Error loading enquiries:', err);
      setNotification({
        message: err.message || 'Failed to load enquiries',
        variant: 'danger'
      });
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/cms7x9k2m4p8q1w5/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete enquiry');
      }

      setNotification({
        message: 'Enquiry deleted successfully',
        variant: 'success'
      });
      loadEnquiries();
    } catch (err) {
      setNotification({
        message: 'Failed to delete enquiry: ' + (err.message || 'Unknown error'),
        variant: 'danger'
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      // Use enquiriesAPI if available, otherwise use direct fetch
      if (window.enquiriesAPI && window.enquiriesAPI.exportExcel) {
        await window.enquiriesAPI.exportExcel(filters);
        setNotification({
          message: 'Enquiries exported successfully',
          variant: 'success'
        });
        return;
      }

      // Fallback to direct fetch
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.source_page) params.append('source_page', filters.source_page);
      
      const queryString = params.toString();
      const pathname = window.location.pathname;
      let API_BASE = '/cms7x9k2m4p8q1w5/api';
      if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
        API_BASE = '/index.php/cms7x9k2m4p8q1w5/api';
      }
      
      const url = queryString
        ? `${API_BASE}/enquiries/export/excel?${queryString}`
        : `${API_BASE}/enquiries/export/excel`;
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export enquiries');
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `enquiries_${new Date().toISOString().split('T')[0]}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/^["']|["']$/g, '').trim(); // Remove surrounding quotes and trim
        }
      }

      // Convert response to blob and trigger download
      const blob = await response.blob();
      const url_blob = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_blob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url_blob);
      document.body.removeChild(a);

      setNotification({
        message: 'Enquiries exported successfully',
        variant: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Failed to export: ' + (err.message || 'Unknown error'),
        variant: 'danger'
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (enquiryId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return;

    try {
      const result = await enquiriesAPI.update(enquiryId, { status: newStatus });
      if (result.success) {
        setEnquiries(prev => prev.map(e => 
          e.id === enquiryId ? { ...e, status: newStatus } : e
        ));
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
    }
  };

  const handleEditNotes = (enquiry) => {
    setEditingNotes(enquiry.id);
    setNotesText(enquiry.notes || '');
  };

  const handleSaveNotes = async () => {
    if (editingNotes === null) return;

    try {
      setSavingNotes(true);
      const result = await enquiriesAPI.update(editingNotes, { notes: notesText });
      if (result.success) {
        setEnquiries(prev => prev.map(e => 
          e.id === editingNotes ? { ...e, notes: notesText } : e
        ));
        setEditingNotes(null);
        setNotesText('');
        setNotification({
          message: 'Notes updated successfully',
          variant: 'success'
        });
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to update notes',
        variant: 'danger'
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return { date: '-', time: '' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
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

  const formatAreasOfInterest = (areasJson) => {
    if (!areasJson) return '-';
    try {
      const areas = typeof areasJson === 'string' ? JSON.parse(areasJson) : areasJson;
      if (Array.isArray(areas) && areas.length > 0) {
        return areas.map(a => a.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ');
      }
    } catch (e) {
      // If not JSON, return as is
      return areasJson;
    }
    return '-';
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(enquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = enquiries.slice(startIndex, endIndex);

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
          <h1 className="h3 mb-2">Enquiries</h1>
          <p className="text-muted small">Manage all enquiries submitted through the website</p>
        </div>
        <Button
          variant="outline"
          className="btn-cms-outline"
          onClick={handleExportExcel}
        >
          <FileExcel className="me-2" size={18} />
          Export Excel
        </Button>
      </div>

      {/* Filters */}
      <div className="card-cms filter-section mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="form-control-cms"
                >
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Source Page</Form.Label>
                <Form.Select
                  name="source_page"
                  value={filters.source_page}
                  onChange={handleFilterChange}
                  className="form-control-cms"
                >
                  <option value="">All Pages</option>
                  <option value="home">Home</option>
                  <option value="impact">Impact</option>
                  <option value="entrepreneurship-development">Entrepreneurship Development</option>
                  <option value="skill-development">Skill Development</option>
                  <option value="education">Education</option>
                  <option value="women-empowerment">Women Empowerment</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name, email, contact, city, or message..."
                  className="form-control-cms"
                />
              </Form.Group>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Table with Expandable Rows */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="enquiries-table-wrapper">
          <Table responsive className="table-cms enquiries-compact-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th style={{ width: '140px', whiteSpace: 'nowrap' }}>Date</th>
                <th style={{ minWidth: '150px' }}>Name</th>
                <th style={{ minWidth: '200px' }}>Email</th>
                <th style={{ width: '140px' }}>Status</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                currentData.map((enquiry) => {
                  const isExpanded = expandedRows.has(enquiry.id);
                  return (
                    <React.Fragment key={enquiry.id}>
                      <tr className="enquiry-main-row">
                        <td>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 expand-btn"
                            onClick={() => toggleRowExpansion(enquiry.id)}
                          >
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </Button>
                        </td>
                        <td>
                          <div>
                            {(() => {
                              const dateTime = formatDate(enquiry.created_at);
                              return (
                                <>
                                  <div className="d-flex align-items-center" style={{ whiteSpace: 'nowrap' }}>
                                    <Calendar size={14} className="me-2 text-muted flex-shrink-0" />
                                    <span className="small">{dateTime.date}</span>
                                  </div>
                                  {dateTime.time && (
                                    <div className="text-muted small ms-4 mt-1">
                                      {dateTime.time}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold">{enquiry.name}</div>
                          {enquiry.company_name && (
                            <div className="text-muted small">
                              <Building size={12} className="me-1" />
                              {enquiry.company_name}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Envelope size={14} className="me-2 text-muted" />
                            <span className="text-truncate" style={{ maxWidth: '180px' }} title={enquiry.business_email || enquiry.email}>
                              {enquiry.business_email || enquiry.email || '-'}
                            </span>
                          </div>
                          {enquiry.contact_number && (
                            <div className="text-muted small mt-1">
                              <Phone size={12} className="me-1" />
                              {enquiry.contact_number}
                            </div>
                          )}
                        </td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={enquiry.status || 'new'}
                            onChange={(e) => handleStatusChange(enquiry.id, e.target.value, enquiry.status)}
                            className="status-select"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </Form.Select>
                        </td>
                        <td>
                          <ActionMenu
                            actions={[
                              {
                                label: 'Follow-up',
                                icon: ChatDots,
                                onClick: (e) => {
                                  e?.stopPropagation();
                                  navigate(`/enquiries/${enquiry.id}/follow-up`);
                                },
                                primary: true,
                                variant: 'primary'
                              },
                              {
                                label: 'Delete',
                                icon: Trash,
                                onClick: (e) => {
                                  e?.stopPropagation();
                                  handleDelete(enquiry.id, e);
                                },
                                primary: false,
                                variant: 'danger'
                              }
                            ]}
                            maxVisible={2}
                          />
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="enquiry-details-row">
                          <td colSpan={6}>
                            <div className="enquiry-details-content">
                              <div className="row g-3">
                                <div className="col-12">
                                  <div className="detail-item">
                                    <Newspaper size={16} className="detail-icon" />
                                    <div className="flex-grow-1">
                                      <div className="detail-label">Source Page</div>
                                      <div className="detail-value">{formatSourcePage(enquiry.source_page)}</div>
                                    </div>
                                    {enquiry.areas_of_interest && (
                                      <>
                                        <div className="mx-3" style={{ borderLeft: '1px solid var(--cms-gray-300)', height: '30px' }}></div>
                                        <div className="flex-grow-1">
                                          <div className="detail-label">Areas of Interest</div>
                                          <div className="detail-value">{formatAreasOfInterest(enquiry.areas_of_interest)}</div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="detail-item">
                                    <Pencil size={16} className="detail-icon" />
                                    <div className="flex-grow-1">
                                      <div className="detail-label">Notes</div>
                                      <div className="detail-value">
                                        {enquiry.notes ? (
                                          <div className="d-flex align-items-start gap-2">
                                            <span className="flex-grow-1" title={enquiry.notes}>
                                              {enquiry.notes}
                                            </span>
                                            <Button
                                              variant="link"
                                              size="sm"
                                              className="p-0"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditNotes(enquiry);
                                              }}
                                              title="Edit notes"
                                            >
                                              <Pencil size={14} />
                                            </Button>
                                          </div>
                                        ) : (
                                          <span className="text-muted">No notes</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {enquiry.message && (
                                  <div className="col-12">
                                    <div className="detail-item">
                                      <div className="w-100">
                                        <div className="detail-label">Message</div>
                                        <div className="detail-value message-text">{enquiry.message}</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">
                Showing {startIndex + 1} to {Math.min(endIndex, enquiries.length)} of {enquiries.length} records
              </div>
              <Pagination className="mb-0">
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </div>
      )}

      {/* Notes Edit Modal */}
      <Modal show={editingNotes !== null} onHide={() => {
        setEditingNotes(null);
        setNotesText('');
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Enter notes..."
              className="form-control-cms"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setEditingNotes(null);
              setNotesText('');
            }}
          >
            Cancel
          </Button>
          <Button
            className="btn-cms-primary"
            onClick={handleSaveNotes}
            disabled={savingNotes}
          >
            {savingNotes ? 'Saving...' : 'Save Notes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EnquiriesList;

