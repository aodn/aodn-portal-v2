/**
 * Verifies the SEO state, printing every problem and exiting non-zero:
 *   yarn seo:verify                        checks dist/ after seo:artifacts
 *   yarn seo:verify https://<site>         checks the deployed site
 */

import { readdir, readFile } from "fs/promises";
import path from "path";
import { isSeoCli, seoDistDir } from "./cli";
import {
  BASE_URL,
  CRAWLER_UA,
  detailsUrl,
  extractSitemapUrls,
  PRERENDER_DETAILS_DIR,
  SITE_NAME,
} from "./constants";
import { sampleEvenly } from "./searchConsole";
import { SITE_TITLE } from "./headTags";

// The workflow refuses to publish fewer pages — keep in sync with seo.yml
const MIN_PAGES = 10000;
const DIST_SAMPLE_SIZE = 20;
const LIVE_SAMPLE_SIZE = 3;

export const checkSitemap = (xml: string, minUrls = MIN_PAGES) => {
  const problems: string[] = [];
  const urls = extractSitemapUrls(xml);
  if (!xml.startsWith("<?xml")) {
    problems.push("does not start with an XML declaration");
  }
  if (!urls.includes(`${BASE_URL}/`)) {
    problems.push("is missing the home page");
  }
  if (urls.length < minUrls) {
    problems.push(`has ${urls.length} URLs, expected at least ${minUrls}`);
  }
  const foreign = urls.filter((url) => !url.startsWith(`${BASE_URL}/`));
  if (foreign.length > 0) {
    problems.push(
      `${foreign.length} URLs are not under ${BASE_URL}, e.g. ${foreign[0]}`
    );
  }
  return { urls, problems };
};

// The date line the body should carry, derived from the JSON-LD so the two
// are checked against each other — Google wants them to match
const expectedDateLine = (dataset: {
  dateModified?: string;
  datePublished?: string;
}) => {
  if (dataset.dateModified) return `<p>Updated: ${dataset.dateModified}</p>`;
  if (dataset.datePublished)
    return `<p>Published: ${dataset.datePublished}</p>`;
  return null;
};

export const checkDetailPage = (html: string, uuid: string): string[] => {
  const problems: string[] = [];
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  // SITE_TITLE is what an unrendered app shell carries — a crawler request
  // that missed the pre-rendered page comes back with exactly that
  if (!title || [SITE_NAME, SITE_TITLE].includes(title.trim())) {
    problems.push("title is missing or still the generic site title");
  }
  if (!html.includes(`<link rel="canonical" href="${detailsUrl(uuid)}" />`)) {
    problems.push("canonical does not point at this record");
  }
  if (!/<meta name="description" content="[^"]/.test(html)) {
    problems.push("meta description is missing or empty");
  }
  if (!html.includes('<meta property="og:title"')) {
    problems.push("social preview (Open Graph) tags are missing");
  }
  const jsonLd = html.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/s
  )?.[1];
  if (!jsonLd) {
    problems.push("Dataset JSON-LD is missing");
  } else {
    try {
      const dataset = JSON.parse(jsonLd);
      if (dataset["@type"] !== "Dataset") {
        problems.push(
          `JSON-LD @type is "${dataset["@type"]}", expected "Dataset"`
        );
      }
      if (!dataset.name || !dataset.description) {
        problems.push("JSON-LD is missing name or description");
      }
      if (dataset.url !== detailsUrl(uuid)) {
        problems.push("JSON-LD url does not match the record");
      }
      const dateLine = expectedDateLine(dataset);
      if (dateLine && !html.includes(dateLine)) {
        problems.push("visible date does not match the JSON-LD dates");
      }
    } catch {
      problems.push("Dataset JSON-LD is not valid JSON");
    }
  }
  if (!/<h1>[^<]/.test(html)) {
    problems.push("body is missing the visible record content (h1)");
  }
  if (!html.includes('<div id="root"')) {
    problems.push("page no longer boots the app shell");
  }
  return problems;
};

export const checkHomePage = (html: string, production: boolean): string[] => {
  const problems: string[] = [];
  if (!/<meta name="description" content="[^"]/.test(html)) {
    problems.push("meta description is missing or empty");
  }
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (production && noindex) {
    problems.push("production must not carry noindex");
  }
  if (!production && !noindex) {
    problems.push("non-prod must carry noindex so Google drops it");
  }
  return problems;
};

export const checkRobotsTxt = (text: string, production: boolean): string[] => {
  const problems: string[] = [];
  // A blocked page can never be de-indexed: Google cannot fetch its noindex tag
  if (/^\s*Disallow:\s*\/\s*$/m.test(text)) {
    problems.push('blocks all crawling ("Disallow: /")');
  }
  if (production && !/^Sitemap:/m.test(text)) {
    problems.push("production robots.txt should point at the sitemap");
  }
  return problems;
};

const report = (failures: string[], okSummary: string) => {
  if (failures.length > 0) {
    for (const failure of failures) console.error(`FAIL ${failure}`);
    throw new Error(`${failures.length} problems found`);
  }
  console.log(`OK: ${okSummary}`);
};

const verifyDist = async (distDir: string) => {
  const failures: string[] = [];

  const xml = await readFile(path.join(distDir, "sitemap.xml"), "utf8").catch(
    () => null
  );
  let urls: string[] = [];
  if (xml === null) {
    failures.push("sitemap.xml: missing — run yarn seo:artifacts first");
  } else {
    const sitemap = checkSitemap(xml);
    urls = sitemap.urls;
    failures.push(...sitemap.problems.map((p) => `sitemap.xml: ${p}`));
  }

  const detailsDir = path.join(distDir, PRERENDER_DETAILS_DIR);
  const files = await readdir(detailsDir).catch(() => [] as string[]);
  if (files.length < MIN_PAGES) {
    failures.push(
      `${PRERENDER_DETAILS_DIR}: ${files.length} pages, expected at least ${MIN_PAGES}`
    );
  }

  const sampled = sampleEvenly(files, DIST_SAMPLE_SIZE);
  for (const uuid of sampled) {
    const html = await readFile(
      path.join(detailsDir, uuid, "index.html"),
      "utf8"
    );
    failures.push(
      ...checkDetailPage(html, uuid).map(
        (p) => `${PRERENDER_DETAILS_DIR}/${uuid}: ${p}`
      )
    );
    if (urls.length > 0 && !urls.includes(detailsUrl(uuid))) {
      failures.push(
        `${PRERENDER_DETAILS_DIR}/${uuid}: not listed in sitemap.xml`
      );
    }
  }

  report(
    failures,
    `${urls.length} sitemap URLs, ${files.length} detail pages, ${sampled.length} sampled pages all valid`
  );
};

const verifyLive = async (site: string) => {
  const production = site === BASE_URL;
  const failures: string[] = [];
  const fetchText = async (pathname: string) =>
    (
      await fetch(`${site}${pathname}`, {
        headers: { "user-agent": CRAWLER_UA },
      })
    ).text();

  failures.push(
    ...checkHomePage(await fetchText("/"), production).map((p) => `/: ${p}`)
  );
  failures.push(
    ...checkRobotsTxt(await fetchText("/robots.txt"), production).map(
      (p) => `robots.txt: ${p}`
    )
  );

  const { urls, problems } = checkSitemap(await fetchText("/sitemap.xml"));
  failures.push(...problems.map((p) => `sitemap.xml: ${p}`));

  const detailUuids = urls
    .filter((url: string) => url.includes("/details/"))
    .map((url: string) => url.split("/details/")[1]);
  for (const uuid of sampleEvenly(detailUuids, LIVE_SAMPLE_SIZE)) {
    failures.push(
      ...checkDetailPage(await fetchText(`/details/${uuid}`), uuid).map(
        (p) => `details/${uuid}: ${p}`
      )
    );
  }

  report(
    failures,
    `${site} (${production ? "production" : "non-prod"}) — home, robots.txt, ${urls.length} sitemap URLs and ${Math.min(LIVE_SAMPLE_SIZE, detailUuids.length)} sampled detail pages all valid`
  );
};

if (isSeoCli("verifySeoArtifacts.ts")) {
  const [siteArg] = process.argv.slice(2);
  const run = siteArg?.startsWith("http")
    ? verifyLive(siteArg.replace(/\/+$/, ""))
    : verifyDist(seoDistDir());
  run.catch((error) => {
    console.error(String(error));
    process.exit(1);
  });
}
