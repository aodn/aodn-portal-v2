import { describe, expect, test } from "vitest";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { renderCrawlerPage } from "../prerender";
import { BASE_URL } from "../constants";

const TEMPLATE =
  '<!doctype html><html lang="en"><head><title>AODN Portal</title><meta charset="utf-8"></head><body><div id="root"></div></body></html>';

const toCollection = (data: Record<string, unknown>) =>
  Object.assign(new OGCCollection(), data);

const collection = toCollection({
  id: "abc-123",
  title: "Sea Surface Temperature",
  description: "Daily SST observations around Australia.",
  extent: {
    spatial: { bbox: [[110, -45, 155, -10]] },
    temporal: { interval: [["2010-01-01T00:00:00Z", null]] },
  },
  properties: {
    themes: [
      { concepts: [{ id: "Oceans | Ocean Temperature" }, { id: "Oceans" }] },
    ],
  },
});

const extractJsonLd = (html: string) => {
  const match = html.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/s
  );
  expect(match).not.toBeNull();
  return JSON.parse(match![1]);
};

describe("renderCrawlerPage", () => {
  test("replaces the title and injects canonical, description and JSON-LD", () => {
    const html = renderCrawlerPage(TEMPLATE, collection);

    expect(html).toContain(
      "<title>Sea Surface Temperature | AODN Portal</title>"
    );
    expect(html).not.toContain("<title>AODN Portal</title>");
    expect(html).toContain(
      `<link rel="canonical" href="${BASE_URL}/details/abc-123" />`
    );
    expect(html).toContain(
      '<meta name="description" content="Daily SST observations around Australia." />'
    );
    expect(extractJsonLd(html).name).toBe("Sea Surface Temperature");
    // The rest of the template is preserved
    expect(html).toContain('<meta charset="utf-8">');
    expect(html).toContain('<body><div id="root">');
  });

  test("injects the record's title and abstract into the body", () => {
    const html = renderCrawlerPage(TEMPLATE, collection);

    expect(html).toContain('<div id="root"><main>');
    expect(html).toContain("<h1>Sea Surface Temperature</h1>");
    expect(html).toContain("<p>Daily SST observations around Australia.</p>");
    // No related records given — no nav
    expect(html).not.toContain('aria-label="Related records"');
  });

  test("renders the complete crawler page for a fully-populated record", () => {
    const full = toCollection({
      id: "abc-123",
      title: "Sea Surface Temperature",
      description: "Daily SST observations around Australia.",
      extent: {
        spatial: { bbox: [[110, -45, 155, -10]] },
        temporal: { interval: [["2010-01-01T00:00:00Z", null]] },
      },
      properties: {
        themes: [{ concepts: [{ id: "Oceans" }] }],
        creation: "2017-04-27T00:00:00",
        revision: "2026-08-12T15:24:43",
        license: "Creative Commons Attribution 4.0 International License",
        citation: {
          suggestedCitation: "IMOS (2017). Sea Surface Temperature.",
        },
        dataset_provider: "IMOS",
      },
    });

    const html = renderCrawlerPage(TEMPLATE, full, [
      { id: "def-456", title: "Ocean Currents" },
    ]);

    // Head: what Google reads at crawl time
    expect(html).toContain(
      "<title>Sea Surface Temperature | AODN Portal</title>"
    );
    expect(html).toContain(
      `<link rel="canonical" href="${BASE_URL}/details/abc-123" />`
    );
    expect(html).toContain(
      '<meta name="description" content="Daily SST observations around Australia." />'
    );
    expect(html).toContain('<meta property="og:title"');
    expect(extractJsonLd(html)).toEqual({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Sea Surface Temperature",
      description: "Daily SST observations around Australia.",
      url: `${BASE_URL}/details/abc-123`,
      identifier: "abc-123",
      datePublished: "2017-04-27",
      dateModified: "2026-08-12",
      keywords: ["Oceans"],
      creator: { "@type": "Organization", name: "IMOS" },
      spatialCoverage: {
        "@type": "Place",
        geo: { "@type": "GeoShape", box: "-45 110 -10 155" },
      },
      temporalCoverage: "2010-01-01T00:00:00Z/..",
      license: "Creative Commons Attribution 4.0 International License",
      citation: "IMOS (2017). Sea Surface Temperature.",
    });

    // Body: visible content plus the internal links crawlers follow,
    // exactly as a non-JS crawler receives it
    const body = html.match(/<div id="root">(.*?)<\/div><\/body>/s)?.[1];
    expect(body).toBe(`<main>
    <h1>Sea Surface Temperature</h1>
    <p>Updated: 2026-08-12</p>
    <p>Daily SST observations around Australia.</p>
    <nav aria-label="Related records"><h2>Related records</h2><ul><li><a href="/details/def-456">Ocean Currents</a></li></ul></nav>
  </main>`);
  });

  test("shows a labelled Updated date in the body", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Dated record",
        description: "Has dates.",
        properties: {
          creation: "2017-04-27T00:00:00",
          revision: "2026-08-12T15:24:43",
        },
      })
    );

    expect(html).toContain("<p>Updated: 2026-08-12</p>");
  });

  test("falls back to a Published date when there is no revision", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Dated record",
        description: "Has dates.",
        properties: { creation: "2017-04-27T00:00:00" },
      })
    );

    expect(html).toContain("<p>Published: 2017-04-27</p>");
  });

  test("links related records in the body with real, escaped hrefs", () => {
    const html = renderCrawlerPage(TEMPLATE, collection, [
      { id: "def-456", title: "Chlorophyll <a> estimates" },
      { id: "ghi-789", title: "Ocean Currents" },
    ]);

    expect(html).toContain(
      '<a href="/details/def-456">Chlorophyll &#60;a&#62; estimates</a>'
    );
    expect(html).toContain('<a href="/details/ghi-789">Ocean Currents</a>');
    expect(html).toContain('<nav aria-label="Related records">');
  });

  test("removes the New Relic tracking script", () => {
    const templateWithNewRelic = TEMPLATE.replace(
      "</head>",
      "<!-- Tracking code - the comment below initializes monitoring - DO NOT DELETE -->" +
        "<script>window.NREUM || (NREUM = {});</script></head>"
    );

    const html = renderCrawlerPage(templateWithNewRelic, collection);

    expect(html).not.toContain("NREUM");
    expect(html).toContain('<div id="root">');
  });

  test("removes the Google Analytics scripts", () => {
    const templateWithAnalytics = TEMPLATE.replace(
      "</head>",
      '<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXX"></script>' +
        "<script>window.dataLayer = [];</script></head>"
    );

    const html = renderCrawlerPage(templateWithAnalytics, collection);

    expect(html).not.toContain("googletagmanager");
    expect(html).not.toContain("dataLayer");
  });

  test("escapes HTML in the title and meta description", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: 'Temp <"salinity" & more>',
        description: 'A "quoted" <description> & more',
      })
    );

    expect(html).toContain(
      "<title>Temp &#60;&#34;salinity&#34; &#38; more&#62; | AODN Portal</title>"
    );
    expect(html).toContain(
      '<meta name="description" content="A &#34;quoted&#34; &#60;description&#62; &#38; more" />'
    );
    expect(html).toContain(
      "<h1>Temp &#60;&#34;salinity&#34; &#38; more&#62;</h1>"
    );
    expect(html).not.toContain("<description>");
  });

  test("keeps a </script> inside the description from closing the JSON-LD tag", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Sneaky record",
        description: 'Contains </script><script>alert("x")</script> inline.',
      })
    );

    // Still exactly one script open/close pair, and the payload parses back intact
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(extractJsonLd(html).description).toBe(
      'Contains </script><script>alert("x")</script> inline.'
    );
  });

  test("injects social preview tags for the record", () => {
    const html = renderCrawlerPage(TEMPLATE, collection);

    expect(html).toContain(
      '<meta property="og:title" content="Sea Surface Temperature" />'
    );
    expect(html).toContain(
      `<meta property="og:url" content="${BASE_URL}/details/abc-123" />`
    );
    expect(html).toContain('<meta name="twitter:card" content="summary" />');
  });

  test("replaces the template's site-wide social tags with the record's", () => {
    const templateWithSocial = TEMPLATE.replace(
      "</head>",
      '<meta property="og:title" content="Site title" />' +
        '<meta name="twitter:card" content="summary" /></head>'
    );

    const html = renderCrawlerPage(templateWithSocial, collection);

    expect(html.match(/property="og:title"/g)).toHaveLength(1);
    expect(html.match(/name="twitter:card"/g)).toHaveLength(1);
    expect(html).not.toContain("Site title");
  });

  test("replaces a site-wide description from the template with the record's", () => {
    const templateWithDescription = TEMPLATE.replace(
      "</head>",
      '<meta name="description" content="Site-wide description." /></head>'
    );

    const html = renderCrawlerPage(templateWithDescription, collection);

    expect(html.match(/<meta name="description"/g)).toHaveLength(1);
    expect(html).toContain(
      '<meta name="description" content="Daily SST observations around Australia." />'
    );
    expect(html).not.toContain("Site-wide description.");
  });

  test("caps the meta description at 160 characters", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Long record",
        description: "y".repeat(300),
      })
    );

    // Only the meta tag is capped; the JSON-LD description keeps up to 5000
    const meta = html.match(/<meta name="description" content="(y+)"/);
    expect(meta![1]).toHaveLength(160);
    expect(extractJsonLd(html).description).toHaveLength(300);
  });
});
