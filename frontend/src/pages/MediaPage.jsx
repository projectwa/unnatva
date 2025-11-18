import React from 'react';
import PageContent from '../components/pages/PageContent';

function MediaPage() {
  return (
    <PageContent
      apiEndpoint="/api/pages/media"
      title="Media - UNNATVA Foundation"
      description="Explore media coverage, press releases, and news about UNNATVA Foundation's initiatives, programs, and impact in communities across India."
      keywords="UNNATVA media, NGO news, press releases, media coverage, UNNATVA Foundation news"
    />
  );
}

export default MediaPage;

