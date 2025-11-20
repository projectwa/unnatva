import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FileText, Images, BarChart, JournalText, 
  Folder, PersonCheck, Envelope
} from 'react-bootstrap-icons';
import { dashboardAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      // Check if we still have a token before making the request
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // No token means we're logged out, don't show error
        setLoading(false);
        return;
      }
      
      try {
        const result = await dashboardAPI.getStats();
        setStats(result.stats);
      } catch (err) {
        // Don't show "Unauthorized" errors - user might be logging out
        if (err.message === 'Unauthorized') {
          setLoading(false);
          return;
        }
        setError(err.message || 'Failed to load dashboard stats');
        setNotification({
          message: err.message || 'Failed to load dashboard stats',
          variant: 'danger'
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="cms-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  const statCards = [
    {
      title: 'Pages',
      value: stats?.pages?.total || 0,
      label: `${stats?.pages?.published || 0} published`,
      icon: FileText,
      color: 'primary'
    },
    {
      title: 'Carousel Slides',
      value: stats?.carousel_slides?.total || 0,
      label: `${stats?.carousel_slides?.active || 0} active`,
      icon: Images,
      color: 'primary-light'
    },
    {
      title: 'Impact Stats',
      value: stats?.impact_stats?.total || 0,
      label: `${stats?.impact_stats?.active || 0} active`,
      icon: BarChart,
      color: 'primary-lighter'
    },
    {
      title: 'Success Stories',
      value: stats?.success_stories?.total || 0,
      label: `${stats?.success_stories?.published || 0} published`,
      icon: JournalText,
      color: 'primary'
    },
    {
      title: 'Media Items',
      value: stats?.media_items?.total || 0,
      label: 'Total files',
      icon: Folder,
      color: 'primary-light'
    },
    {
      title: 'New Applicants',
      value: stats?.job_applications?.new_last_7_days || 0,
      label: 'Received in last 7 days',
      icon: PersonCheck,
      color: 'primary'
    },
    {
      title: 'New Enquiries',
      value: stats?.enquiries?.new_last_7_days || 0,
      label: 'Received in last 7 days',
      icon: Envelope,
      color: 'primary-light'
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

      <div className="dashboard-header mb-4">
        <h1 className="h3 mb-2">Dashboard</h1>
        <p className="text-muted small">Welcome to UNNATVA CMS</p>
      </div>

      <Row className="g-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Col key={index} xs={12} sm={6} lg={4} xl={3}>
              <Card className="card-cms h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="text-muted small text-uppercase mb-1">
                        {card.title}
                      </h6>
                      <h2 className="h4 mb-0">{card.value}</h2>
                      <p className="text-muted small mb-0 mt-1">{card.label}</p>
                    </div>
                    <Icon 
                      className={`cms-icon-${card.color}`}
                      size={32}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default Dashboard;
