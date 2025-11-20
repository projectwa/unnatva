import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Badge, Table, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash, ChevronDown, ChevronRight, Person, GeoAlt, Book, Quote, FileText, Briefcase, CurrencyDollar, People, Calendar } from 'react-bootstrap-icons';
import { successStoriesAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import ActionMenu from '../components/common/ActionMenu';
import './SuccessStoriesList.css';

function SuccessStoriesList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
    setCurrentPage(1); // Reset to first page when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      
      const result = await successStoriesAPI.list(params);
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
    e?.stopPropagation();
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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

  // Get unique categories from stories
  const categories = [...new Set(stories.map(s => s.category).filter(Boolean))].sort();

  // Calculate pagination
  const totalPages = Math.ceil(stories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = stories.slice(startIndex, endIndex);

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

  const getImageUrl = (imageFilename) => {
    if (!imageFilename) return null;
    if (imageFilename.startsWith('http://') || imageFilename.startsWith('https://')) {
      return imageFilename;
    }
    let pathname = window.location.pathname;
    if (pathname.includes('/index.php/cms7x9k2m4p8q1w5')) {
      pathname = pathname.split('/index.php/cms7x9k2m4p8q1w5')[0];
    } else if (pathname.includes('/cms7x9k2m4p8q1w5')) {
      pathname = pathname.split('/cms7x9k2m4p8q1w5')[0];
    }
    const basePath = pathname || '';
    return `${basePath}/img/${imageFilename}`;
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

      {/* Filters */}
      <div className="card-cms filter-section mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="form-control-cms"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-9">
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name, course, or place..."
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
        <div className="stories-table-wrapper">
          <Table responsive className="table-cms stories-compact-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th style={{ minWidth: '200px' }}>Name</th>
                <th style={{ minWidth: '150px' }}>Place</th>
                <th style={{ minWidth: '150px' }}>Course</th>
                <th style={{ width: '140px' }}>Category</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No success stories found
                  </td>
                </tr>
              ) : (
                currentData.map((story) => {
                  const isExpanded = expandedRows.has(story.id);
                  return (
                    <React.Fragment key={story.id}>
                      <tr className="story-main-row">
                        <td>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 expand-btn"
                            onClick={() => toggleRowExpansion(story.id)}
                          >
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </Button>
                        </td>
                        <td>
                          <div className="fw-semibold">
                            <Person size={14} className="me-2 text-muted" />
                            {story.name || '-'}
                          </div>
                        </td>
                        <td>
                          <div>
                            <GeoAlt size={14} className="me-2 text-muted" />
                            {story.place || '-'}
                          </div>
                        </td>
                        <td>
                          <div>
                            <Book size={14} className="me-2 text-muted" />
                            {story.course || '-'}
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary">{story.category || '-'}</Badge>
                        </td>
                        <td>
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
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="story-details-row">
                          <td colSpan={6}>
                            <div className="story-details-content">
                              <div className="row g-3">
                                {story.image && (
                                  <div className="col-12 col-md-3">
                                    <div className="detail-item">
                                      <div className="w-100">
                                        <div className="detail-label">Image</div>
                                        <div className="detail-value">
                                          <img 
                                            src={getImageUrl(story.image)} 
                                            alt={story.name}
                                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className={story.image ? "col-12 col-md-9" : "col-12"}>
                                  <div className="row g-3">
                                    <div className="col-12">
                                      <div className="detail-item">
                                        <Quote size={16} className="detail-icon" />
                                        <div className="flex-grow-1">
                                          <div className="detail-label">Quote</div>
                                          <div className="detail-value">{story.quote || '-'}</div>
                                        </div>
                                      </div>
                                    </div>
                                    {story.story && (
                                      <div className="col-12">
                                        <div className="detail-item">
                                          <FileText size={16} className="detail-icon" />
                                          <div className="flex-grow-1">
                                            <div className="detail-label">Story</div>
                                            <div className="detail-value story-text">{story.story}</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="col-12">
                                      <div className="row g-3">
                                        {story.profession && (
                                          <div className="col-md-6">
                                            <div className="detail-item">
                                              <Briefcase size={16} className="detail-icon" />
                                              <div className="flex-grow-1">
                                                <div className="detail-label">Profession</div>
                                                <div className="detail-value">{story.profession}</div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {story.turnover && (
                                          <div className="col-md-6">
                                            <div className="detail-item">
                                              <CurrencyDollar size={16} className="detail-icon" />
                                              <div className="flex-grow-1">
                                                <div className="detail-label">Turnover</div>
                                                <div className="detail-value">{story.turnover}</div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {story.employment_generated && (
                                          <div className="col-md-6">
                                            <div className="detail-item">
                                              <People size={16} className="detail-icon" />
                                              <div className="flex-grow-1">
                                                <div className="detail-label">Employment Generated</div>
                                                <div className="detail-value">{story.employment_generated}</div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        <div className="col-md-6">
                                          <div className="detail-item">
                                            <Calendar size={16} className="detail-icon" />
                                            <div className="flex-grow-1">
                                              <div className="detail-label">Created</div>
                                              <div className="detail-value">
                                                {(() => {
                                                  const dateTime = formatDate(story.created_at);
                                                  return `${dateTime.date} ${dateTime.time ? 'at ' + dateTime.time : ''}`;
                                                })()}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="detail-item">
                                        <div className="flex-grow-1">
                                          <Badge bg={story.is_published ? 'success' : 'secondary'} className="me-2">
                                            {story.is_published ? 'Published' : 'Draft'}
                                          </Badge>
                                          {story.is_featured && (
                                            <Badge bg="warning" text="dark">Featured</Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
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
                Showing {startIndex + 1} to {Math.min(endIndex, stories.length)} of {stories.length} records
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
    </Container>
  );
}

export default SuccessStoriesList;
