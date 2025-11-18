import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  Speedometer2, FileText, Images, BarChart, 
  JournalText, Newspaper, Briefcase, 
  Folder, Gear 
} from 'react-bootstrap-icons';
import logoUrl from '../../img/logo.svg?url';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Speedometer2 },
    { path: '/pages', label: 'Pages', icon: FileText },
    { path: '/carousel', label: 'Carousel', icon: Images },
    { path: '/stats', label: 'Impact Stats', icon: BarChart },
    { path: '/stories', label: 'Success Stories', icon: JournalText },
    { path: '/content-blocks', label: "What's Happening", icon: Newspaper },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/media', label: 'Media', icon: Folder },
    { path: '/settings', label: 'Settings', icon: Gear },
  ];

  return (
    <aside className="sidebar-cms">
      <div className="sidebar-header-cms">
        <img 
          src={logoUrl} 
          alt="UNNATVA Logo" 
          className="sidebar-logo"
          style={{ maxWidth: '180px', height: 'auto', marginBottom: '8px' }}
        />
        <h2 className="h5 mb-0" style={{ fontSize: '14px', fontWeight: '600' }}>CMS</h2>
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
            >
              <Icon className="cms-icon-primary me-2" size={18} />
              <span>{item.label}</span>
            </Nav.Link>
          );
        })}
      </Nav>
    </aside>
  );
}

export default Sidebar;
