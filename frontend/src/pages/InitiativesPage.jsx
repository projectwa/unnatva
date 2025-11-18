import React from 'react';
import { useLocation } from 'react-router-dom';
import PageContent from '../components/pages/PageContent';

function InitiativesPage() {
  const location = useLocation();
  const path = location.pathname;
  
  // Map path to API endpoint
  const pathToEndpoint = {
    '/entrepreneurship-development': '/api/pages/initiatives/entrepreneurship-development',
    '/skill-development': '/api/pages/initiatives/skill-development',
    '/education': '/api/pages/initiatives/education',
    '/women-empowerment': '/api/pages/initiatives/women-empowerment'
  };
  
  const initiativeMeta = {
    '/entrepreneurship-development': {
      title: 'Entrepreneurship Development - UNNATVA Foundation',
      description: 'Learn about UNNATVA Foundation\'s entrepreneurship development programs that empower individuals to start and grow their own businesses.',
      keywords: 'entrepreneurship development, business training, startup support, UNNATVA entrepreneurship'
    },
    '/skill-development': {
      title: 'Skill Development Programs - UNNATVA Foundation',
      description: 'Discover UNNATVA Foundation\'s skill development programs that provide job-ready skills and training to youth and communities across India.',
      keywords: 'skill development, vocational training, job skills, UNNATVA skill programs'
    },
    '/education': {
      title: 'Education Initiatives - UNNATVA Foundation',
      description: 'Explore UNNATVA Foundation\'s education programs that provide equal opportunities and skills for students across India.',
      keywords: 'education programs, student support, educational initiatives, UNNATVA education'
    },
    '/women-empowerment': {
      title: 'Women Empowerment Programs - UNNATVA Foundation',
      description: 'Learn about UNNATVA Foundation\'s women empowerment initiatives that support women in achieving independence and success.',
      keywords: 'women empowerment, women training, gender equality, UNNATVA women programs'
    }
  };
  
  const meta = initiativeMeta[path] || {
    title: 'Our Initiatives - UNNATVA Foundation',
    description: 'Explore UNNATVA Foundation\'s initiatives in entrepreneurship, skill development, education, and women empowerment.',
    keywords: 'UNNATVA initiatives, NGO programs, community development'
  };
  
  const endpoint = pathToEndpoint[path] || '/api/pages/initiatives/entrepreneurship-development';

  return (
    <PageContent
      apiEndpoint={endpoint}
      title={meta.title}
      description={meta.description}
      keywords={meta.keywords}
    />
  );
}

export default InitiativesPage;

