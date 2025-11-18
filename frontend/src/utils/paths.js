/**
 * Path utility functions for React
 * Replaces CI4's site_helper functions
 */

// Base URL - in production this will be from CI4, in dev it's empty
// In development, Vite serves from root, so we use absolute paths
const BASE_URL = import.meta.env.VITE_BASE_URL || '';
const isDev = import.meta.env.DEV;

export const imgPath = (file = '') => {
  if (!file) return `${BASE_URL}/img/`;
  // In development, use absolute path from root
  // In production, use base URL from CI4
  const path = file.replace(/^\//, '');
  return isDev ? `/img/${path}` : `${BASE_URL}/img/${path}`;
};

export const cssPath = (file = '') => {
  if (!file) return `${BASE_URL}/assets/css/`;
  return `${BASE_URL}/assets/css/${file.replace(/^\//, '')}`;
};

export const jsPath = (file = '') => {
  if (!file) return `${BASE_URL}/js/`;
  return `${BASE_URL}/js/${file.replace(/^\//, '')}`;
};

export const libPath = (file = '') => {
  if (!file) return `${BASE_URL}/lib/`;
  return `${BASE_URL}/lib/${file.replace(/^\//, '')}`;
};

export const baseUrl = (path = '') => {
  if (!path) return BASE_URL;
  return `${BASE_URL}/${path.replace(/^\//, '')}`;
};

