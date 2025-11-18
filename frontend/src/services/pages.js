/**
 * Page content API service
 * Fetches page content from CI4 backend using fetch API
 */

import api from './api';

/**
 * Get page content by name
 * @param {string} pageName - Name of the page (e.g., 'home', 'about')
 * @returns {Promise} - Page content data
 */
export const getPageContent = async (pageName) => {
  try {
    const data = await api.get(`/pages/${pageName}`);
    return data;
  } catch (error) {
    console.error(`Error fetching page content for ${pageName}:`, error);
    throw error;
  }
};

// Convenience functions for each page
export const getHomePage = () => getPageContent('home');
export const getAboutPage = () => getPageContent('about');
export const getImpactPage = () => getPageContent('impact');
export const getContactPage = () => getPageContent('contact');
export const getSuccessStoriesPage = () => getPageContent('success-stories');
export const getMediaPage = () => getPageContent('media');
export const getPrivacyPolicyPage = () => getPageContent('privacy-policy');

