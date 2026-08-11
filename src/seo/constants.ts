// v2 is currently served from portal-beta. When it takes over the production
// domain, update this and robots.prod.txt together.
export const BASE_URL = "https://portal-beta.aodn.org.au";

// Where the build steps fetch records from. The portal domain, not
// ogcapi-production, whose WAF 403s GitHub Actions runners. No trailing slash.
export const OGC_API_BASE = "https://portal.production.aodn.org.au";

// og:image for social link previews, on every page. 1200x630 per the Open
// Graph recommendation — the raw logos are under the 200x200 minimum and
// would be dropped by Facebook/LinkedIn.
export const SHARE_IMAGE_URL = `${BASE_URL}/logo/og_image.png`;
