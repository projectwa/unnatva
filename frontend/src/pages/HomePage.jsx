import React from 'react';
import PageContent from '../components/pages/PageContent';

function HomePage() {
  return (
    <PageContent
      apiEndpoint="/api/pages/home"
      title="UNNATVA Foundation - Empowering Communities Through Skill Development"
      description="UNNATVA Foundation empowers underserved communities across India through sustainable livelihood initiatives, entrepreneurship development, and skill training programs. Join us in creating lasting change."
      keywords="NGO India, skill development, entrepreneurship training, women empowerment, education, UNNATVA Foundation, community development, livelihood programs"
    />
  );
}

export default HomePage;
