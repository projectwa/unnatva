/**
 * Initiative content API service
 * Fetches initiative-specific content from CI4 backend using fetch API
 */

import api from './api';

/**
 * Get initiative content by name
 * @param {string} initiativeName - Name of the initiative (e.g., 'entrepreneurship-development')
 * @returns {Promise} - Initiative content data
 */
export const getInitiativeContent = async (initiativeName) => {
  try {
    const data = await api.get(`/initiatives/${initiativeName}`);
    return data;
  } catch (error) {
    console.error(`Error fetching initiative content for ${initiativeName}:`, error);
    throw error;
  }
};

// Convenience functions for each initiative
export const getEntrepreneurshipDevelopment = () => 
  getInitiativeContent('entrepreneurship-development');

export const getSkillDevelopment = () => 
  getInitiativeContent('skill-development');

export const getEducation = () => 
  getInitiativeContent('education');

export const getWomenEmpowerment = () => 
  getInitiativeContent('women-empowerment');

