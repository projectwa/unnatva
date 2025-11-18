import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PagesList from '../pages/PagesList';
import PagesEdit from '../pages/PagesEdit';
import CarouselList from '../pages/CarouselList';
import CarouselEdit from '../pages/CarouselEdit';
import ImpactStatsList from '../pages/ImpactStatsList';
import ImpactStatsEdit from '../pages/ImpactStatsEdit';
import SuccessStoriesList from '../pages/SuccessStoriesList';
import SuccessStoriesEdit from '../pages/SuccessStoriesEdit';
import MediaList from '../pages/MediaList';
import MediaEdit from '../pages/MediaEdit';
import Settings from '../pages/Settings';
import ContentBlocksList from '../pages/ContentBlocksList';
import ContentBlocksEdit from '../pages/ContentBlocksEdit';
import JobsList from '../pages/JobsList';
import JobsEdit from '../pages/JobsEdit';
import JobApplicationsList from '../pages/JobApplicationsList';
import AdminLayout from '../components/layout/AdminLayout';
import { authAPI } from '../services/api';

function Router() {
  console.log('Router function called');
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log('Router: useState hooks called, current path:', location.pathname);

  // Function to check authentication
  const checkAuth = React.useCallback(async () => {
    console.log('Router: Starting auth check...');
    
    try {
      const result = await authAPI.check();
      console.log('Router: Auth check result:', result);
      // auth/check now returns data even on 401, so check the authenticated property
      const authenticated = result?.authenticated === true;
      console.log('Router: Setting authenticated to:', authenticated);
      setIsAuthenticated(authenticated);
      setLoading(false);
    } catch (err) {
      // If auth check fails, just assume not authenticated
      console.log('Router: Auth check error:', err.message);
      if (err.message !== 'Unauthorized' && !err.message.includes('404')) {
        console.error('Router: Auth check error:', err);
      }
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    console.log('Router: useEffect running - checking auth on mount');
    checkAuth();
  }, [checkAuth]);

  // Re-check auth when location changes (e.g., after login)
  useEffect(() => {
    console.log('Router: Location changed to:', location.pathname);
    
    // If navigating to login and no token, ensure we're marked as not authenticated
    if (location.pathname === '/login' || location.pathname.includes('/login')) {
      const token = localStorage.getItem('auth_token');
      if (!token && isAuthenticated) {
        console.log('Router: On login page with no token, clearing auth state...');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
    }
    
    // If we're not authenticated but there's a token, re-check
    if (!isAuthenticated && !loading) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        console.log('Router: Token found but not authenticated, re-checking...');
        checkAuth();
      }
    }
  }, [location.pathname, isAuthenticated, loading, checkAuth]);

  // Listen for custom login/logout events
  useEffect(() => {
    const handleLogin = () => {
      console.log('Router: Login event received, re-checking auth...');
      checkAuth();
    };
    
    const handleLogout = () => {
      console.log('Router: Logout event received, clearing auth state...');
      // Immediately set authenticated to false when logout event fires
      setIsAuthenticated(false);
      setLoading(false);
    };
    
    window.addEventListener('auth-login', handleLogin);
    window.addEventListener('auth-logout', handleLogout);
    return () => {
      window.removeEventListener('auth-login', handleLogin);
      window.removeEventListener('auth-logout', handleLogout);
    };
  }, [checkAuth]);

  console.log('Router render - loading:', loading, 'isAuthenticated:', isAuthenticated);
  
  if (loading) {
    console.log('Router: Returning loading state');
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('Router: Not authenticated, returning login routes');
    // Simply return Login component directly - no Routes needed
    return <Login />;
  }
  
  console.log('Router: Authenticated, returning admin routes');

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/" element={<AdminLayout><Navigate to="/dashboard" replace /></AdminLayout>} />
      <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/pages" element={<AdminLayout><PagesList /></AdminLayout>} />
      <Route path="/pages/new" element={<AdminLayout><PagesEdit /></AdminLayout>} />
      <Route path="/pages/:id" element={<AdminLayout><PagesEdit /></AdminLayout>} />
      <Route path="/carousel" element={<AdminLayout><CarouselList /></AdminLayout>} />
      <Route path="/carousel/new" element={<AdminLayout><CarouselEdit /></AdminLayout>} />
      <Route path="/carousel/:id" element={<AdminLayout><CarouselEdit /></AdminLayout>} />
      <Route path="/stats" element={<AdminLayout><ImpactStatsList /></AdminLayout>} />
      <Route path="/stats/new" element={<AdminLayout><ImpactStatsEdit /></AdminLayout>} />
      <Route path="/stats/:id" element={<AdminLayout><ImpactStatsEdit /></AdminLayout>} />
      <Route path="/stories" element={<AdminLayout><SuccessStoriesList /></AdminLayout>} />
      <Route path="/stories/new" element={<AdminLayout><SuccessStoriesEdit /></AdminLayout>} />
      <Route path="/stories/:id" element={<AdminLayout><SuccessStoriesEdit /></AdminLayout>} />
      <Route path="/media" element={<AdminLayout><MediaList /></AdminLayout>} />
      <Route path="/media/new" element={<AdminLayout><MediaEdit /></AdminLayout>} />
      <Route path="/media/:id" element={<AdminLayout><MediaEdit /></AdminLayout>} />
      <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
      <Route path="/content-blocks" element={<AdminLayout><ContentBlocksList /></AdminLayout>} />
      <Route path="/content-blocks/new" element={<AdminLayout><ContentBlocksEdit /></AdminLayout>} />
      <Route path="/content-blocks/:id" element={<AdminLayout><ContentBlocksEdit /></AdminLayout>} />
      <Route path="/jobs" element={<AdminLayout><JobsList /></AdminLayout>} />
      <Route path="/jobs/new" element={<AdminLayout><JobsEdit /></AdminLayout>} />
      <Route path="/jobs/:id" element={<AdminLayout><JobsEdit /></AdminLayout>} />
      <Route path="/job-applications" element={<AdminLayout><JobApplicationsList /></AdminLayout>} />
    </Routes>
  );
}

export default Router;

