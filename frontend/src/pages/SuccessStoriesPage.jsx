import React, { useEffect } from 'react';
import SEO from '../components/seo/SEO';
import SuccessStoriesDisplay from '../components/success-stories/SuccessStoriesDisplay';

function SuccessStoriesPage() {
  useEffect(() => {
    // Set body class for styling
    document.body.classList.remove('act_home', 'act_about', 'act_contact', 'act_impact', 'act_ourInitiatives', 'act_media');
    document.body.classList.add('act_successStory');
    
    return () => {
      // Cleanup on unmount
      document.body.classList.remove('act_successStory');
    };
  }, []);

  return (
    <>
      <SEO
        title="Success Stories - UNNATVA Foundation"
        description="Read inspiring success stories from UNNATVA Foundation's beneficiaries. Real stories of transformation, empowerment, and positive change in communities across India."
        keywords="success stories, NGO success stories, transformation stories, empowerment stories, UNNATVA beneficiaries"
      />
      <div className="page-content" data-page="success-stories">
        <SuccessStoriesDisplay />
      </div>
    </>
  );
}

export default SuccessStoriesPage;

