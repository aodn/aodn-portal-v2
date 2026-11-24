/**
 * Small record that carries every property requested by SEO_PROPERTIES
 * (src/seo/fetchCollections.ts), including the optional ones
 * (ai:description, dataset_provider). All people, emails and
 * phone numbers are fictitious.
 */
const SEO_COLLECTION = {
  properties: {
    "ai:description":
      "Enhanced abstract for the fictitious sample record.\n\nIt has a second paragraph so paragraph splitting can be tested.",
    dataset_provider: "Example Marine Institute",
    license: "Creative Commons Attribution 4.0 International License",
    statement:
      "Sample lineage statement.\n\nSecond lineage block for the sample record.",
    creation: "2020-01-15T00:00:00Z",
    revision: "2024-06-30T00:00:00Z",
    citation: {
      suggestedCitation:
        "Example Marine Institute (2024). Sample SEO record. Example Marine Institute.",
    },
    contacts: [
      {
        name: "Sample, Person",
        organization: "Example Marine Institute",
        position: "Data Officer",
        emails: ["data.officer@example.org"],
        phones: [{ value: "+61 0 0000 0000", roles: ["voice"] }],
        addresses: [
          {
            delivery_point: ["1 Example Street"],
            city: "Hobart",
            administrative_area: "TAS",
            postal_code: "7000",
            country: "Australia",
          },
        ],
        roles: ["citation", "about"],
      },
      {
        name: "Sample, Other",
        organization: "Example University",
        position: "Researcher",
        emails: ["researcher@example.org"],
        phones: [{ value: "+61 0 0000 0001", roles: ["voice"] }],
        addresses: [],
        roles: ["citation"],
      },
    ],
    themes: [
      {
        scheme: "theme",
        title: "AODN Discovery Parameter Vocabulary",
        concepts: [
          {
            id: "Sea surface temperature",
            url: "http://vocab.aodn.org.au/def/discovery_parameter/entity/1",
            title: "AODN Discovery Parameter Vocabulary",
          },
          {
            id: "Predicted keyword",
            url: "http://vocab.aodn.org.au/def/discovery_parameter/entity/2",
            title: "AODN Discovery Parameter Vocabulary",
            "ai:description": "Predicted by the AI model",
          },
        ],
      },
      {
        scheme: "Categories",
        title: "Categories",
        concepts: [{ id: "oceans" }],
      },
    ],
  },
  id: "11111111-2222-4333-8444-555555555555",
  title: "Sample SEO Record",
  description: "Plain abstract of the fictitious sample record.",
  links: [
    {
      href: "https://example.org/geoserver/wms",
      rel: "wms",
      type: "",
      title: "example:sample_layer",
      "ai:group": "Data Access > wms",
      "ai:role": ["download"],
    },
    {
      href: "https://example.org/geoserver/wfs",
      rel: "wfs",
      type: "",
      title: "SHAPE-ZIP",
      "ai:group": "Data Access > wfs",
      "ai:role": ["download"],
    },
    {
      href: "https://example.org/data/sample_dataset",
      rel: "related",
      type: "text/html",
      title: "Sample_dataset_page",
      "ai:group": "Data Access",
    },
    {
      href: "https://example.org/docs/sample.pdf",
      rel: "related",
      type: "application/pdf",
      title: "Sample document",
      "ai:group": "Document",
    },
    {
      href: "https://example.org/notebooks/sample.ipynb",
      rel: "related",
      type: "application/x-ipynb+json",
      title: "Sample notebook",
      "ai:group": "Code Tutorials",
    },
    {
      href: "https://example.org/other",
      rel: "related",
      type: "text/html",
      title: "Other resource",
      "ai:group": "Other",
    },
    {
      href: "https://creativecommons.org/licenses/by/4.0/",
      rel: "license",
      type: "text/html",
      title: "CC BY 4.0",
    },
    {
      href: "uuid:66666666-7777-4888-8999-000000000000",
      rel: "parent",
      type: "application/json",
      title:
        '{"title":"Sample parent record","recordAbstract":"Parent abstract."}',
    },
    {
      href: "uuid:77777777-8888-4999-8aaa-111111111111",
      rel: "sibling",
      type: "application/json",
      title:
        '{"title":"Sample sibling record","recordAbstract":"Sibling abstract."}',
    },
    {
      href: "uuid:88888888-9999-4aaa-8bbb-222222222222",
      rel: "child",
      type: "application/json",
      title:
        '{"title":"Sample child record","recordAbstract":"Child abstract."}',
    },
  ],
  extent: {
    spatial: {
      bbox: [[110, -45, 155, -10]],
    },
    temporal: {
      interval: [["2020-01-01T00:00:00.000+00:00", null]],
    },
  },
};

export { SEO_COLLECTION };
