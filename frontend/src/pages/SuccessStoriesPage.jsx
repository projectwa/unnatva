import React from 'react';
import PageContent from '../components/pages/PageContent';

function SuccessStoriesPage() {
  return (
    <PageContent
      apiEndpoint="/api/pages/success-stories"
      title="Success Stories - UNNATVA Foundation"
      description="Read inspiring success stories from UNNATVA Foundation's beneficiaries. Real stories of transformation, empowerment, and positive change in communities across India."
      keywords="success stories, NGO success stories, transformation stories, empowerment stories, UNNATVA beneficiaries"
    />
  );
}

export default SuccessStoriesPage;

