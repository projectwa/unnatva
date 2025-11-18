/**
 * SEO Component
 * Reusable component for managing meta tags using React Helmet
 */

import { Helmet } from 'react-helmet-async';
import { baseUrl } from '../../utils/paths';

function SEO({
  title = 'UNNATVA Foundation',
  description = 'UNNATVA Foundation empowers underserved communities across India through sustainable livelihood initiatives, entrepreneurship development, and skill training programs.',
  keywords = 'NGO India, skill development, entrepreneurship training, women empowerment, education, UNNATVA Foundation',
  ogImage = '/img/og-default.jpg',
  ogType = 'website',
  canonicalUrl = null,
  structuredData = null
}) {
  // Get current URL for canonical and og:url
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="UNNATVA Foundation" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;

