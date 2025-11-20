import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  Speedometer2, FileText, Images, BarChart, 
  JournalText, Newspaper, Briefcase, 
  Folder, Gear, Envelope, ChevronLeft, ChevronRight, BoxArrowRight
} from 'react-bootstrap-icons';
import { authAPI } from '../../services/api';
import logoUrl from '../../img/logo.svg?url';
import './Sidebar.css';

function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Speedometer2 },
    { path: '/pages', label: 'Pages', icon: FileText },
    { path: '/carousel', label: 'Carousel', icon: Images },
    { path: '/stats', label: 'Impact Stats', icon: BarChart },
    { path: '/stories', label: 'Success Stories', icon: JournalText },
    { path: '/content-blocks', label: "What's Happening", icon: Newspaper },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/job-applications', label: 'Job Applications', icon: Briefcase },
    { path: '/enquiries', label: 'Enquiries', icon: Envelope },
    { path: '/media', label: 'Media', icon: Folder },
    { path: '/settings', label: 'Settings', icon: Gear },
  ];

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
    <aside className={`sidebar-cms ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header-cms">
        {!collapsed && (
          <>
            <img 
              src={logoUrl} 
              alt="UNNATVA Logo" 
              className="sidebar-logo"
              style={{ maxWidth: '180px', height: 'auto', marginBottom: '8px' }}
            />
            <h2 className="h5 mb-0" style={{ fontSize: '14px', fontWeight: '600' }}>CMS</h2>
          </>
        )}
        <Button
          variant="link"
          className="sidebar-toggle-btn"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </Button>
      </div>
      <Nav className="flex-column sidebar-nav-cms">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <Icon className="cms-icon-primary" size={18} style={{ marginRight: collapsed ? 0 : '8px' }} />
              {!collapsed && <span>{item.label}</span>}
            </Nav.Link>
          );
        })}
      </Nav>
      <div className="sidebar-footer-cms">
        <Button
          variant="link"
          onClick={handleLogout}
          className="sidebar-logout-btn"
          title={collapsed ? 'Logout' : ''}
        >
          <BoxArrowRight className="cms-icon-primary" size={18} style={{ marginRight: collapsed ? 0 : '8px' }} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
