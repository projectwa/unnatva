import React from 'react';
import PageContent from '../components/pages/PageContent';

function PrivacyPolicyPage() {
  return (
    <PageContent
      apiEndpoint="/api/pages/privacy-policy"
      title="Privacy Policy - UNNATVA Foundation"
      description="Read UNNATVA Foundation's privacy policy to understand how we collect, use, and protect your personal information."
      keywords="privacy policy, UNNATVA privacy, data protection, personal information"
    />
  );
}

export default PrivacyPolicyPage;

