import React from 'react';
import PageContent from '../components/pages/PageContent';

function ContactPage() {
  return (
    <PageContent
      apiEndpoint="/api/pages/contact"
      title="Contact Us - UNNATVA Foundation"
      description="Get in touch with UNNATVA Foundation. Contact us for partnerships, collaborations, or to learn more about our initiatives in skill development, entrepreneurship, and community empowerment."
      keywords="contact UNNATVA, NGO contact, partnership, collaboration, get in touch"
    />
  );
}

export default ContactPage;

