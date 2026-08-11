import { describe, expect, test } from "vitest";
import { buildJsonLd, renderPage } from "../prerender";
import { BASE_URL } from "../constants";

const TEMPLATE =
  '<!doctype html><html><head><title>AODN Portal</title><meta charset="utf-8"></head><body><div id="root"></div></body></html>';

const collection = {
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
  providers: [{ name: "IMOS" }, { name: "IMOS" }, { name: "CSIRO" }],
};

const extractJsonLd = (html: string) => {
  const match = html.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/s
  );
  expect(match).not.toBeNull();
  return JSON.parse(match![1]);
};

describe("buildJsonLd", () => {
  test("maps the record to a schema.org Dataset", () => {
    expect(buildJsonLd(collection)).toEqual({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Sea Surface Temperature",
      description: "Daily SST observations around Australia.",
      url: `${BASE_URL}/details/abc-123`,
      identifier: "abc-123",
      keywords: ["Oceans | Ocean Temperature", "Oceans"],
      // duplicate provider names are collapsed
      creator: [
        { "@type": "Organization", name: "IMOS" },
        { "@type": "Organization", name: "CSIRO" },
      ],
      // schema.org GeoShape box is "south west north east"
      spatialCoverage: {
        "@type": "Place",
        geo: { "@type": "GeoShape", box: "-45 110 -10 155" },
      },
      // open-ended interval keeps ".." for the missing end
      temporalCoverage: "2010-01-01T00:00:00Z/..",
    });
  });

  test("omits optional fields the record does not have", () => {
    const jsonLd = buildJsonLd({
      id: "abc-123",
      title: "Bare record",
      description: "No extent, themes or providers.",
    });

    const serialized = JSON.stringify(jsonLd);
    expect(serialized).not.toContain("keywords");
    expect(serialized).not.toContain("creator");
    expect(serialized).not.toContain("spatialCoverage");
    expect(serialized).not.toContain("temporalCoverage");
    expect(serialized).not.toContain("null");
  });

  test("caps the description at 5000 characters", () => {
    const jsonLd = buildJsonLd({
      id: "abc-123",
      title: "Long record",
      description: "x".repeat(6000),
    });

    expect((jsonLd.description as string).length).toBe(5000);
  });
});

describe("renderPage", () => {
  test("replaces the title and injects canonical, description and JSON-LD", () => {
    const html = renderPage(TEMPLATE, collection);

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
    expect(html).toContain('<body><div id="root"></div></body>');
  });

  test("escapes HTML in the title and meta description", () => {
    const html = renderPage(TEMPLATE, {
      id: "abc-123",
      title: 'Temp <"salinity" & more>',
      description: 'A "quoted" <description> & more',
    });

    expect(html).toContain(
      "<title>Temp &#60;&#34;salinity&#34; &#38; more&#62; | AODN Portal</title>"
    );
    expect(html).toContain(
      '<meta name="description" content="A &#34;quoted&#34; &#60;description&#62; &#38; more" />'
    );
    expect(html).not.toContain("<description>");
  });

  test("keeps a </script> inside the description from closing the JSON-LD tag", () => {
    const html = renderPage(TEMPLATE, {
      id: "abc-123",
      title: "Sneaky record",
      description: 'Contains </script><script>alert("x")</script> inline.',
    });

    // Still exactly one script open/close pair, and the payload parses back intact
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(extractJsonLd(html).description).toBe(
      'Contains </script><script>alert("x")</script> inline.'
    );
  });

  test("injects social preview tags for the record", () => {
    const html = renderPage(TEMPLATE, collection);

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

    const html = renderPage(templateWithSocial, collection);

    expect(html.match(/property="og:title"/g)).toHaveLength(1);
    expect(html.match(/name="twitter:card"/g)).toHaveLength(1);
    expect(html).not.toContain("Site title");
  });

  test("replaces a site-wide description from the template with the record's", () => {
    const templateWithDescription = TEMPLATE.replace(
      "</head>",
      '<meta name="description" content="Site-wide description." /></head>'
    );

    const html = renderPage(templateWithDescription, collection);

    expect(html.match(/<meta name="description"/g)).toHaveLength(1);
    expect(html).toContain(
      '<meta name="description" content="Daily SST observations around Australia." />'
    );
    expect(html).not.toContain("Site-wide description.");
  });

  test("caps the meta description at 160 characters", () => {
    const html = renderPage(TEMPLATE, {
      id: "abc-123",
      title: "Long record",
      description: "y".repeat(300),
    });

    // Only the meta tag is capped; the JSON-LD description keeps up to 5000
    const meta = html.match(/<meta name="description" content="(y+)"/);
    expect(meta![1]).toHaveLength(160);
    expect(extractJsonLd(html).description).toHaveLength(300);
  });
});
