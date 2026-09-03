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
export const CRAWLER_UA_PATTERN = new RegExp(CRAWLER_TOKENS.join("|"), "i");

// cloudfront function name must be "handler"
function handler(event) {
  const request = event.request;
  const uri = request.uri;
  const userAgentHeader = request.headers["user-agent"];
  const userAgent = userAgentHeader ? userAgentHeader.value : "";

  // Static files pass through untouched.
  if (/\/[^/]+\.[^/]+$/.test(uri)) {
    return request;
  }

  // Only rewrite /details/<uuid> requests.
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
