// Viewer-response function on /details/*. Every pre-rendered page is uploaded
// with the "prerendered" marker, so a 200 without it is the app shell that
// CloudFront falls back to when the page is missing. Crawlers must see 404
// there, or the record looks like a real page with no content.
// CRAWLER_TOKENS must stay identical to the list in
// aodn_portal_frontend_route_by_user_agent.js; a test compares the two files.
const CRAWLER_TOKENS = [
  "bot", // Googlebot, Bingbot, GPTBot, ClaudeBot, DuckDuckBot, Applebot...
  "google-inspectiontool",
  "crawler",
  "spider", // Baiduspider...
  "slurp", // Yahoo
  "facebookexternalhit", // Facebook/Instagram link previews
  "embedly",
  "quora link preview",
  "outbrain",
  "pinterest",
  "vkshare",
  "w3c_validator",
  "whatsapp",
  "telegram",
  "aodn-seo-verify", // our own smoke check, see CRAWLER_UA
];
const CRAWLER_UA_PATTERN = new RegExp(CRAWLER_TOKENS.join("|"), "i");

const PRERENDER_MARKER = "x-amz-meta-prerendered";

function isCrawler(request) {
  const userAgent = request.headers["user-agent"];
  return userAgent ? CRAWLER_UA_PATTERN.test(userAgent.value) : false;
}

function isPrerenderedPage(response) {
  return Boolean(response.headers[PRERENDER_MARKER]);
}

// cloudfront function name must be "handler"
function handler(event) {
  const response = event.response;

  // Real users are meant to get the shell: the app shows "Record not found"
  if (!isCrawler(event.request)) {
    return response;
  }

  if (response.statusCode === 200 && !isPrerenderedPage(response)) {
    response.statusCode = 404;
    response.statusDescription = "Not Found";
  }

  return response;
}
