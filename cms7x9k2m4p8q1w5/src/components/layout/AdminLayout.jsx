import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './AdminLayout.css';

function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="admin-layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className={`admin-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;



