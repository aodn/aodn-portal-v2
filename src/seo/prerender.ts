/**
 * Pre-renders a static dist/prerender/details/<uuid>/index.html per record,
 * with real title, description, canonical and Dataset JSON-LD in the head —
 * see README.md. CloudFront rewrites crawler requests for /details/<uuid>
 * to these pages; real users always get the live SPA shell.
 * The complete expected page is pinned by the contract test in
 * __test__/prerender.test.ts ("renders the complete crawler page …").
 * Standalone (needs a prior build): npx vite-node src/seo/prerender.ts
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { isSeoEligibleCollection } from "@/seo/collectionEligibility";
import type { OGCCollection } from "./fetchCollections";
import { fetchCollections } from "./fetchCollections";
import {
  abstractOf,
  buildBreadcrumbJsonLd,
  buildJsonLd,
  visibleKeywords,
} from "./jsonLd";
import type { ILink } from "@/app/store/OGCCollectionDefinitions";
import { buildRelatedLinks, RelatedLink } from "./relatedRecords";
import { isSeoCli, runCli, seoDistDir } from "./cli";
import {
  detailsUrl,
  escapeEntities,
  PRERENDER_DETAILS_DIR,
  SHARE_IMAGE_URL,
  SITE_NAME,
} from "./constants";

// How many skipped ids the log prints; a bad fetch can skip thousands
const SKIPPED_IDS_SHOWN = 20;

// Relations that point at another record in this catalogue
const RECORD_RELS = new Set(["parent", "child", "sibling"]);

// Metadata points at a sibling record as "uuid:<id>", which is not an address
// a crawler can follow; turn it into that record's page instead.
const RECORD_REFERENCE = /^uuid:(.+)$/i;

// A relative href (articleId=8084) would resolve to an invented
// /details/articleId=8084, so only absolute URLs and record references stay.
const toCrawlableHref = (href: string) => {
  if (RECORD_REFERENCE.test(href)) {
    return `/details/${encodeURIComponent(href.replace(RECORD_REFERENCE, "$1"))}`;
  }
  return /^[a-z][a-z0-9+.-]*:/i.test(href) ? href : "";
};

interface CrawlerLink {
  href: string;
  text: string;
}

/**
 * What the crawler page says, one field per Detail_Page tab. Plain data: the
 * HTML is made from it by renderBody. The shape is pinned in
 * __test__/prerender.test.ts.
 */
export interface CrawlerContent {
  title: string;
  date?: { label: "Updated" | "Published"; value: string };
  summary: {
    abstract: string[];
    temporalCoverage?: string;
    spatialCoverage?: string;
  };
  dataAccess: {
    data: CrawlerLink[];
    documents: CrawlerLink[];
    codeTutorials: CrawlerLink[];
    other: CrawlerLink[];
  };
  citationAndUsage: {
    suggestedCitation?: string;
    citedResponsibleParties: string[];
    dataContact: string[];
    license?: { name: string; url?: string };
  };
  additionalInformation: { lineage: string[]; keywords: string[] };
  relatedRecords: { id: string; title: string }[];
}

// One entry per blank-line separated paragraph
const splitParagraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const isoDay = (iso: string) => iso.slice(0, 10);

// A labelled date matching the JSON-LD dates — Google's best practice for
// controlling the date shown next to search results
const dateOf = (collection: OGCCollection): CrawlerContent["date"] => {
  const revision = collection.getRevision();
  const creation = collection.getCreation();
  if (revision) return { label: "Updated", value: isoDay(revision) };
  if (creation) return { label: "Published", value: isoDay(creation) };
};

const temporalCoverageOf = (collection: OGCCollection) => {
  const [start, end] = collection.extent?.temporal?.interval?.[0] ?? [];
  return start
    ? `${isoDay(start)} to ${end ? isoDay(end) : "Present"}`
    : undefined;
};

const spatialCoverageOf = (collection: OGCCollection) => {
  const box = collection.getBBox()?.[0];
  if (box?.length !== 4) return undefined;
  const [west, south, east, north] = box;
  return `West ${west}°, South ${south}°, East ${east}°, North ${north}°`;
};

const crawlerLinks = (links: ILink[] = []): CrawlerLink[] =>
  links.flatMap((link) => {
    const href = toCrawlableHref(link.href ?? "");
    return href
      ? [{ href, text: link.title?.replace(/_/g, " ") || link.href }]
      : [];
  });

// Organisation names only: contact names, emails, phones and addresses are
// personal data and stay off the page.
const organisations = (collection: OGCCollection, role: string) => [
  ...new Set(
    (collection.getContacts() ?? [])
      .filter((contact) => contact.roles?.includes(role))
      .map((contact) => contact.organization?.trim())
      .filter((name): name is string => !!name)
  ),
];

// The licence a record is published under, with its URL when it has one.
const licenseOf = (collection: OGCCollection) => {
  const name = collection.getLicense();
  if (!name) return undefined;
  const url = collection.links?.find(
    (link) => link.rel?.toLowerCase() === "license"
  )?.href;
  return { name, url };
};

// The Detail_Page stores '{"title":…,"recordAbstract":…}' in a record link's
// title; fall back to a plain title, then the record id.
const recordTitle = (link: ILink) => {
  let title = link.title;
  try {
    title = JSON.parse(title).title ?? title;
  } catch {
    // not JSON: already a plain title
  }
  return title || link.href.replace(RECORD_REFERENCE, "$1");
};

const isRecordLink = (link: ILink) =>
  RECORD_RELS.has(link.rel?.toLowerCase() ?? "") &&
  RECORD_REFERENCE.test(link.href ?? "");

// Records this one names as its parent, sibling or child, in the metadata's
// own order. Theme-derived suggestions follow them.
const recordLinks = (collection: OGCCollection): RelatedLink[] =>
  (collection.links ?? []).filter(isRecordLink).map((link) => ({
    id: link.href.replace(RECORD_REFERENCE, "$1"),
    title: recordTitle(link),
  }));

// Google left many detail pages "Crawled - currently not indexed" while the
// crawler page carried only a title, an abstract and a few links. So it now
// carries what the Detail_Page shows, tab by tab, and nothing the page does not
// show (that would be cloaking). Left out: interactive parts (map, downloads),
// personal contact details, and fields the page does not display.
export const crawlerContent = (
  collection: OGCCollection,
  related: RelatedLink[] = []
): CrawlerContent => {
  const named = recordLinks(collection);
  const namedIds = new Set(named.map((link) => link.id));
  return {
    title: collection.title ?? "",
    date: dateOf(collection),
    summary: {
      abstract: splitParagraphs(abstractOf(collection)),
      temporalCoverage: temporalCoverageOf(collection),
      spatialCoverage: spatialCoverageOf(collection),
    },
    dataAccess: {
      data: crawlerLinks(collection.getDataAccessLinks()),
      documents: crawlerLinks(collection.getDocumentLinks()),
      codeTutorials: crawlerLinks(collection.getCodeTutorialLinks()),
      other: crawlerLinks(collection.getOtherLinks()),
    },
    citationAndUsage: {
      suggestedCitation: collection.getCitation()?.suggestedCitation,
      citedResponsibleParties: organisations(collection, "citation"),
      dataContact: organisations(collection, "about"),
      license: licenseOf(collection),
    },
    additionalInformation: {
      lineage: splitParagraphs(collection.getStatement() ?? ""),
      keywords: visibleKeywords(collection.getThemes()),
    },
    relatedRecords: [
      ...named,
      ...related.filter((link) => !namedIds.has(link.id)),
    ],
  };
};

const linkList = (items: string[]) =>
  items.length ? `<ul>${items.join("")}</ul>` : "";

const section = (label: string, content: string) =>
  content
    ? `<section aria-label="${label}"><h2>${label}</h2>${content}</section>`
    : "";

const textList = (texts: string[]) =>
  linkList(texts.map((text) => `<li>${escapeEntities(text)}</li>`));

const paragraphs = (texts: string[]) =>
  texts.map((text) => `<p>${escapeEntities(text)}</p>`).join("");

const anchor = (href: string, text: string) =>
  `<a href="${escapeEntities(href)}">${escapeEntities(text)}</a>`;

const linksSection = (label: string, links: CrawlerLink[]) =>
  section(
    label,
    linkList(links.map(({ href, text }) => `<li>${anchor(href, text)}</li>`))
  );

// Static body for crawlers, in the order of the Detail_Page tabs. Crawlers
// only follow <a href>. stripAppBundle keeps it from being replaced.
const renderBody = (content: CrawlerContent) => {
  const { summary, dataAccess, citationAndUsage, additionalInformation } =
    content;
  const { license } = citationAndUsage;
  const dateLine = content.date
    ? `<p>${content.date.label}: ${escapeEntities(content.date.value)}</p>`
    : "";
  const textSection = (label: string, text?: string) =>
    section(label, text ? paragraphs([text]) : "");
  const related = content.relatedRecords.length
    ? `<nav aria-label="Related records"><h2>Related records</h2>${linkList(
        content.relatedRecords.map(
          ({ id, title }) =>
            `<li>${anchor(`/details/${encodeURIComponent(id)}`, title)}</li>`
        )
      )}</nav>`
    : "";
  const sections = [
    section("Summary", paragraphs(summary.abstract)),
    textSection("Temporal coverage", summary.temporalCoverage),
    textSection("Spatial coverage", summary.spatialCoverage),
    linksSection("Data", dataAccess.data),
    linksSection("Documents", dataAccess.documents),
    linksSection("Code Tutorials", dataAccess.codeTutorials),
    linksSection("Other", dataAccess.other),
    textSection("Suggested Citation", citationAndUsage.suggestedCitation),
    section(
      "Cited Responsible Parties",
      textList(citationAndUsage.citedResponsibleParties)
    ),
    section("Data Contact", textList(citationAndUsage.dataContact)),
    section(
      "License",
      license
        ? `<p>${license.url ? anchor(license.url, license.name) : escapeEntities(license.name)}</p>`
        : ""
    ),
    section("Lineage", paragraphs(additionalInformation.lineage)),
    section("Keywords", textList(additionalInformation.keywords)),
    related,
  ].filter(Boolean);
  const sectionsHtml = sections.length
    ? `\n    ${sections.join("\n    ")}`
    : "";
  // Without this link the 15k detail pages are an island: the SPA's own
  // "Back to Home" is a Box with an onClick, which a crawler cannot follow.
  return `<nav aria-label="Breadcrumb"><a href="/">${SITE_NAME}</a></nav>
  <main>
    <h1>${escapeEntities(content.title)}</h1>
    ${dateLine}${sectionsHtml}
  </main>`;
};

const MODULE_SCRIPT = /\s*<script[^>]*type="module"[^>]*>\s*<\/script>/g;
const MODULE_PRELOAD = /\s*<link[^>]*rel="modulepreload"[^>]*\/?>/g;

/**
 * Drops the app bundle so the page renders the same with or without JS.
 * Otherwise React empties #root on render and every record is indexed as the
 * same empty shell. Only crawlers get these pages; the JSON-LD is not a
 * module, so it survives. Each pattern repeats until nothing changes: one
 * pass can rejoin interleaved tags into a working script.
 */
const stripAppBundle = (html: string) =>
  [MODULE_SCRIPT, MODULE_PRELOAD].reduce((current, pattern) => {
    let stripped = current;
    let previous = "";
    do {
      previous = stripped;
      stripped = stripped.replace(pattern, "");
    } while (stripped !== previous);
    return stripped;
  }, html);

// \u003c-escape keeps a "</script>" inside the JSON from closing the tag early;
// JSON.stringify drops undefined-valued fields
const toJsonLdScript = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

// Renders what crawlers read for one record — in Google terms: the title link,
// snippet, canonical and Dataset structured data, plus Open Graph / Twitter
// social preview tags, and a static body (see renderBody).
export const renderCrawlerPage = (
  template: string,
  collection: OGCCollection,
  related: RelatedLink[] = []
) => {
  const title = escapeEntities(collection.title ?? "");
  const description = escapeEntities(abstractOf(collection).slice(0, 160));
  const pageUrl = detailsUrl(collection.id);
  const headTags = [
    `<link rel="canonical" href="${pageUrl}" />`,
    `<meta name="description" content="${description}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    `<meta property="og:image" content="${SHARE_IMAGE_URL}" />`,
    '<meta name="twitter:card" content="summary" />',
    toJsonLdScript(buildJsonLd(collection)),
    toJsonLdScript(buildBreadcrumbJsonLd(collection)),
  ].join("\n    ");
  return stripAppBundle(
    template
      .replace(/<title>.*?<\/title>/s, `<title>${title} | ${SITE_NAME}</title>`)
      // The template carries site-wide description and social tags; the record's replace them
      .replace(/\s*<meta name="description"[^>]*\/?>/, "")
      .replace(/\s*<meta (?:property="og:|name="twitter:)[^>]*\/?>/g, "")
      .replace("</head>", `${headTags}\n  </head>`)
      // New Relic is ~97% of the shell and useless on a crawler-only page
      .replace(/\s*<!-- Tracking code -.*?<\/script>/s, "")
      // Google Analytics: crawler-only pages have no visitors worth counting
      .replace(
        /\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js[^"]*"><\/script>\s*<script>.*?<\/script>/s,
        ""
      )
      // The shell's #root is empty; the record body goes in its place
      .replace(
        /<div id="root">.*?<\/div>/s,
        () =>
          `<div id="root">${renderBody(crawlerContent(collection, related))}</div>`
      )
  );
};

export const prerenderDetailPages = async (
  outDir: string,
  prefetched?: OGCCollection[]
) => {
  const template = await readFile(path.join(outDir, "index.html"), "utf8");
  const collections = prefetched ?? (await fetchCollections());

  const detailsDir = path.join(outDir, PRERENDER_DETAILS_DIR);
  await mkdir(detailsDir, { recursive: true });

  const pages = collections.filter(isSeoEligibleCollection);
  // Name the skipped records: a bare count hides a record that is invisible
  // to crawlers, and nobody reads a number in the CI log
  const skippedIds = collections
    .filter((collection) => !isSeoEligibleCollection(collection))
    .map((collection) => collection.id ?? "(no id)");
  // Built over pages only, so related links never point at a skipped record
  const related = buildRelatedLinks(pages);
  // Bound concurrency so ~15k writes do not hit EMFILE
  const WRITE_CONCURRENCY = 64;
  for (let i = 0; i < pages.length; i += WRITE_CONCURRENCY) {
    await Promise.all(
      pages.slice(i, i + WRITE_CONCURRENCY).map(async (collection) => {
        const pageDir = path.join(detailsDir, collection.id);
        await mkdir(pageDir, { recursive: true });
        await writeFile(
          path.join(pageDir, "index.html"),
          renderCrawlerPage(template, collection, related.get(collection.id))
        );
      })
    );
  }

  if (pages.length === 0) {
    throw new Error(
      "No detail pages pre-rendered; refusing to ship an empty prerender folder."
    );
  }
  console.log(
    `Pre-rendered ${pages.length} detail pages to ${detailsDir}` +
      (skippedIds.length
        ? ` (skipped ${skippedIds.length} without valid id/title/description: ` +
          `${skippedIds.slice(0, SKIPPED_IDS_SHOWN).join(", ")}` +
          `${skippedIds.length > SKIPPED_IDS_SHOWN ? ", …" : ""})`
        : "")
  );
};

if (isSeoCli("prerender.ts")) {
  runCli(prerenderDetailPages(seoDistDir()));
}
