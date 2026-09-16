// Viewer-request function on /details/*: crawlers get the pre-rendered page,
// real users get the app shell. This is the only copy of the crawler list.
const CRAWLER_TOKENS = [
  "bot", // Googlebot, Bingbot, GPTBot, ClaudeBot, DuckDuckBot, Applebot...
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

// cloudfront function name must be "handler"
function handler(event) {
  const request = event.request;
  const uri = request.uri;
  const userAgentHeader = request.headers["user-agent"];
  const userAgent = userAgentHeader ? userAgentHeader.value : "";

  // Only rewrite /details/<uuid> requests; anything else passes through.
  // Ids may contain dots (ASAC_2201_HCL_0.5), so no "looks like a file" check.
  const match = uri.match(/^\/details\/([^/]+)\/?$/);

  if (!match) {
    return request;
  }

  const uuid = match[1];

  if (CRAWLER_UA_PATTERN.test(userAgent)) {
    request.uri = "/prerender/details/" + uuid + "/index.html";
  } else {
    request.uri = "/index.html";
  }

  return request;
}
