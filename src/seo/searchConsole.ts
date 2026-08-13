/**
 * Google Search Console operations for the sitemap: yarn seo:gsc <command>
 *
 *   submit               submit BASE_URL/sitemap.xml and print its status
 *   status               print how Search Console processed the sitemap
 *   inspect [sampleSize] index coverage of sampled URLs (quota: 2000/day)
 *
 * One-time auth setup: see README.md. GSC_SITE_URL overrides the property.
 */

import { createSign } from "crypto";
import { readFile } from "fs/promises";
import { isSeoCli, runCli } from "./cli";
import { BASE_URL, extractSitemapUrls } from "./constants";

// The verified URL-prefix property (trailing slash matters); GSC_SITE_URL overrides
const SITE_URL = process.env.GSC_SITE_URL ?? `${BASE_URL}/`;
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters";
const SITEMAP_ENDPOINT = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;
const INSPECT_ENDPOINT =
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
}

export const loadServiceAccountKey = async (): Promise<ServiceAccountKey> => {
  const raw = process.env.GSC_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "Set GSC_SERVICE_ACCOUNT_KEY to the service account key file path or its JSON content."
    );
  }
  const json = raw.trimStart().startsWith("{")
    ? raw
    : await readFile(raw, "utf8");
  const key = JSON.parse(json) as Partial<ServiceAccountKey>;
  if (!key.client_email || !key.private_key) {
    throw new Error(
      "GSC_SERVICE_ACCOUNT_KEY is not a service account key (missing client_email/private_key)."
    );
  }
  return key as ServiceAccountKey;
};

const base64url = (data: string) => Buffer.from(data).toString("base64url");

// Standard OAuth2 service-account flow, signed here to avoid a googleapis dependency
export const buildJwtAssertion = (
  key: ServiceAccountKey,
  nowSeconds: number
) => {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: key.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: nowSeconds,
      exp: nowSeconds + 3600,
    })
  );
  const signature = createSign("RSA-SHA256")
    .update(`${header}.${claims}`)
    .sign(key.private_key, "base64url");
  return `${header}.${claims}.${signature}`;
};

const fetchAccessToken = async (key: ServiceAccountKey): Promise<string> => {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: buildJwtAssertion(key, Math.floor(Date.now() / 1000)),
    }),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Token request failed (HTTP ${response.status}): ${body}`);
  }
  return (JSON.parse(body) as { access_token: string }).access_token;
};

const fetchSearchConsole = async (
  token: string,
  url: string,
  init?: RequestInit
) => {
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init?.headers },
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}: ${body}`);
  }
  return body ? JSON.parse(body) : {};
};

const submitSitemap = async (token: string) => {
  await fetchSearchConsole(token, SITEMAP_ENDPOINT, { method: "PUT" });
  console.log(`Submitted ${SITEMAP_URL} to ${SITE_URL}`);
};

const printSitemapStatus = async (token: string) => {
  const status = await fetchSearchConsole(token, SITEMAP_ENDPOINT);
  console.log(JSON.stringify(status, null, 2));
};

export const sampleEvenly = <T>(items: T[], size: number): T[] => {
  if (size >= items.length) return items;
  const step = items.length / size;
  return Array.from({ length: size }, (_, i) => items[Math.floor(i * step)]);
};

export const fetchSitemapUrls = async (): Promise<string[]> => {
  const response = await fetch(SITEMAP_URL);
  const xml = await response.text();
  const urls = extractSitemapUrls(xml);
  if (urls.length === 0) {
    throw new Error(
      `No <loc> entries at ${SITEMAP_URL} (HTTP ${response.status}) — is the sitemap published?`
    );
  }
  return urls;
};

const printIndexCoverage = async (token: string, size: number) => {
  const urls = sampleEvenly(await fetchSitemapUrls(), size);
  const counts = new Map<string, number>();
  const notIndexed: string[] = [];
  for (const url of urls) {
    const result = await fetchSearchConsole(token, INSPECT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
    });
    const state: string =
      result.inspectionResult?.indexStatusResult?.coverageState ?? "Unknown";
    counts.set(state, (counts.get(state) ?? 0) + 1);
    if (state !== "Submitted and indexed") notIndexed.push(`${state} — ${url}`);
  }

  console.log(`Coverage of ${urls.length} sampled URLs from ${SITEMAP_URL}:`);
  for (const [state, count] of [...counts].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count}  ${state}`);
  }
  if (notIndexed.length > 0) {
    console.log("Not indexed:");
    for (const line of notIndexed) console.log(`  ${line}`);
  }
};

if (isSeoCli("searchConsole.ts")) {
  const [command, arg] = process.argv.slice(2);
  runCli(
    (async () => {
      if (!["submit", "status", "inspect"].includes(command)) {
        throw new Error(
          "Usage: yarn seo:gsc submit | status | inspect [sampleSize]"
        );
      }
      const token = await fetchAccessToken(await loadServiceAccountKey());
      if (command === "submit") {
        await submitSitemap(token);
        await printSitemapStatus(token);
      } else if (command === "status") {
        await printSitemapStatus(token);
      } else if (command === "inspect") {
        await printIndexCoverage(token, Number(arg) || 50);
      }
    })()
  );
}
