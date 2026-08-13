// v2 is currently served from portal-beta. When it takes over the production
// domain, update this and robots.prod.txt together.
export const BASE_URL = "https://portal-beta.aodn.org.au";

// Keep in sync with useDocumentTitle.ts
export const SITE_NAME = "AODN Portal";

// Where the build steps fetch records from. The portal domain, not
// ogcapi-production, whose WAF 403s GitHub Actions runners. No trailing slash.
export const OGC_API_BASE = "https://portal.production.aodn.org.au";

// og:image for social link previews, on every page. 1200x630 per the Open
// Graph recommendation — the raw logos are under the 200x200 minimum and
// would be dropped by Facebook/LinkedIn.
export const SHARE_IMAGE_URL = `${BASE_URL}/logo/og_image.png`;

export const detailsUrl = (id: string) => `${BASE_URL}/details/${id}`;

// Safe as an S3 object key / file name; skips the class default id "undefined"
export const isSafeCollectionId = (id: string | undefined): id is string =>
  Boolean(id) &&
  id !== undefined &&
  id !== "undefined" &&
  /^[A-Za-z0-9._-]+$/.test(id);

export const escapeEntities = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

export const extractSitemapUrls = (xml: string) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
