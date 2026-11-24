import { describe, expect, test } from "vitest";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { crawlerContent, renderCrawlerPage } from "../prerender";
import { SEO_PROPERTIES } from "../fetchCollections";
import { SEO_COLLECTION } from "@/__mocks__/data/SEO_COLLECTION";
import { BASE_URL } from "../constants";

const TEMPLATE =
  '<!doctype html><html lang="en"><head><title>AODN Portal</title><meta charset="utf-8"></head><body><div id="root"></div></body></html>';

const toCollection = (data: Record<string, unknown>) =>
  Object.assign(new OGCCollection(), data);

/**
 * (a) THE RECORD THE BACKEND RETURNS
 *
 * fetchCollections asks /api/v1/ogc/collections for SEO_PROPERTIES. Each
 * requested name lands in the returned record (an OGC Collection) here:
 *
 *   requested        where it is in the record
 *   ---------------  --------------------------
 *   id               id
 *   title            title
 *   description      description
 *   ai_description   properties["ai:description"]   (enhanced abstract)
 *   bbox             extent.spatial.bbox            [[west, south, east, north]]
 *   temporal         extent.temporal.interval       [[start, end | null]]
 *   themes           properties.themes              [{ scheme, concepts[] }]
 *   creation         properties.creation
 *   revision         properties.revision
 *   citation         properties.citation            { suggestedCitation }
 *   license          properties.license
 *   dataset_provider properties.dataset_provider
 *   statement        properties.statement           (lineage)
 *   contacts         properties.contacts            [{ organization, roles, … }]
 *   links            links                          [{ href, rel, title, "ai:group" }]
 *
 * The fixture SEO_COLLECTION is such a record. The table below keeps this
 * comment and SEO_PROPERTIES from drifting apart.
 */
const RECORD_LOCATIONS: [string, string][] = [
  ["id", "id"],
  ["title", "title"],
  ["description", "description"],
  ["ai_description", "properties.ai:description"],
  ["bbox", "extent.spatial.bbox"],
  ["temporal", "extent.temporal.interval"],
  ["themes", "properties.themes"],
  ["creation", "properties.creation"],
  ["revision", "properties.revision"],
  ["citation", "properties.citation"],
  ["license", "properties.license"],
  ["dataset_provider", "properties.dataset_provider"],
  ["statement", "properties.statement"],
  ["contacts", "properties.contacts"],
  ["links", "links"],
];

describe("the record the backend returns", () => {
  test("has a location for every requested property, and no others", () => {
    expect(RECORD_LOCATIONS.map(([name]) => name).sort()).toEqual(
      SEO_PROPERTIES.split(",").sort()
    );
  });

  test.each(RECORD_LOCATIONS)(
    "%s is at %s in the record",
    (_name, location) => {
      const value = location
        .split(".")
        .reduce<any>((node, key) => node?.[key], SEO_COLLECTION);
      expect(value).toBeDefined();
    }
  );
});

/**
 * (b) THE CONTENT THE CRAWLER PAGE USES
 *
 * crawlerContent turns the record into this plain object, one field per
 * Detail_Page tab; renderBody only turns it into HTML. Empty sections are
 * empty arrays or missing fields. Contacts are reduced to organisation names.
 */
describe("the content the crawler page uses", () => {
  test("is this structure for the fully-populated record", () => {
    const related = [
      // Already named by the record's own sibling link: listed once
      { id: "77777777-8888-4999-8aaa-111111111111", title: "Duplicate" },
      { id: "def-456", title: "Ocean Currents" },
    ];

    expect(crawlerContent(toCollection(SEO_COLLECTION), related)).toEqual({
      title: "Sample SEO Record",
      date: { label: "Updated", value: "2024-06-30" },
      summary: {
        abstract: [
          "Enhanced abstract for the fictitious sample record.",
          "It has a second paragraph so paragraph splitting can be tested.",
        ],
        temporalCoverage: "2020-01-01 to Present",
        spatialCoverage: "West 110°, South -45°, East 155°, North -10°",
      },
      dataAccess: {
        data: [
          {
            href: "https://example.org/geoserver/wms",
            text: "example:sample layer",
          },
          { href: "https://example.org/geoserver/wfs", text: "SHAPE-ZIP" },
          {
            href: "https://example.org/data/sample_dataset",
            text: "Sample dataset page",
          },
        ],
        documents: [
          {
            href: "https://example.org/docs/sample.pdf",
            text: "Sample document",
          },
        ],
        codeTutorials: [
          {
            href: "https://example.org/notebooks/sample.ipynb",
            text: "Sample notebook",
          },
        ],
        other: [{ href: "https://example.org/other", text: "Other resource" }],
      },
      citationAndUsage: {
        suggestedCitation:
          "Example Marine Institute (2024). Sample SEO record. Example Marine Institute.",
        citedResponsibleParties: [
          "Example Marine Institute",
          "Example University",
        ],
        dataContact: ["Example Marine Institute"],
        license: {
          name: "Creative Commons Attribution 4.0 International License",
          url: "https://creativecommons.org/licenses/by/4.0/",
        },
      },
      additionalInformation: {
        lineage: [
          "Sample lineage statement.",
          "Second lineage block for the sample record.",
        ],
        // Categories and AI-predicted concepts are not shown on the Detail_Page
        keywords: ["Sea surface temperature"],
      },
      relatedRecords: [
        // The record's own links first, then the suggestions
        {
          id: "66666666-7777-4888-8999-000000000000",
          title: "Sample parent record",
        },
        {
          id: "77777777-8888-4999-8aaa-111111111111",
          title: "Sample sibling record",
        },
        {
          id: "88888888-9999-4aaa-8bbb-222222222222",
          title: "Sample child record",
        },
        { id: "def-456", title: "Ocean Currents" },
      ],
    });
  });

  test("drops links a crawler cannot follow", () => {
    const content = crawlerContent(
      toCollection({
        id: "abc-123",
        title: "T",
        description: "D",
        links: [
          {
            rel: "related",
            href: "articleId=8084",
            title: "Relative",
            "ai:group": "Other",
          },
        ],
      })
    );
    expect(content.dataAccess.other).toEqual([]);
  });
});

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

  test("keeps $ sequences in the abstract literal", () => {
    // "$&" in a string replacement would splice the matched template back in
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Prices",
        description: "Costs $& per sample, see $1",
      })
    );

    expect(html).toContain("<p>Costs $&#38; per sample, see $1</p>");
    expect(html.match(/<div id="root">/g)).toHaveLength(1);
  });

  test("injects the record's title and abstract into the body", () => {
    const html = renderCrawlerPage(TEMPLATE, collection);

    expect(html).toContain(
      '<div id="root"><nav aria-label="Breadcrumb"><a href="/">AODN Portal</a></nav>'
    );
    expect(html).toContain("<h1>Sea Surface Temperature</h1>");
    expect(html).toContain("<p>Daily SST observations around Australia.</p>");
    // No related records given — no nav
    expect(html).not.toContain('aria-label="Related records"');
  });

  test("renders the complete crawler page for a fully-populated record", () => {
    const id = SEO_COLLECTION.id;
    const full = toCollection(SEO_COLLECTION);

    const html = renderCrawlerPage(TEMPLATE, full, [
      // Already named by the record's own sibling link: listed once
      { id: "77777777-8888-4999-8aaa-111111111111", title: "Duplicate" },
      { id: "def-456", title: "Ocean Currents" },
    ]);

    // Head: what Google reads at crawl time. The abstract is the enhanced
    // description, not the plain one.
    const metaAbstract =
      "Enhanced abstract for the fictitious sample record.\n\nIt has a second paragraph so paragraph splitting can be tested.";
    expect(html).toContain("<title>Sample SEO Record | AODN Portal</title>");
    expect(html).toContain(
      `<link rel="canonical" href="${BASE_URL}/details/${id}" />`
    );
    expect(html).toContain(
      `<meta name="description" content="${metaAbstract}" />`
    );
    expect(html).toContain(
      `<meta property="og:description" content="${metaAbstract}" />`
    );
    expect(html).not.toContain("Plain abstract");
    expect(extractJsonLd(html)).toEqual({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Sample SEO Record",
      description:
        "Enhanced abstract for the fictitious sample record.\n\nIt has a second paragraph so paragraph splitting can be tested.",
      url: `${BASE_URL}/details/${id}`,
      identifier: id,
      includedInDataCatalog: {
        "@type": "DataCatalog",
        name: "AODN Portal",
        url: `${BASE_URL}/`,
      },
      datePublished: "2020-01-15",
      dateModified: "2024-06-30",
      // AI-predicted and "Categories" concepts are not shown, so not listed
      keywords: ["Sea surface temperature"],
      creator: { "@type": "Organization", name: "Example Marine Institute" },
      spatialCoverage: {
        "@type": "Place",
        geo: { "@type": "GeoShape", box: "-45 110 -10 155" },
      },
      distribution: [
        {
          "@type": "DataDownload",
          contentUrl: "https://example.org/geoserver/wms",
          name: "example:sample_layer",
        },
        {
          "@type": "DataDownload",
          contentUrl: "https://example.org/geoserver/wfs",
          name: "SHAPE-ZIP",
        },
      ],
      temporalCoverage: "2020-01-01T00:00:00.000+00:00/..",
      license: "https://creativecommons.org/licenses/by/4.0/",
      citation:
        "Example Marine Institute (2024). Sample SEO record. Example Marine Institute.",
    });

    // Body: every section in the design's order, as a non-JS crawler gets it
    const section = (heading: string, content: string) =>
      `<section aria-label="${heading}"><h2>${heading}</h2>${content}</section>`;
    const links = (...items: [string, string][]) =>
      `<ul>${items.map(([href, text]) => `<li><a href="${href}">${text}</a></li>`).join("")}</ul>`;
    const expectedBody = [
      '<nav aria-label="Breadcrumb"><a href="/">AODN Portal</a></nav>',
      "  <main>",
      "    <h1>Sample SEO Record</h1>",
      "    <p>Updated: 2024-06-30</p>",
      `    ${section("Summary", "<p>Enhanced abstract for the fictitious sample record.</p><p>It has a second paragraph so paragraph splitting can be tested.</p>")}`,
      `    ${section("Temporal coverage", "<p>2020-01-01 to Present</p>")}`,
      `    ${section("Spatial coverage", "<p>West 110°, South -45°, East 155°, North -10°</p>")}`,
      `    ${section("Data", links(["https://example.org/geoserver/wms", "example:sample layer"], ["https://example.org/geoserver/wfs", "SHAPE-ZIP"], ["https://example.org/data/sample_dataset", "Sample dataset page"]))}`,
      `    ${section("Documents", links(["https://example.org/docs/sample.pdf", "Sample document"]))}`,
      `    ${section("Code Tutorials", links(["https://example.org/notebooks/sample.ipynb", "Sample notebook"]))}`,
      `    ${section("Other", links(["https://example.org/other", "Other resource"]))}`,
      `    ${section("Suggested Citation", "<p>Example Marine Institute (2024). Sample SEO record. Example Marine Institute.</p>")}`,
      `    ${section("Cited Responsible Parties", "<ul><li>Example Marine Institute</li><li>Example University</li></ul>")}`,
      `    ${section("Data Contact", "<ul><li>Example Marine Institute</li></ul>")}`,
      `    ${section("License", '<p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a></p>')}`,
      `    ${section("Lineage", "<p>Sample lineage statement.</p><p>Second lineage block for the sample record.</p>")}`,
      `    ${section("Keywords", "<ul><li>Sea surface temperature</li></ul>")}`,
      '    <nav aria-label="Related records"><h2>Related records</h2><ul>' +
        [
          ["66666666-7777-4888-8999-000000000000", "Sample parent record"],
          ["77777777-8888-4999-8aaa-111111111111", "Sample sibling record"],
          ["88888888-9999-4aaa-8bbb-222222222222", "Sample child record"],
          ["def-456", "Ocean Currents"],
        ]
          .map(
            ([rid, text]) => `<li><a href="/details/${rid}">${text}</a></li>`
          )
          .join("") +
        "</ul></nav>",
      "  </main>",
    ].join("\n");
    const body = html.match(/<div id="root">(.*?)<\/div><\/body>/s)?.[1];
    expect(body).toBe(expectedBody);
  });
  test("describes the record with its plain description when there is no enhanced one", () => {
    const html = renderCrawlerPage(TEMPLATE, collection);
    expect(html).toContain(
      '<section aria-label="Summary"><h2>Summary</h2><p>Daily SST observations around Australia.</p></section>'
    );
  });
  test("lists keywords the Detail_Page shows, not Categories or AI concepts", () => {
    const html = renderCrawlerPage(TEMPLATE, toCollection(SEO_COLLECTION));
    expect(html).toContain("<li>Sea surface temperature</li>");
    expect(html).not.toContain("Predicted keyword");
    expect(html).not.toContain("oceans");
  });
  test("shows contact organisations only, never people or contact details", () => {
    const html = renderCrawlerPage(TEMPLATE, toCollection(SEO_COLLECTION));
    ["@example.org", "+61", "Sample, Person", "Data Officer", "Hobart"].forEach(
      (personal) => expect(html).not.toContain(personal)
    );
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

  test("groups catalogue links by access type before related records", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Sea Surface Temperature",
        description: "Daily SST observations around Australia.",
        links: [
          {
            rel: "related",
            href: "https://data.aodn.org.au/sst.nc",
            type: "application/netcdf",
            title: "SST <file>",
            "ai:group": "Data Access",
          },
          {
            rel: "license",
            href: "https://creativecommons.org/licenses/by/4.0/",
            type: "text/html",
            title: "",
          },
          {
            rel: "related",
            href: "",
            type: "text/html",
            title: "Missing href",
            "ai:group": "Other",
          },
          {
            rel: "self",
            href: "https://portal.aodn.org.au/api/self",
            type: "application/json",
            title: "Self",
          },
          {
            rel: "icon",
            href: "https://portal.aodn.org.au/icon.png",
            type: "image/png",
            title: "Icon",
          },
          {
            rel: "preview",
            href: "https://portal.aodn.org.au/preview.png",
            type: "image/png",
            title: "Preview",
          },
        ],
      }),
      [{ id: "def-456", title: "Ocean Currents" }]
    );

    const dataAt = html.indexOf('<section aria-label="Data">');
    const relatedAt = html.indexOf('<nav aria-label="Related records">');
    expect(dataAt).toBeGreaterThan(-1);
    expect(relatedAt).toBeGreaterThan(dataAt);
    expect(html).toContain(
      '<a href="https://data.aodn.org.au/sst.nc">SST &#60;file&#62;</a>'
    );
    // The licence has its own section, so it is not repeated in a link list
    expect(html).not.toContain(
      '<li><a href="https://creativecommons.org/licenses/by/4.0/">'
    );
    expect(html).not.toContain("Missing href");
    expect(html).not.toContain("/api/self");
    expect(html).not.toContain("/icon.png");
    expect(html).not.toContain("/preview.png");
  });

  test("turns a uuid: reference into that record's page", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Sea Surface Temperature",
        description: "Daily SST observations around Australia.",
        links: [
          {
            rel: "sibling",
            href: "uuid:ec2c0ef9-3645-4ded-b617-c8297f6eb250",
            type: "text/html",
            title: "Baited video survey",
          },
        ],
      })
    );

    expect(html).toContain(
      '<a href="/details/ec2c0ef9-3645-4ded-b617-c8297f6eb250">Baited video survey</a>'
    );
    expect(html).not.toContain("uuid:");
  });

  test("drops a relative href, which would invent /details/articleId=8084", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Sea Surface Temperature",
        description: "Daily SST observations around Australia.",
        links: [
          { rel: "related", href: "articleId=8084", title: "Old portal page" },
          { rel: "related", href: "undefined", title: "Nothing" },
        ],
      })
    );

    expect(html).not.toContain("articleId=8084");
    expect(html).not.toContain(">Nothing</a>");
  });

  test("puts the lineage in the body, one paragraph per block", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Sea Surface Temperature",
        description: "Daily SST observations around Australia.",
        properties: {
          statement:
            "Data Ingestion Workflow\n\nSource datasets were <b>harmonised</b>.",
        },
      })
    );

    expect(html).toContain('<section aria-label="Lineage"><h2>Lineage</h2>');
    expect(html).toContain("<p>Data Ingestion Workflow</p>");
    expect(html).toContain(
      "<p>Source datasets were &#60;b&#62;harmonised&#60;/b&#62;.</p>"
    );
  });

  test("links the licence where the record has a licence URL", () => {
    const html = renderCrawlerPage(
      TEMPLATE,
      toCollection({
        id: "abc-123",
        title: "Sea Surface Temperature",
        description: "Daily SST observations around Australia.",
        properties: {
          license: "Creative Commons Attribution 4.0 International License",
        },
        links: [
          {
            rel: "license",
            href: "https://creativecommons.org/licenses/by/4.0/",
            title: "License",
          },
        ],
      })
    );

    expect(html).toContain(
      '<h2>License</h2><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a></p>'
    );
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

  test("removes the app bundle so rendering cannot erase the body", () => {
    // Shaped like the built shell: Vite's hashed entry plus legacy_portal.js
    const builtShell =
      '<!doctype html><html lang="en"><head><title>AODN Portal</title>' +
      '<link rel="modulepreload" crossorigin href="/assets/vendor-xyz.js" />' +
      '<link rel="stylesheet" crossorigin href="/assets/index-abc.css" />' +
      '<script type="module" src="/legacy_portal.js"></script>' +
      '</head><body><div id="root"></div>' +
      '<script type="module" crossorigin src="/assets/index-abc.js"></script>' +
      "</body></html>";

    const html = renderCrawlerPage(builtShell, collection);

    expect(html).not.toContain('type="module"');
    expect(html).not.toContain("/assets/index-abc.js");
    expect(html).not.toContain("legacy_portal.js");
    expect(html).not.toContain("modulepreload");
    // The record content and its structured data survive
    expect(html).toContain("<h1>Sea Surface Temperature</h1>");
    expect(extractJsonLd(html).name).toBe("Sea Surface Temperature");
    // Stylesheets are left alone — only executable code erases the body
    expect(html).toContain('<link rel="stylesheet"');
  });

  test("strips interleaved module scripts a single pass would rejoin", () => {
    // Removing the inner match once would splice "<scr" onto "ipt ..." and
    // leave a working module script behind
    const interleaved =
      '<!doctype html><html lang="en"><head><title>AODN Portal</title></head>' +
      '<body><div id="root"></div>' +
      '<scr<script type="module" src="/a.js"></script>' +
      'ipt type="module" src="/b.js"></script>' +
      "</body></html>";

    const html = renderCrawlerPage(interleaved, collection);

    expect(html).not.toContain('type="module"');
    expect(html).not.toContain("/b.js");
  });

  test("links back to the home page so the pages are not an island", () => {
    const html = renderCrawlerPage(TEMPLATE, collection);

    expect(html).toContain('<a href="/">AODN Portal</a>');
  });

  test("carries BreadcrumbList JSON-LD alongside the Dataset", () => {
    const html = renderCrawlerPage(TEMPLATE, collection);
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs
      ),
    ].map((match) => JSON.parse(match[1]));

    expect(blocks.map((block) => block["@type"])).toEqual([
      "Dataset",
      "BreadcrumbList",
    ]);
    expect(blocks[1].itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "AODN Portal",
        item: `${BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sea Surface Temperature",
        item: `${BASE_URL}/details/abc-123`,
      },
    ]);
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

    // Still one open/close pair per JSON-LD block (Dataset + BreadcrumbList),
    // and the payload parses back intact
    expect(html.match(/<\/script>/g)).toHaveLength(2);
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
