import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

// Configuration
const SITE_URL = "https://portal-beta.aodn.org.au";

interface CanonicalUrlProps {
  path?: string;
}

const CanonicalUrl = ({ path }: CanonicalUrlProps) => {
  const location = useLocation();

  // Use provided path, or fallback to current pathname
  const canonicalPath = path || location.pathname;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <Helmet>
      {/* Canonical URL - prevents duplicate content issues */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default CanonicalUrl;
