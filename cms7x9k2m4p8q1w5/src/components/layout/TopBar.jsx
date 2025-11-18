import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BoxArrowRight, PersonCircle } from 'react-bootstrap-icons';
import { authAPI } from '../../services/api';
import './TopBar.css';

function TopBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear token immediately
    localStorage.removeItem('auth_token');
    
    // Dispatch event to notify Router that auth state changed
    window.dispatchEvent(new Event('auth-logout'));
    
    // Try to call logout API in background (don't wait for it)
    // This is best-effort - if it fails, we've already logged out locally
    authAPI.logout().catch(() => {
      // Silently ignore any errors - we've already logged out locally
    });
    
    // Use window.location for logout to ensure full reset
    // Extract base path from current location (handles both /cms7x9k2m4p8q1w5 and /index.php/cms7x9k2m4p8q1w5)
    const currentPath = window.location.pathname;
    let basePath = '/cms7x9k2m4p8q1w5';
    
    if (currentPath.includes('/index.php/cms7x9k2m4p8q1w5')) {
      basePath = '/index.php/cms7x9k2m4p8q1w5';
    } else if (currentPath.includes('/cms7x9k2m4p8q1w5')) {
      basePath = '/cms7x9k2m4p8q1w5';
    }
    
    window.location.href = `${basePath}/login`;
  };

  return (
    <Navbar className="topbar-cms" expand="lg">
      <Container fluid>
        <Navbar.Brand className="topbar-brand">
          <PersonCircle className="cms-icon-primary me-2" size={24} />
          <span>Admin Panel</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="topbar-nav" />
        <Navbar.Collapse id="topbar-nav" className="justify-content-end">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="btn-cms-outline"
          >
            <BoxArrowRight className="me-2" size={18} />
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopBar;
