import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

// Configuration
const SITE_URL = "https://portal-beta.aodn.org.au";

// TODO: Add more SEO configuration when needed
// export const seoConfig = {
//   siteName: 'Your App Name',
//   defaultTitle: 'Your App Name - Tagline',
//   defaultDescription: 'Default description for your application',
//   defaultImage: '/og-default.jpg',
//   twitterHandle: '@yourhandle',
// };

interface SEOProps {
  path?: string;
}

const SEO = ({ path }: SEOProps) => {
  const location = useLocation();

  // Use provided path, or fallback to current pathname
  const canonicalPath = path || location.pathname;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <Helmet>
      {/* Canonical URL - prevents duplicate content issues */}
      <link rel="canonical" href={canonicalUrl} />

      {/* TODO: Add page title */}
      {/* <title>{title || seoConfig.defaultTitle}</title> */}

      {/* TODO: Add meta description for SEO */}
      {/* <meta name="description" content={description || seoConfig.defaultDescription} /> */}

      {/* TODO: Add Open Graph tags for social sharing */}
      {/* <meta property="og:url" content={canonicalUrl} /> */}
      {/* <meta property="og:title" content={title || seoConfig.defaultTitle} /> */}
      {/* <meta property="og:description" content={description || seoConfig.defaultDescription} /> */}
      {/* <meta property="og:image" content={image || seoConfig.defaultImage} /> */}

      {/* TODO: Add Twitter Card tags */}
      {/* <meta name="twitter:card" content="summary_large_image" /> */}
      {/* <meta name="twitter:title" content={title || seoConfig.defaultTitle} /> */}
      {/* <meta name="twitter:description" content={description || seoConfig.defaultDescription} /> */}
      {/* <meta name="twitter:image" content={image || seoConfig.defaultImage} /> */}

      {/* TODO: Add noindex if needed */}
      {/* {noIndex && <meta name="robots" content="noindex,nofollow" />} */}
    </Helmet>
  );
};

export default SEO;
