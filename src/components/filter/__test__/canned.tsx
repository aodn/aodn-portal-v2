// obtain from query
// https://portal-edge.aodn.org.au/api/v1/ogc/collections?properties=id,providers&filter=temporal after 2019-01-01T00:00:00Z AND dataset_provider='IMOS'
const responseIdProvider = {
  links: [],
  collections: [
    {
      properties: {},
      id: "b2548767-514f-4a31-b65e-36bb894382d5",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0267b46b-d5b2-470c-a03c-6754dd2edd33",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "164dcfb8-4608-4eda-93ba-55b2ff15d352",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1d600bda-2e61-48e5-b8b6-21f036654589",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "36ca4dbc-45f9-43b2-87f9-cc43519c496a",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "55cbe84a-d809-4c97-80dd-1f698eb4c345",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "793a212c-b39a-4b21-bf8e-d296ee1a2d1a",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "86291d6f-3f49-4ef0-8e91-68a447475dc6",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8afd17e9-c8af-4c27-9b8a-4bee8140b6f4",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0dd3832a-cf67-4068-a446-a9c91c77273e",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6b4f7c8f-0d36-49a6-b7f7-0bd32bf1b907",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "917bb1f1-14d5-4585-a0b6-c52710740a19",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5f359ca7-396a-4c1a-8388-77a50ad39859",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8f44f09a-07a3-4f9b-ba26-2fc4983fef69",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8e00907f-716d-4080-b212-534fcd78a602",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c24d0593-2c53-47d3-a6d1-2e5456dd7e16",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "37751f5b-3c93-40df-9913-951df310cbc8",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6447f562-9063-4879-8598-ca0b5c4e0175",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "697aa9e7-bf24-4f9e-9950-d5cfd78f1b35",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "77f46a04-f07d-4968-a5f9-1da8df9706a7",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a9e03db8-f277-45d1-821d-cfcbfe8ae6be",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ad4d6908-3a36-4991-996a-5b00ac162794",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "95c09bad-1847-48f0-9ed7-1ba36e7abb8d",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b3c9732e-c4dc-47cb-bf26-7b8100081994",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4c756475-eb5b-406c-93eb-278e4197f082",
      links: [],
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ba9110f1-072c-4d15-8328-2091be983991",
      links: [],
      itemType: "Collection",
    },
  ],
  total: 26,
  search_after: ["1.0", "78", "ba9110f1-072c-4d15-8328-2091be983991"],
};
// Obtain from query
// https://portal-edge.aodn.org.au/api/v1/ogc/collections?properties=id,temporal&filter=temporal%20after%202019-01-01T00:00:00Z
const responseIdTemporal = {
  links: [],
  collections: [
    {
      properties: {},
      id: "0145df96-3847-474b-8b63-a66f0e03ff54",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-22T13:00:00.000+00:00", null],
            ["2023-01-22T13:00:00.000+00:00", "2023-01-23T12:59:59.000+00:00"],
            [null, null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1045cb37-d0de-4596-8e5f-c9e77df44742",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-09T14:00:00.000+00:00", "2019-04-22T13:59:59.000+00:00"],
            ["2019-04-09T14:00:00.000+00:00", "2019-04-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1880cd63-d0f9-42e0-b073-7082527945f2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2a69093d-4878-4c62-bb34-e8f1f3ab204d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-27T14:00:00.000+00:00", "2019-05-08T13:59:59.000+00:00"],
            ["2019-04-27T14:00:00.000+00:00", "2019-05-08T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2c516bf2-2420-44c1-8412-a0f70bb077aa",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-17T13:00:00.000+00:00", "2019-03-04T12:59:59.000+00:00"],
            ["2019-01-17T13:00:00.000+00:00", "2019-03-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "357415da-3f17-4a68-bbe2-196e1c8bbb00",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3db27b9c-0b65-45f4-b78a-12d508e1bc00",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-03T14:00:00.000+00:00", "2019-10-14T12:59:59.000+00:00"],
            ["2019-10-03T14:00:00.000+00:00", "2019-10-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "43a4200a-a9b6-4e63-b5e3-9947ef527c67",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-12T13:00:00.000+00:00", "2020-03-19T12:59:59.000+00:00"],
            ["2020-03-12T13:00:00.000+00:00", "2020-03-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4750a2f7-7c43-4a67-88a3-1f80b2e8bfa1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4c52d610-75fd-414d-908d-de8b82159535",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "52be7c04-c8ee-4d00-823d-4b48f84c6872",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-13T13:00:00.000+00:00", "2019-04-03T12:59:59.000+00:00"],
            ["2019-03-13T13:00:00.000+00:00", "2019-04-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "54158abf-7d02-4e66-8529-48ba6e286d63",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-03T14:00:00.000+00:00", "2019-10-14T12:59:59.000+00:00"],
            ["2019-10-03T14:00:00.000+00:00", "2019-10-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "611ae479-24d5-4650-8c14-108706cf4d38",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-02T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "643384d6-13ba-4291-9998-f74afa217125",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-14T14:00:00.000+00:00", "2019-06-20T13:59:59.000+00:00"],
            ["2019-06-14T14:00:00.000+00:00", "2019-06-20T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "64d50449-efa8-45b4-ac56-4a2186fb73eb",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6a513fe9-fed7-4ed0-a35a-4b23e8ed172f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6ee51085-2add-4dd2-81df-96df2e6d4d4b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-09T14:00:00.000+00:00", "2021-06-23T13:59:59.000+00:00"],
            ["2021-06-09T14:00:00.000+00:00", "2021-06-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "831b4113-8b50-4aa9-b8f7-2a902c3478b2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "888d9f49-5d19-49fb-96cd-b26b94bcc2ee",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-26T14:00:00.000+00:00", "2020-09-12T13:59:59.000+00:00"],
            ["2020-08-26T14:00:00.000+00:00", "2020-09-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8986ce62-e406-4835-9684-30dee7fd16ac",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-05T14:00:00.000+00:00", "2019-09-02T13:59:59.000+00:00"],
            ["2019-08-05T14:00:00.000+00:00", "2019-09-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8f02038a-bab0-4c41-adc3-b107830b54d0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-19T14:00:00.000+00:00", "2019-08-02T13:59:59.000+00:00"],
            ["2019-07-19T14:00:00.000+00:00", "2019-08-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9117b865-35b5-441a-b4a9-34b418ebeb9f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-04T13:00:00.000+00:00", "2020-01-16T12:59:59.000+00:00"],
            ["2020-12-04T13:00:00.000+00:00", "2020-01-16T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9ddc6c88-9572-4659-9fd1-055b1d3ad3af",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9f93208d-6287-4b74-b802-e92c0b2e66db",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4528_ICESat-2-wave-attenuation-tracks",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-31T13:00:00.000+00:00", "2019-12-31T12:59:59.000+00:00"],
            ["2019-01-31T13:00:00.000+00:00", "2019-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4567_TG_deepening_Wind_2023",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-30T14:00:00.000+00:00", "2023-06-30T13:59:59.000+00:00"],
            ["2019-06-30T14:00:00.000+00:00", "2023-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4593_Motion_2021_Casey",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-30T14:00:00.000+00:00", "2021-10-05T12:59:59.000+00:00"],
            ["2021-08-30T14:00:00.000+00:00", "2021-10-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4600_Projectile_flight",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-30T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2019-06-30T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4629_HPSeis_23-24",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-12-15T13:00:00.000+00:00", "2023-12-26T12:59:59.000+00:00"],
            ["2023-12-15T13:00:00.000+00:00", "2023-12-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_5097_DAP_Acoustic_Mooring",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-07-21T14:00:00.000+00:00", "2022-02-08T12:59:59.000+00:00"],
            ["2021-07-21T14:00:00.000+00:00", "2022-02-08T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_5097_DAP_Current_Profiling",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-15T14:00:00.000+00:00", "2021-12-20T12:59:59.000+00:00"],
            ["2021-09-15T14:00:00.000+00:00", "2021-12-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b2548767-514f-4a31-b65e-36bb894382d5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-23T13:00:00.000+00:00", null],
            ["2019-12-23T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b4e8f50b-ecd5-4815-b34c-f20e208015a5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-03T14:00:00.000+00:00", "2022-05-15T13:59:59.000+00:00"],
            ["2022-05-03T14:00:00.000+00:00", "2022-05-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bb666e08-d575-45f3-a4a4-327757042c8a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c3047376-9a10-4973-a62e-99afb66f6dc6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ccbb668e-dbe6-4f4b-9ea2-fcaf0eb23aca",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-13T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
            ["2019-05-13T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "40b06369-a920-422a-928d-bc9227a4ed0b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-13T14:00:00.000+00:00", "2021-04-28T13:59:59.000+00:00"],
            ["2021-04-13T14:00:00.000+00:00", "2021-04-28T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "453a8da0-73c7-4656-b99c-d8594f5da79e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-09T14:00:00.000+00:00", "2021-06-23T13:59:59.000+00:00"],
            ["2021-06-09T14:00:00.000+00:00", "2021-06-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "572b1d3c-f20b-41d1-a456-7a28a12937b0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7e7b1232-bd4a-4337-9ed9-d374ba718b76",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-23T13:00:00.000+00:00", "2023-04-30T13:59:59.000+00:00"],
            ["2023-03-23T13:00:00.000+00:00", "2023-04-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4101_RPA_ops_summ",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-24T13:00:00.000+00:00", "2019-03-25T12:59:59.000+00:00"],
            ["2019-01-24T13:00:00.000+00:00", "2019-03-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b0b52390-d9ac-43ac-8c20-75724331e6c1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4a15ef59-003b-456b-bbc8-1f618d382615",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "58385b0e-a195-475d-8ad0-703bb53ef822",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "64cdc7f9-cede-4625-bb8e-f704dacb6a8f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-13T13:00:00.000+00:00", "2019-04-04T12:59:59.000+00:00"],
            ["2019-03-13T13:00:00.000+00:00", "2019-04-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ca735772-73f3-43ee-b707-55ceebb6561d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-13T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
            ["2019-05-13T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0b726b36-c06e-4d16-b9ff-c9963e8ba9b5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "16cde042-98d0-4c8f-aeea-42a05c8e8c06",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2eec71fa-2f3e-4d05-b258-ad07cdf5cdf9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-27T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
            ["2022-05-27T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "36df37b2-dc97-45ad-a993-ed6fba1081f9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-29T14:00:00.000+00:00", "2021-07-29T13:59:59.000+00:00"],
            ["2021-06-29T14:00:00.000+00:00", "2021-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "53135b0c-6c44-4ca7-84c6-e61cb7b36cb6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "867613c4-61cd-4fee-bc15-8f5541c81203",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "NESP_2020_SRW",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-19T14:00:00.000+00:00", "2020-08-24T13:59:59.000+00:00"],
            ["2020-08-19T14:00:00.000+00:00", "2020-08-24T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b3da234c-9101-47a6-a62f-23518c4d747c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-06-06T14:00:00.000+00:00", "2024-07-03T13:59:59.000+00:00"],
            ["2024-06-06T14:00:00.000+00:00", "2024-07-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "18979422-134c-4a18-a2f1-2c4cde0ed0f8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-07-30T14:00:00.000+00:00", "2022-07-31T13:59:59.000+00:00"],
            ["2021-07-30T14:00:00.000+00:00", "2022-07-31T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "40e9283b-d4ed-4176-8fe6-112b8697003f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-31T13:00:00.000+00:00", null],
            ["2021-12-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "45aeddf8-6134-4b9b-96c2-f04b76ab1d80",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "47d2a9fd-7ed1-45ca-b7ad-5d30354b2bc8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6fadc3fd-cbbf-40d8-a4fa-fa7774e4389d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-05T14:00:00.000+00:00", "2019-06-10T13:59:59.000+00:00"],
            ["2019-06-05T14:00:00.000+00:00", "2019-06-10T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_Antarctic_krill_growth_potential_projections_1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["1959-12-31T14:00:00.000+00:00", "2099-12-31T12:59:59.000+00:00"],
            ["1959-12-31T14:00:00.000+00:00", "1989-12-31T12:59:59.000+00:00"],
            ["2069-12-31T13:00:00.000+00:00", "2099-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4600_TEMPO_Sonobuoy_Data",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "Emperor_east_Ant",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-02T14:00:00.000+00:00", "2022-09-13T13:59:59.000+00:00"],
            ["2021-09-02T14:00:00.000+00:00", "2022-09-13T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "HI634_hydrographic_survey",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-05T13:00:00.000+00:00", "2020-02-14T12:59:59.000+00:00"],
            ["2020-02-05T13:00:00.000+00:00", "2020-02-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b349c610-32c5-4574-ae8e-43cbf204e8bc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-31T13:00:00.000+00:00", "2024-04-30T13:59:59.000+00:00"],
            ["2019-12-31T13:00:00.000+00:00", "2024-04-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b8251e1c-e316-41da-b67c-b2a01b23c9a8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-07T13:00:00.000+00:00", "2020-11-03T12:59:59.000+00:00"],
            ["2020-10-07T13:00:00.000+00:00", "2020-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b9637984-e519-4d83-8bc1-846d3868f972",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c5490299-03f1-42bb-8b87-3018d2c16c8a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-04-30T14:00:00.000+00:00", "2024-05-31T13:59:59.000+00:00"],
            ["2024-04-30T14:00:00.000+00:00", "2024-05-31T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c73d9d4c-cf5a-4e97-aa63-ece49536ea7b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-28T14:00:00.000+00:00", "2019-05-09T13:59:59.000+00:00"],
            ["2019-04-28T14:00:00.000+00:00", "2019-05-09T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1a6d3064-6287-43ad-9173-a116e33c9343",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
            ["2021-05-07T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2114aa9c-f5e7-4f75-b400-afc92c9d61f8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-12T13:00:00.000+00:00", "2020-11-22T12:59:59.000+00:00"],
            ["2020-11-12T13:00:00.000+00:00", "2020-11-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "43646083-9cd5-4774-a559-5e2ec6a953ae",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-10T14:00:00.000+00:00", "2019-04-23T13:59:59.000+00:00"],
            ["2019-04-10T14:00:00.000+00:00", "2019-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "66de00f7-1ea1-4c14-936b-dd0accadccce",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-04T14:00:00.000+00:00", "2023-06-18T13:59:59.000+00:00"],
            ["2023-06-04T14:00:00.000+00:00", "2023-06-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "679109f7-19d0-4dd6-87a7-99cac5180438",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "70e7ce53-4b34-4576-8db0-9ea5c45f5564",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-19T09:00:00.000+00:00", "2019-12-16T21:00:00.000+00:00"],
            ["2019-10-19T09:00:00.000+00:00", "2019-12-16T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9d82a00c-19ce-469e-b444-2629597aedcd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-19T13:00:00.000+00:00", "2021-11-28T12:59:59.000+00:00"],
            ["2021-11-19T13:00:00.000+00:00", "2021-11-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "079d86da-d915-4a30-8da9-f194a0f0d460",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "12801480-9a1e-45fe-8513-9d1ea6975679",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-31T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
            ["2023-10-31T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "191095f4-e7f5-4ab3-8f75-a8b5f6e79772",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-31T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
            ["2023-10-31T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "25c226b8-29bd-4f25-b20e-0e7088f34437",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-10T14:00:00.000+00:00", "2019-04-23T13:59:59.000+00:00"],
            ["2019-04-10T14:00:00.000+00:00", "2019-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "316e9360-0f7e-4a24-9487-37a4ad387d31",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3815e01e-7ec7-4af1-860f-c29aa7241b20",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-27T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
            ["2022-05-27T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3d780267-f074-4e87-8b7e-ffcc7d2aeb7d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-27T14:00:00.000+00:00", "2020-09-12T13:59:59.000+00:00"],
            ["2020-08-27T14:00:00.000+00:00", "2020-09-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "476c5bc7-5da2-4537-8fea-42e8878feeba",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4c439390-e741-4318-916e-d3add1f08416",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-06T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
            ["2023-01-06T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4debbf24-7a2a-48ed-9b4e-5cf8d1a56e78",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-04-30T14:00:00.000+00:00", "2024-05-31T13:59:59.000+00:00"],
            ["2024-04-30T14:00:00.000+00:00", "2024-05-31T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "63365542-1851-4dcf-94b3-bc2f923d2ef0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "63a144c5-1e76-47a8-a329-e4e01cb69fcf",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6da9d670-ab04-47ad-a12c-00e0b0bc1c84",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "871c7dbf-d94f-4df7-9f7c-f58586bae63e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-29T14:00:00.000+00:00", "2021-07-29T13:59:59.000+00:00"],
            ["2021-06-29T14:00:00.000+00:00", "2021-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8fe26c99-5a6d-4046-83b2-7b29531084c8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-02T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "90bb8949-6105-4c3e-af23-db2c3347de87",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9570408d-a073-4083-b2e5-5481661130f8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "983e2dcb-4e07-4442-b023-631c42725407",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a1e78b6a-3c4b-4d9b-a095-4f9ce22b20ff",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a566d8f5-dad6-4759-9495-886f3b7be508",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "cbdd5712-c153-4a1f-98d7-1e66fd806be4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-23T13:00:00.000+00:00", "2023-04-30T13:59:59.000+00:00"],
            ["2023-03-23T13:00:00.000+00:00", "2023-04-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "153eedda-bde5-4a94-a31f-79403c3db9c9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-03T14:00:00.000+00:00", "2022-05-15T13:59:59.000+00:00"],
            ["2022-05-03T14:00:00.000+00:00", "2022-05-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1e76beef-be21-44a9-b300-025723ab036c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-29T13:00:00.000+00:00", "2021-03-31T12:59:59.000+00:00"],
            ["2020-02-29T13:00:00.000+00:00", "2021-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3c6ecf42-c04c-4ce5-ac8c-eb89496fb87b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-19T14:00:00.000+00:00", "2019-08-02T13:59:59.000+00:00"],
            ["2019-07-19T14:00:00.000+00:00", "2019-08-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "43a2caf8-d580-4f51-8f5e-86a829fcee01",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4ece77dd-1761-460f-a8a4-9efd2b85888e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-19T09:00:00.000+00:00", "2019-11-10T21:00:00.000+00:00"],
            ["2019-10-19T09:00:00.000+00:00", "2019-11-10T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6669b32c-50ad-47f5-8529-78a332472a07",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-04T14:00:00.000+00:00", "2023-06-18T13:59:59.000+00:00"],
            ["2023-06-04T14:00:00.000+00:00", "2023-06-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "767bedb6-526a-42c1-81c0-5b7a121b73e4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-01T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
            ["2023-11-01T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "81a455c5-7f59-4946-8302-c1c23a0c2567",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-01T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
            ["2023-11-01T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9f963433-e3f6-427f-91b9-eead934f2bc3",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-10-27T13:00:00.000+00:00", "2024-11-07T12:59:59.000+00:00"],
            ["2024-10-27T13:00:00.000+00:00", "2024-11-07T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4546_CapeEvans_SeaIce_2019",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-10T13:00:00.000+00:00", "2019-11-26T12:59:59.000+00:00"],
            ["2019-11-10T13:00:00.000+00:00", "2019-11-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "NESP_2022_SRW",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-11T14:00:00.000+00:00", "2022-08-19T13:59:59.000+00:00"],
            ["2022-08-11T14:00:00.000+00:00", "2022-08-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a007dfda-e372-4892-bbd8-1d2fa17d3f45",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-09-12T14:00:00.000+00:00", "2023-09-30T13:59:59.000+00:00"],
            ["2023-09-12T14:00:00.000+00:00", "2023-09-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b7360644-de9b-46d1-8afe-b527d550de06",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-06T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
            ["2023-01-06T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b7ee4213-4889-40be-8d47-fb232b292cc1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-07-07T14:00:00.000+00:00", "2024-07-22T13:59:59.000+00:00"],
            ["2024-07-07T14:00:00.000+00:00", "2024-07-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c67cd4f2-28ef-495f-8e19-f35ae79664db",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c8ce0fd9-d2ca-4c0a-99d5-76962a755d2b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-09-12T14:00:00.000+00:00", "2023-09-30T13:59:59.000+00:00"],
            ["2023-09-12T14:00:00.000+00:00", "2023-09-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0245d25f-d8a2-413c-bcb3-327a4dfdf38b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-10T22:00:00.000+00:00", "2019-04-22T22:00:00.000+00:00"],
            ["2019-04-10T22:00:00.000+00:00", "2019-04-22T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "07355471-c07d-447d-ad66-9bfde95486bf",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-12T13:00:00.000+00:00", "2020-11-22T12:59:59.000+00:00"],
            ["2020-11-12T13:00:00.000+00:00", "2020-11-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "15b5af94-737f-40bd-a0bf-ff84da7efc20",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "16f7f3b6-708f-463a-9080-481286e69796",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-04T14:00:00.000+00:00", "2023-06-18T13:59:59.000+00:00"],
            ["2023-06-04T14:00:00.000+00:00", "2023-06-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "48689b26-395e-4095-999f-0860e77cca36",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "665d3b81-d8df-4f0f-9e0f-b461f19e7fa2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-09-12T14:00:00.000+00:00", "2023-09-30T13:59:59.000+00:00"],
            ["2023-09-12T14:00:00.000+00:00", "2023-09-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a0d06236-8841-475a-aafd-ea057745929e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-25T14:00:00.000+00:00", "2020-09-12T13:59:59.000+00:00"],
            ["2020-08-25T14:00:00.000+00:00", "2020-09-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a277f7cc-3dea-4b1c-b63f-db690cd7a577",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-07-07T14:00:00.000+00:00", "2024-07-22T13:59:59.000+00:00"],
            ["2024-07-07T14:00:00.000+00:00", "2024-07-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a658581d-7850-4269-8d0c-3a9c71bf18f2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b988c842-2fab-4ed1-ac0d-9666392146c8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bc1867f1-70a3-4e6c-8acf-4cdad0f529a6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-13T14:00:00.000+00:00", "2021-04-28T13:59:59.000+00:00"],
            ["2021-04-13T14:00:00.000+00:00", "2021-04-28T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bc2c488a-e911-4fd0-a08a-ba0bf217c6c0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c82c1468-b0fb-4336-a28d-7ece6612d206",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "cbb62811-b5c8-418e-92b9-1e3c164d71e8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "cd8083bc-a43b-49be-ab77-a06fdc2ee71d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0cf402d8-6e20-4831-80e0-393e3911223f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0f253f27-26b1-4dca-8945-a7f5ad6edb62",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "17a94733-becb-493e-849c-945dfcc80e1e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-08T07:25:00.000+00:00", "2019-03-22T07:15:00.000+00:00"],
            ["2019-03-08T07:25:00.000+00:00", "2019-03-22T07:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1ae13837-06d4-47dc-8f55-c8168559f4db",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-04-29T14:00:00.000+00:00", "2024-05-30T13:59:59.000+00:00"],
            ["2024-04-29T14:00:00.000+00:00", "2024-05-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "21cb2d1b-b216-4adf-8674-f0277fbd7c64",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2867c10d-cd0e-4cad-a042-9b24151df13f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-31T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
            ["2023-10-31T13:00:00.000+00:00", "2023-11-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "40ee6d26-2eaa-412b-925b-2165dc9a62f2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-06-06T14:00:00.000+00:00", "2024-07-02T13:59:59.000+00:00"],
            ["2024-06-06T14:00:00.000+00:00", "2024-07-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "47f78dc0-74b1-4e9a-8ce3-563914dad30c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-08T03:25:00.000+00:00", "2021-06-02T22:15:00.000+00:00"],
            ["2021-05-08T03:25:00.000+00:00", "2021-06-02T22:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5694419d-5ddf-44f9-99f8-e6b68b1e6a28",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-10-31T13:00:00.000+00:00", "2022-04-30T13:59:59.000+00:00"],
            ["2021-10-31T13:00:00.000+00:00", "2022-04-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6110799a-8e8a-459e-be60-2ac1cb4cb4b8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7277dc07-06c1-4ca7-bb25-dc0653da8730",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-04-29T14:00:00.000+00:00", "2024-05-30T13:59:59.000+00:00"],
            ["2024-04-29T14:00:00.000+00:00", "2024-05-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7dc0de0d-c192-40dc-91a9-c790b0ba94cc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8ad14791-41cf-466e-bc39-fe352a699511",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9a1cb82a-8fbe-4861-accb-7c94228da823",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9dbfafcb-1183-438a-81e9-2b716d608df3",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a5a0d038-bf2d-4b3d-b77a-d1b8adc4f132",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ac00c25d-e48a-4440-934e-85d210511b14",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ca76713b-7329-49bd-ac6d-c1c67dd99632",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-19T09:00:00.000+00:00", "2019-12-16T21:00:00.000+00:00"],
            ["2019-10-19T09:00:00.000+00:00", "2019-12-16T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "021b494f-aa31-4dd4-8c10-9afad74da1aa",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-08T22:25:00.000+00:00", "2019-09-28T22:15:00.000+00:00"],
            ["2019-09-08T22:25:00.000+00:00", "2019-09-28T22:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "17838830-9bca-46f0-ba28-04da97b771a7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "19e3bd09-07f7-45c9-b7e1-d7451d68c863",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "24032fd2-249f-4b35-91fd-9aadee04ebe3",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-20T13:00:00.000+00:00", "2023-11-18T12:59:59.000+00:00"],
            ["2020-11-20T13:00:00.000+00:00", "2023-11-18T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "31c17771-78ba-435f-b0db-338ed9278392",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "32255707-0ecc-4533-bab7-e79d52b71b98",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "57f6ffc8-b686-4fd4-a655-664818560c97",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6f53f6f3-8f46-4cbf-9cab-28cdde8db631",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-09T14:00:00.000+00:00", "2022-09-16T13:59:59.000+00:00"],
            ["2022-09-09T14:00:00.000+00:00", "2022-09-16T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "755327c7-e998-480a-987a-9cb52d8ce14a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7986f87b-75fe-4318-8e57-2baecd0a5415",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7c95b3bd-34c9-41d3-81d9-976252c9aef2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-05T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
            ["2023-01-05T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "99963304-cabf-4f23-91ff-1df4805d52df",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-06-06T14:00:00.000+00:00", "2024-07-02T13:59:59.000+00:00"],
            ["2024-06-06T14:00:00.000+00:00", "2024-07-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_4518_TEMPO_Seabird_Observations",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_4600_TEMPO_Cetacean_Observations",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_KOMBI_2021_Echo",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-20T13:00:00.000+00:00", null],
            ["2021-02-20T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_TEMPOCTDcamera_benthicID",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-11T13:00:00.000+00:00", "2021-03-12T12:59:59.000+00:00"],
            ["2021-02-11T13:00:00.000+00:00", "2021-03-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_TEMPO_bioacoustics",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-12T13:00:00.000+00:00", "2021-03-11T12:59:59.000+00:00"],
            ["2021-02-12T13:00:00.000+00:00", "2021-03-11T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_TEMPO_zooplankton",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-12T13:00:00.000+00:00", "2021-03-11T12:59:59.000+00:00"],
            ["2021-02-12T13:00:00.000+00:00", "2021-03-11T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4528_Multi_Shelf",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-10-31T13:00:00.000+00:00", "2023-10-01T12:59:59.000+00:00"],
            ["2022-10-31T13:00:00.000+00:00", "2023-10-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4528_RIS",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-28T13:00:00.000+00:00", "2022-04-01T12:59:59.000+00:00"],
            ["2021-02-28T13:00:00.000+00:00", "2022-04-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4556_Adelie_Diet_Mawson_DNA",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2014-11-30T13:00:00.000+00:00", "2020-06-30T13:59:59.000+00:00"],
            ["2014-11-30T13:00:00.000+00:00", "2015-02-28T12:59:59.000+00:00"],
            ["2017-11-30T13:00:00.000+00:00", "2018-02-28T12:59:59.000+00:00"],
            ["2019-07-30T14:00:00.000+00:00", "2020-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4556_V1_eDNA_COI_metabarcoding_data_Nester",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-21T13:00:00.000+00:00", "2019-11-09T12:59:59.000+00:00"],
            ["2019-10-21T13:00:00.000+00:00", "2019-11-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4556_V1_eDNA_metabarcoding_raw_sequencing_data",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-15T13:00:00.000+00:00", "2019-11-26T12:59:59.000+00:00"],
            ["2019-11-15T13:00:00.000+00:00", "2019-11-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4567_LIP_rifting_study",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-30T14:00:00.000+00:00", "2023-06-30T13:59:59.000+00:00"],
            ["2019-06-30T14:00:00.000+00:00", "2023-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4593_WW3_DavisSea_2020",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-26T13:00:00.000+00:00", "2020-02-14T12:59:59.000+00:00"],
            ["2019-12-26T13:00:00.000+00:00", "2020-02-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BAS_Gentoo_Diet",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-02T13:00:00.000+00:00", "2019-09-19T13:59:59.000+00:00"],
            ["2019-04-02T13:00:00.000+00:00", "2019-09-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a2a9f977-cd4e-4c81-91d8-7f00ab3c7bf7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "abf77c7b-7ecb-4515-81e5-b6cd53e03033",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-12T13:00:00.000+00:00", "2020-03-20T12:59:59.000+00:00"],
            ["2020-03-12T13:00:00.000+00:00", "2020-03-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b1924193-3325-4a85-abf4-bca6bb222e8d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-20T00:00:00.000+00:00", "2021-11-27T21:15:00.000+00:00"],
            ["2021-11-20T00:00:00.000+00:00", "2021-11-27T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b94c8fc7-13c0-44b2-a3e1-a3921d7f3548",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-19T09:00:00.000+00:00", "2019-11-18T21:00:00.000+00:00"],
            ["2019-10-19T09:00:00.000+00:00", "2019-11-18T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b9f6e71a-3118-42bc-bba8-565dc4d1f276",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bec2d562-c76d-4fe0-a8d2-cad4544659ad",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-08T02:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
            ["2020-10-08T02:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c276a75f-f6bd-4126-8cd4-6e5be72e3335",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-13T21:00:00.000+00:00", "2019-04-04T21:00:00.000+00:00"],
            ["2019-03-13T21:00:00.000+00:00", "2019-04-04T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0d63f685-18bb-4375-824e-3c022af14e9b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "11ec94aa-6dc2-4ad9-b183-e18291a9e2e7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-14T13:00:00.000+00:00", "2021-12-20T12:59:59.000+00:00"],
            ["2021-12-14T13:00:00.000+00:00", "2021-12-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "201920011",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-30T13:00:00.000+00:00", "2019-12-16T12:59:59.000+00:00"],
            ["2019-11-30T13:00:00.000+00:00", "2019-12-16T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "230e5cc9-d126-4542-b5e7-f2c44eec6c81",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-28T19:25:00.000+00:00", "2019-05-09T05:15:00.000+00:00"],
            ["2019-04-28T19:25:00.000+00:00", "2019-05-09T05:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "324e897f-c313-4b27-a0ad-62694574f7d5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-13T13:00:00.000+00:00", "2023-12-19T12:59:59.000+00:00"],
            ["2023-11-13T13:00:00.000+00:00", "2023-12-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "55f95b9b-1b70-4625-8534-b47d34530ed8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6380173c-170c-4b54-8746-dfcf50d2ca8f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-13T21:00:00.000+00:00", "2019-04-04T21:00:00.000+00:00"],
            ["2019-03-13T21:00:00.000+00:00", "2019-04-04T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "644129fe-8671-4d1a-9abe-7af7aba8fc6e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-30T13:00:00.000+00:00", null],
            ["2019-11-30T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "65933fc8-cbd0-48b9-b89a-ab10d98171ed",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-03T22:25:00.000+00:00", "2019-10-13T21:15:00.000+00:00"],
            ["2019-10-03T22:25:00.000+00:00", "2019-10-13T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "77ae7ea0-15ef-4eef-af3e-5f0becf4796e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-08T02:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
            ["2020-10-08T02:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "79e55ebd-315a-4f82-b00f-8c4bc9e9bdd8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-04T14:00:00.000+00:00", "2023-07-18T13:59:59.000+00:00"],
            ["2023-07-04T14:00:00.000+00:00", "2023-07-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7d59b23b-05e3-4946-ae99-19a2802c90dc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "84cb1709-a669-4f2c-b97b-5eceb7929349",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-12-01T13:00:00.000+00:00", "2023-08-26T13:59:59.000+00:00"],
            ["2022-12-01T13:00:00.000+00:00", "2023-08-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8bba3eac-999a-4a14-8fb4-72ce8cee1e79",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8f007712-6a2b-4007-9529-9bd72dd37ca0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-12-31T13:00:00.000+00:00", "2025-01-15T12:59:59.000+00:00"],
            ["2024-12-31T13:00:00.000+00:00", "2025-01-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9e75e657-685e-4fe2-b2af-959423f8c841",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4578_CTD_HIMI",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-05-01T14:00:00.000+00:00", "2021-12-10T12:59:59.000+00:00"],
            ["2020-05-01T14:00:00.000+00:00", "2021-12-10T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "NESP_2021_SRW",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-11T14:00:00.000+00:00", "2021-08-17T13:59:59.000+00:00"],
            ["2021-08-11T14:00:00.000+00:00", "2021-08-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "PENGUIN_DET_VAPCOL",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-07T13:00:00.000+00:00", "2021-02-08T12:59:59.000+00:00"],
            ["2021-02-07T13:00:00.000+00:00", "2021-02-08T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a9e170f4-2331-40be-9abe-9c1c463e5945",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-07T21:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
            ["2020-10-07T21:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c5dc4abc-7003-4974-9b2b-ffd87c1f5a1d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c6dd1c05-8f05-4a20-bfe0-508dce461abf",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-22T21:00:00.000+00:00", "2020-01-02T02:30:00.000+00:00"],
            ["2019-12-22T21:00:00.000+00:00", "2020-01-02T02:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0267b46b-d5b2-470c-a03c-6754dd2edd33",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-14T04:16:00.000+00:00", "2021-09-16T02:15:00.000+00:00"],
            ["2021-09-14T04:16:00.000+00:00", "2021-09-16T02:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "074180bf-6bdc-4e2b-b0e5-d5eb903efc70",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-02T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "164dcfb8-4608-4eda-93ba-55b2ff15d352",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-02T05:51:00.000+00:00", "2021-02-02T19:55:00.000+00:00"],
            ["2021-02-02T05:51:00.000+00:00", "2021-02-02T19:55:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "189011be-6a3d-4cf4-8263-f7281b4d58a4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-22T13:00:00.000+00:00", "2023-04-14T13:59:59.000+00:00"],
            ["2023-03-22T13:00:00.000+00:00", "2023-04-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1d600bda-2e61-48e5-b8b6-21f036654589",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-09T21:50:00.000+00:00", "2019-09-11T02:34:00.000+00:00"],
            ["2019-09-09T21:50:00.000+00:00", "2019-09-11T02:34:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "201819040",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-04T13:00:00.000+00:00", "2019-03-25T12:59:59.000+00:00"],
            ["2019-03-04T13:00:00.000+00:00", "2019-03-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "201920030",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-20T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
            ["2020-01-20T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "201920040",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-09T13:00:00.000+00:00", "2020-03-25T12:59:59.000+00:00"],
            ["2020-03-09T13:00:00.000+00:00", "2020-03-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2620eb79-2133-4a58-aa5c-c28eb71c0d71",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-13T21:25:00.000+00:00", "2019-04-04T21:15:00.000+00:00"],
            ["2019-03-13T21:25:00.000+00:00", "2019-04-04T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3087fe65-c1d0-4e95-a4f4-33a8e873666b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-14T14:00:00.000+00:00", "2019-06-25T13:59:59.000+00:00"],
            ["2019-06-14T14:00:00.000+00:00", "2019-06-25T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "312d2e4f-aeb1-4126-a975-7b7df0d27554",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "36ca4dbc-45f9-43b2-87f9-cc43519c496a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-26T20:53:00.000+00:00", "2019-11-27T03:22:00.000+00:00"],
            ["2019-11-26T20:53:00.000+00:00", "2019-11-27T03:22:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3a789605-4574-41b7-99a0-da68233189bd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "434bed35-991b-414f-bd4b-04c7267a39be",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-10T14:00:00.000+00:00", "2019-04-23T13:59:59.000+00:00"],
            ["2019-04-10T14:00:00.000+00:00", "2019-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "44ba6c07-d533-4ef8-9ef4-85eff8e020e5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "45e19048-1195-475c-a4f0-170adbec5c4d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-06-05T14:00:00.000+00:00", "2023-10-31T12:59:59.000+00:00"],
            ["2022-06-05T14:00:00.000+00:00", "2023-10-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "50ddef08-268e-47ba-b3a7-86c5e51fd008",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-13T13:00:00.000+00:00", "2019-04-04T12:59:59.000+00:00"],
            ["2019-03-13T13:00:00.000+00:00", "2019-04-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "55cbe84a-d809-4c97-80dd-1f698eb4c345",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-23T19:55:00.000+00:00", "2020-11-25T19:31:00.000+00:00"],
            ["2020-11-23T19:55:00.000+00:00", "2020-11-25T19:31:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5956fd44-f864-4811-9ec3-15499f1863c4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-22T13:00:00.000+00:00", "2020-07-17T13:59:59.000+00:00"],
            ["2019-11-22T13:00:00.000+00:00", "2020-07-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5f339fcd-5b2f-4473-9171-2b5e89d7b604",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-14T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
            ["2022-03-14T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "66d65863-a20a-43c8-8a85-262d567c0b0d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-06-06T14:00:00.000+00:00", "2024-07-02T13:59:59.000+00:00"],
            ["2024-06-06T14:00:00.000+00:00", "2024-07-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6e1f126c-e0cb-4e88-92af-48cd4dc9c15f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6e41e271-70f0-4e30-b52d-82f016a5a395",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-05T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
            ["2023-01-05T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "793a212c-b39a-4b21-bf8e-d296ee1a2d1a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-03T23:02:00.000+00:00", "2020-02-05T01:37:00.000+00:00"],
            ["2020-02-03T23:02:00.000+00:00", "2020-02-05T01:37:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7a6b336d-b551-406a-827f-1d1219b4b363",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "81462d21-c572-48d1-95a4-56bdee47892a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "81850433-c38d-448a-acf2-f50613855e65",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-06-06T14:00:00.000+00:00", "2024-07-02T13:59:59.000+00:00"],
            ["2024-06-06T14:00:00.000+00:00", "2024-07-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8327fb65-1614-4c14-ba5d-903f9aa37919",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-07-07T14:00:00.000+00:00", "2024-07-15T13:59:59.000+00:00"],
            ["2024-07-07T14:00:00.000+00:00", "2024-07-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "842d8e6f-1c23-4879-991c-e0ae607e68cd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "86291d6f-3f49-4ef0-8e91-68a447475dc6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-05-27T07:28:00.000+00:00", "2020-05-27T07:28:00.000+00:00"],
            ["2020-05-27T07:28:00.000+00:00", "2020-05-27T07:28:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "879d03d6-5808-4d74-97ac-7415f3fdd2f1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-08T13:00:00.000+00:00", "2021-12-04T12:59:59.000+00:00"],
            ["2021-11-08T13:00:00.000+00:00", "2021-12-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8ad3c251-bc61-4441-9603-49b97182538e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-10-26T13:00:00.000+00:00", "2024-11-06T12:59:59.000+00:00"],
            ["2024-10-26T13:00:00.000+00:00", "2024-11-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8afd17e9-c8af-4c27-9b8a-4bee8140b6f4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-04T23:32:00.000+00:00", "2021-05-06T05:17:00.000+00:00"],
            ["2021-05-04T23:32:00.000+00:00", "2021-05-06T05:17:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9435d1de-befb-4a16-b98d-2654bebf9e93",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-13T13:00:00.000+00:00", "2019-04-04T12:59:59.000+00:00"],
            ["2019-03-13T13:00:00.000+00:00", "2019-04-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9534d3b0-64bf-415b-97c2-47156be6111b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4593_IB_2020_Casey",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-12T13:00:00.000+00:00", "2021-11-10T12:59:59.000+00:00"],
            ["2020-10-12T13:00:00.000+00:00", "2021-11-10T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4593_WB_IB_2020_all_data",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-06T13:00:00.000+00:00", "2020-03-10T12:59:59.000+00:00"],
            ["2019-12-06T13:00:00.000+00:00", "2020-03-10T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a790e243-8971-4c46-8493-7945c5d10484",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c1b8fcf4-3a06-45b7-aefb-d36df0a904bc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-26T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
            ["2022-05-26T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c27a9c39-cb65-4b04-acfb-1854908d55e7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-18T21:00:00.000+00:00", "2019-03-04T19:00:00.000+00:00"],
            ["2019-01-18T21:00:00.000+00:00", "2019-03-04T19:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c2d99945-ab15-4400-a101-d672839e934d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-14T05:30:00.000+00:00", "2019-06-13T22:00:00.000+00:00"],
            ["2019-05-14T05:30:00.000+00:00", "2019-06-13T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c5ae5231-01dc-4145-b229-9f72b2f9df43",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-04T14:00:00.000+00:00", "2023-07-18T13:59:59.000+00:00"],
            ["2023-07-04T14:00:00.000+00:00", "2023-07-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c69e36ce-f28b-4011-a201-6751825ed5e6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-28T14:00:00.000+00:00", "2019-05-09T13:59:59.000+00:00"],
            ["2019-04-28T14:00:00.000+00:00", "2019-05-09T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "00d65d56-d0d4-49a7-9d05-98ec29080598",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-18T13:00:00.000+00:00", "2019-03-05T12:59:59.000+00:00"],
            ["2019-01-18T13:00:00.000+00:00", "2019-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0cf003cd-52a2-45cf-8483-367b0ecd774f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "15623047-03cc-4749-9000-ee4dc1d4e718",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-18T21:00:00.000+00:00", "2019-03-04T19:00:00.000+00:00"],
            ["2019-01-18T21:00:00.000+00:00", "2019-03-04T19:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1726f3f0-aae5-4629-ab33-4b3aed304b98",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-18T21:00:00.000+00:00", "2019-03-04T19:00:00.000+00:00"],
            ["2019-01-18T21:00:00.000+00:00", "2019-03-04T19:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "201819030",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-12T13:00:00.000+00:00", "2019-03-01T12:59:59.000+00:00"],
            ["2019-01-12T13:00:00.000+00:00", "2019-03-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "201920010",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-24T13:00:00.000+00:00", "2019-11-27T12:59:59.000+00:00"],
            ["2019-10-24T13:00:00.000+00:00", "2019-11-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "201920020",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-21T13:00:00.000+00:00", "2020-01-17T12:59:59.000+00:00"],
            ["2019-12-21T13:00:00.000+00:00", "2020-01-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "21d5d995-74ce-4f05-8803-cdb21ede1274",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "22d27e9b-8b87-4c1e-901e-cf2a02e11a87",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-04-30T14:00:00.000+00:00", "2023-05-01T13:59:59.000+00:00"],
            ["2020-04-30T14:00:00.000+00:00", "2023-05-01T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "274590cc-b74a-4b05-848b-2bdf7b109a70",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3054fce1-689b-4520-97da-ab3fb9761268",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-03T13:00:00.000+00:00", "2021-01-15T12:59:59.000+00:00"],
            ["2020-12-03T13:00:00.000+00:00", "2021-01-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5f5f9f60-8296-4799-9eff-7bf676d9edd5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "607756fd-ed54-49fa-9d26-e4680afe8a68",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-14T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
            ["2022-03-14T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "62cd58ea-e9a9-4280-b9b8-176ccfc0aa66",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "64f38204-01ee-4ff0-a2f4-5de3c6b0f2ca",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-04T00:25:00.000+00:00", "2019-10-14T02:15:00.000+00:00"],
            ["2019-10-04T00:25:00.000+00:00", "2019-10-14T02:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "65e6086e-7b21-42c0-99d9-85498cf6b407",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6d0b2e74-8474-4e30-9d3c-4969105b1488",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6e61127a-9972-4635-b314-0f5279e60b56",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-04T00:25:00.000+00:00", "2019-10-14T02:15:00.000+00:00"],
            ["2019-10-04T00:25:00.000+00:00", "2019-10-14T02:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6faa97e9-6aea-4a94-b117-2e7745c371ad",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-22T21:00:00.000+00:00", "2020-01-02T02:00:00.000+00:00"],
            ["2019-12-22T21:00:00.000+00:00", "2020-01-02T02:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "736d0521-f2ce-4dd3-82fe-c2423d7b02a1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "74e3c538-66b9-4c0f-96c3-962aca171067",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7aa42acf-c3a4-46bc-ae99-f20567ac78fe",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-14T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
            ["2022-03-14T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7c740c94-350f-4ed0-b1f3-a8e673a63124",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-04-29T14:00:00.000+00:00", "2024-05-30T13:59:59.000+00:00"],
            ["2024-04-29T14:00:00.000+00:00", "2024-05-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8eef824e-d30a-4cc4-beed-416d14d8ec3d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9684bba2-a80c-4673-b791-930e10f45205",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-29T14:00:00.000+00:00", "2021-07-29T13:59:59.000+00:00"],
            ["2021-06-29T14:00:00.000+00:00", "2021-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "96f16fe3-7de6-456b-b7d3-65e6b515f3de",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-03T13:00:00.000+00:00", "2020-02-04T12:59:59.000+00:00"],
            ["2020-02-03T13:00:00.000+00:00", "2020-02-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9acc9227-9b0f-401e-a904-0da573d35251",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9caf5def-fd18-4e61-898e-988ac036067a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4600_Cetacean_acoustic_presence",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_5097_DAP_nearshore_benthic_DNA_metabarcoding",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-12T13:00:00.000+00:00", "2019-12-14T12:59:59.000+00:00"],
            ["2019-11-12T13:00:00.000+00:00", "2019-12-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a3a1ee71-68c6-4831-b4ea-bedbbec43d0c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-26T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
            ["2022-05-26T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b4577435-c80b-4a8e-aefd-387494d6409b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b595c294-6cb9-40d5-819d-9056c703b4bb",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b5cdff98-1511-4ab9-b7d8-64d4b5599422",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bf974bd4-bf7c-4f50-8992-d07c482a9345",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-07T22:00:00.000+00:00", "2021-06-02T22:15:00.000+00:00"],
            ["2021-05-07T22:00:00.000+00:00", "2021-06-02T22:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c4481263-85ed-48f0-a9eb-4cf853558f0c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "cae8f6d6-176f-4e00-a5f3-1429658f6069",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-09T00:00:00.000+00:00", "2019-09-30T03:00:00.000+00:00"],
            ["2019-09-09T00:00:00.000+00:00", "2019-09-30T03:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03c72baa-8d30-47cd-89c5-c9ec6e6c8cc1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-18T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
            ["2022-03-18T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "049ab2f7-e03b-440e-a148-e3749f7facb0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "09d0c67b-5624-4818-ba05-b1eba3fdd058",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-13T14:00:00.000+00:00", "2021-04-28T13:59:59.000+00:00"],
            ["2021-04-13T14:00:00.000+00:00", "2021-04-28T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0dd3832a-cf67-4068-a446-a9c91c77273e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-17T14:00:00.000+00:00", null],
            ["2019-04-17T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "11d7680e-6224-4a46-8e84-d6d6a59eef2b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-14T14:00:00.000+00:00", "2019-06-25T13:59:59.000+00:00"],
            ["2019-06-14T14:00:00.000+00:00", "2019-06-25T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "13f63aa6-f250-4242-ab33-70f22ffe14b6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "21983bb9-eba3-43a3-89e8-8677733d10b9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-09T14:00:00.000+00:00", "2022-09-16T13:59:59.000+00:00"],
            ["2022-09-09T14:00:00.000+00:00", "2022-09-16T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "24cf07d4-a8c7-4843-8e90-1bcc2cf635aa",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-19T13:00:00.000+00:00", "2021-11-28T12:59:59.000+00:00"],
            ["2021-11-19T13:00:00.000+00:00", "2021-11-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2df4eb87-e86a-40dd-927f-4e4be97e1a98",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-07-07T14:00:00.000+00:00", "2024-07-15T13:59:59.000+00:00"],
            ["2024-07-07T14:00:00.000+00:00", "2024-07-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "37d53105-7d85-4509-a948-d28c73c0e2d7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4239d036-88c4-4196-9705-186c77510853",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "42f1fb90-c19a-4a43-9bf5-76b75a5317e3",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "430e7455-9280-4a2e-924c-90777f77968f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4b24306f-b6f4-426e-a087-017c37598be4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5030a0d0-007c-477c-b8cb-dc373b6d36da",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-28T19:25:00.000+00:00", "2019-05-09T05:15:00.000+00:00"],
            ["2019-04-28T19:25:00.000+00:00", "2019-05-09T05:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "51890ff6-19a6-4a7f-931e-bf781d292f9c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "53494b27-498c-487d-8dbd-8ae033bd19d4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "55e40c6b-e37f-4c51-9e9c-f30dc8637af6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-29T14:00:00.000+00:00", "2021-07-29T13:59:59.000+00:00"],
            ["2021-06-29T14:00:00.000+00:00", "2021-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5a50433a-6411-4881-84bf-ee2b7dca76fc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5ad87c65-c469-4b66-b22b-e250477379fc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-16T14:00:00.000+00:00", "2019-06-05T13:59:59.000+00:00"],
            ["2019-05-16T14:00:00.000+00:00", "2019-06-05T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "606f6db7-91f6-4b6b-841b-202e6db8fb7a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-30T14:00:00.000+00:00", "2022-09-01T13:59:59.000+00:00"],
            ["2021-09-30T14:00:00.000+00:00", "2022-09-01T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6a0bc193-df9c-4a05-a65f-e5da7f420aa2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6b4f7c8f-0d36-49a6-b7f7-0bd32bf1b907",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-14T05:30:00.000+00:00", "2019-05-15T03:50:00.000+00:00"],
            ["2019-05-14T05:30:00.000+00:00", "2019-05-15T03:50:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "71e8d4b0-4fe5-4dc0-ba2a-9570d11fc428",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7996db59-f77b-466a-9f20-d77634a1c173",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
            ["2023-06-26T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7b716c05-c8a7-43cf-8ef8-c07204812bf2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-05-10T14:00:00.000+00:00", "2023-05-25T13:59:59.000+00:00"],
            ["2023-05-10T14:00:00.000+00:00", "2023-05-25T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "837091b5-e87c-416e-a82a-aed4f1682543",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "917bb1f1-14d5-4585-a0b6-c52710740a19",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-19T20:15:00.000+00:00", "2019-03-21T01:10:00.000+00:00"],
            ["2019-03-19T20:15:00.000+00:00", "2019-03-21T01:10:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "918792b2-7d26-417f-b279-606d1a7868fc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-04-27T14:00:00.000+00:00", "2023-09-04T13:59:59.000+00:00"],
            ["2023-04-27T14:00:00.000+00:00", "2023-09-04T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "96435a2d-6c0c-42dc-940c-931d2d34d335",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9e378eda-c7f1-4275-9616-12a31f2c2f0a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4593_WB_IB_2020_S",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-31T13:00:00.000+00:00", "2020-01-08T12:59:59.000+00:00"],
            ["2019-12-31T13:00:00.000+00:00", "2020-01-08T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b7ca62b7-ee3d-43da-bac9-1448c38ed33e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bc903fdd-5ebc-4ba6-a57f-78471373b62a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c1b2bbd0-2e49-45cd-a7ed-592784e124e3",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-18T13:00:00.000+00:00", "2019-03-05T12:59:59.000+00:00"],
            ["2019-01-18T13:00:00.000+00:00", "2019-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c387093e-29c5-43bd-878e-39e0bc15cb3d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-04T14:00:00.000+00:00", "2023-07-18T13:59:59.000+00:00"],
            ["2023-07-04T14:00:00.000+00:00", "2023-07-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ccd12c23-eeee-44d3-b41b-8ef02c8dd0d2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0b91d7fd-7d29-452f-954a-78cf75151035",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-15T14:00:00.000+00:00", null],
            ["2019-08-15T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "106a89bb-66e8-4ea2-9475-a29052a45dd1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2b251e01-6cc7-434e-bfaa-bbf691faa8a2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2e28fee8-e28a-42f5-bdd3-58e6b9070ecb",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "337e3725-ccd0-4269-82c2-ff7cb41b18d9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "39875712-0afc-431c-abdb-cfffbfebffd2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-07T21:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
            ["2020-10-07T21:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3bbb16fc-ecbe-4ad7-9f5d-74e5e052714c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-13T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
            ["2019-05-13T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3d070b7e-e3c5-4e37-8660-f75d6455eeb7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-22T21:00:00.000+00:00", "2020-01-02T02:00:00.000+00:00"],
            ["2019-12-22T21:00:00.000+00:00", "2020-01-02T02:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3d088dc9-6e9d-40ce-94d7-c40d9b89e44f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "54aeb6aa-c280-41d0-9b73-d14572ba2d39",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5b94ecdf-f4de-477a-8bae-fef423722a1d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
            ["2019-09-08T14:00:00.000+00:00", "2019-09-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5c45190a-d8cc-4552-a9e8-5a973d1d3296",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-04-29T14:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
            ["2020-04-29T14:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5f359ca7-396a-4c1a-8388-77a50ad39859",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "760256f6-3f77-4c3b-a2c6-e87d485b32fb",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-06T14:00:00.000+00:00", "2019-09-03T13:59:59.000+00:00"],
            ["2019-08-06T14:00:00.000+00:00", "2019-09-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "76ad2be4-fc8f-4f7b-8369-acbc0abcbaef",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-14T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
            ["2022-03-14T13:00:00.000+00:00", "2022-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "77199302-f841-4d07-902b-b45c633276ab",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-05-30T13:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-05-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7911959f-e5af-4c78-b7e8-7c2092910f82",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-10T14:00:00.000+00:00", "2019-04-23T13:59:59.000+00:00"],
            ["2019-04-10T14:00:00.000+00:00", "2019-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7b06f77f-dea1-4972-8092-f4219c20897f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-04T14:00:00.000+00:00", "2023-06-18T13:59:59.000+00:00"],
            ["2023-06-04T14:00:00.000+00:00", "2023-06-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7c0eb3ae-c987-46e8-9930-5986d5dd8df2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8b493074-2ad6-4bd6-aa26-d24bd80c65e8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-04T00:25:00.000+00:00", "2019-10-14T02:15:00.000+00:00"],
            ["2019-10-04T00:25:00.000+00:00", "2019-10-14T02:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8f44f09a-07a3-4f9b-ba26-2fc4983fef69",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9b71e0a7-b665-421d-b025-0f0b3c2e0749",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4496_SMP_23",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-31T13:00:00.000+00:00", "2023-11-30T12:59:59.000+00:00"],
            ["2023-10-31T13:00:00.000+00:00", "2023-11-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_TEMPO_Phytoplankton_Pigments",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-12T13:00:00.000+00:00", "2024-03-12T12:59:59.000+00:00"],
            ["2021-02-12T13:00:00.000+00:00", "2024-03-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_TEMPO_SwarmStudy_3D_Krill_trajectories",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4600_Video_Tracking2019",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-18T13:00:00.000+00:00", "2019-03-05T12:59:59.000+00:00"],
            ["2019-01-18T13:00:00.000+00:00", "2019-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "DNS_subglacial_discharge",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-31T13:00:00.000+00:00", "2020-02-20T12:59:59.000+00:00"],
            ["2020-01-31T13:00:00.000+00:00", "2020-02-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a5b71834-6cf0-40ab-842e-a868017bf162",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-05T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
            ["2023-01-05T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "aa8d41dc-4e5e-4d19-b1d0-c4b69445f799",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-29T13:00:00.000+00:00", "2025-02-28T12:59:59.000+00:00"],
            ["2024-02-29T13:00:00.000+00:00", "2025-02-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ad33b745-a60c-4b7b-9ee3-f06116c62ddd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-30T13:00:00.000+00:00", "2021-12-08T12:59:59.000+00:00"],
            ["2021-11-30T13:00:00.000+00:00", "2021-12-08T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "afec4687-1f0d-4c9b-a81b-a85f349296d2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b03e8b87-7e43-4152-9a2c-6b1aa6ae9296",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-31T14:00:00.000+00:00", "2022-09-30T13:59:59.000+00:00"],
            ["2022-07-31T14:00:00.000+00:00", "2022-09-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b472359a-5720-4ff3-8c1f-9a34d79a149a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-24T13:00:00.000+00:00", "2023-03-02T12:59:59.000+00:00"],
            ["2023-01-24T13:00:00.000+00:00", "2023-03-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b4e4c741-0df7-4681-aa1f-3b2f85f0a736",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-22T13:00:00.000+00:00", "2023-04-29T13:59:59.000+00:00"],
            ["2023-03-22T13:00:00.000+00:00", "2023-04-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b85b2c7d-4631-477a-9217-2cae65f9cf0a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b9b978c4-410f-4d4c-9960-91582a997a95",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-13T13:00:00.000+00:00", "2019-04-04T12:59:59.000+00:00"],
            ["2019-03-13T13:00:00.000+00:00", "2019-04-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "e39a7af3-0c0e-4f32-bfc3-9f720b5d1171",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-31T13:00:00.000+00:00", null],
            ["2023-01-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "017c1557-7617-439d-884d-af22ec9beb3d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0774058f-e201-47c7-8509-23db20b9452f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0c06e0a9-4d49-451f-8c6a-9cba460d53f8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0fe29a80-b529-4230-8878-fe088d799ee1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-02T13:00:00.000+00:00", "2022-02-09T12:59:59.000+00:00"],
            ["2021-11-02T13:00:00.000+00:00", "2022-02-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "13d03ff2-814d-49ec-923c-ddfa667308a4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
            ["2022-09-10T14:00:00.000+00:00", "2022-09-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "15881795-b5fd-4a9d-83e5-8c072e0abd57",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-07-07T14:00:00.000+00:00", "2024-07-15T13:59:59.000+00:00"],
            ["2024-07-07T14:00:00.000+00:00", "2024-07-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "15a228af-b9d7-4e6e-89b5-5ef46e10f5a2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1bbd1e38-cdc1-4b44-80d2-7bec67356f58",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-05-10T14:00:00.000+00:00", "2023-05-25T13:59:59.000+00:00"],
            ["2023-05-10T14:00:00.000+00:00", "2023-05-25T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1dc5d11c-8730-45c7-ad85-2d614ffe5303",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1df37d25-6e72-40cb-9e72-d915423267f1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-14T07:30:00.000+00:00", "2019-06-13T22:00:00.000+00:00"],
            ["2019-05-14T07:30:00.000+00:00", "2019-06-13T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2a272ecd-e134-48ba-9ae7-c7607721f52d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-03T13:00:00.000+00:00", "2026-03-27T12:59:59.000+00:00"],
            ["2024-03-03T13:00:00.000+00:00", "2026-03-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "310a6a24-ed40-4672-a6c4-49f5e0e56e86",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3218f9af-1665-4e0b-ad72-71d3dd50b5d9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-28T19:25:00.000+00:00", "2019-05-09T05:15:00.000+00:00"],
            ["2019-04-28T19:25:00.000+00:00", "2019-05-09T05:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "34e6d699-a651-4f67-8bb7-6cc741f2b8ce",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-08T02:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
            ["2020-10-08T02:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "40dbdd6c-7574-45d2-9a0c-c7dfaebee82e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "49add25b-c9f7-4e6d-9407-376cbea45786",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-16T14:00:00.000+00:00", "2020-09-02T13:59:59.000+00:00"],
            ["2019-07-16T14:00:00.000+00:00", "2020-09-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4cbd1eef-db14-4005-bc14-986c22c00d74",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4e4ae69d-6d5a-4869-96de-5162513a7678",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "50f6ce92-1fd0-4f7d-b3f3-a3b2fae6ee4f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "60fa24d6-9e7f-4f79-a4a7-08ea9db408e4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
            ["2024-03-08T13:00:00.000+00:00", "2024-03-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6249ea2c-b291-4dbc-be89-cfd61765899e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6551b261-0ebc-42d9-bae1-bbffc1401418",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6574e8f7-5a1d-4fe6-a0b9-405e3baa9c82",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-06-06T14:00:00.000+00:00", "2024-07-03T13:59:59.000+00:00"],
            ["2024-06-06T14:00:00.000+00:00", "2024-07-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6b7f88c1-5b00-4aac-8032-5d490d029d65",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6d52dc67-0c0d-467f-9b4c-a31bef126087",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-12T13:00:00.000+00:00", "2020-11-22T12:59:59.000+00:00"],
            ["2020-11-12T13:00:00.000+00:00", "2020-11-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6f3f0a5a-aedc-4421-90a5-06a61569b785",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-20T00:00:00.000+00:00", "2021-11-27T21:15:00.000+00:00"],
            ["2021-11-20T00:00:00.000+00:00", "2021-11-27T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7f04d8cb-9594-40d2-adfd-7b44ac7c46e7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
            ["2023-11-14T13:00:00.000+00:00", "2023-12-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "83194258-e1f9-49f1-9e84-90df234f146c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-19T09:00:00.000+00:00", "2019-12-16T21:00:00.000+00:00"],
            ["2019-10-19T09:00:00.000+00:00", "2019-12-16T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "867cd002-d08b-4c1b-8262-99acfa3e6d23",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-03T13:00:00.000+00:00", "2021-01-15T12:59:59.000+00:00"],
            ["2020-12-03T13:00:00.000+00:00", "2021-01-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8e00907f-716d-4080-b212-534fcd78a602",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "924ac7dd-0f3f-46a7-8724-5beef70d946d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-19T14:00:00.000+00:00", "2019-08-02T13:59:59.000+00:00"],
            ["2019-07-19T14:00:00.000+00:00", "2019-08-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "93b6a16d-4912-4743-b6c0-77a4300622de",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9db818be-cec5-4972-9bd3-e606b43f13be",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-22T21:00:00.000+00:00", "2020-01-02T02:30:00.000+00:00"],
            ["2019-12-22T21:00:00.000+00:00", "2020-01-02T02:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4519_IN2020_V01_MCS",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a52ca730-cccf-44e3-81e5-062515823ebe",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-08T14:00:00.000+00:00", "2019-09-28T14:00:00.000+00:00"],
            ["2019-09-08T14:00:00.000+00:00", "2019-09-28T14:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a8831928-fb5a-4bf1-8e72-a8342f5e2836",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ac641641-a694-4697-b65b-b57b8b57ee54",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-27T14:00:00.000+00:00", "2020-09-12T13:59:59.000+00:00"],
            ["2020-08-27T14:00:00.000+00:00", "2020-09-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b11db6a4-4a2c-4779-8f24-0766b5f9033f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b9989ff0-dd7f-4b14-8d7d-7905be7ecbb4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-12T13:00:00.000+00:00", "2020-11-22T12:59:59.000+00:00"],
            ["2020-11-12T13:00:00.000+00:00", "2020-11-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ba5e8bc9-9c58-4bf1-beec-e0649a6cb2c2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-04-30T14:00:00.000+00:00", "2024-05-31T13:59:59.000+00:00"],
            ["2024-04-30T14:00:00.000+00:00", "2024-05-31T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bae1a323-b8e8-4991-9d32-7869059d9964",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bb523fca-319d-48cd-b3ab-dd1abd6710a5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-03T14:00:00.000+00:00", "2022-05-15T13:59:59.000+00:00"],
            ["2022-05-03T14:00:00.000+00:00", "2022-05-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "beaf3cf3-1297-440d-b31a-3beefb40bd56",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-11T14:00:00.000+00:00", "2020-06-12T13:59:59.000+00:00"],
            ["2019-06-11T14:00:00.000+00:00", "2020-06-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c24d0593-2c53-47d3-a6d1-2e5456dd7e16",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c4d87503-fa92-4221-bc38-026e120553de",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-23T13:00:00.000+00:00", "2023-04-30T13:59:59.000+00:00"],
            ["2023-03-23T13:00:00.000+00:00", "2023-04-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "cbda74d7-c81b-499f-bccf-c4488e8743b8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
            ["2022-08-14T14:00:00.000+00:00", "2022-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0baee321-e360-43e5-8573-c695138c9e28",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "16a9fac0-6dff-49ed-8c76-c4bdbf9e3207",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "232719a6-b3b8-4c2a-9e78-d13c0715192b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-18T13:00:00.000+00:00", "2019-03-05T12:59:59.000+00:00"],
            ["2019-01-18T13:00:00.000+00:00", "2019-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2b0f816a-ef74-43bf-815d-f760f0bb2645",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-07T21:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
            ["2020-10-07T21:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3800cb48-a30b-4994-bd30-6db016a4cb79",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4d4fdf3f-8f90-4f36-bc30-0c18c9525d96",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-14T05:30:00.000+00:00", "2019-06-13T22:00:00.000+00:00"],
            ["2019-05-14T05:30:00.000+00:00", "2019-06-13T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5086b536-6b2a-4244-992e-b4f2ae46822e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-24T13:00:00.000+00:00", "2030-12-31T12:59:59.000+00:00"],
            ["2020-02-24T13:00:00.000+00:00", "2030-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "53c464cb-aebb-43b7-b20d-d2f3936d497f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "57c6ca66-1005-4329-baff-f3420d43498f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-13T21:25:00.000+00:00", "2019-04-04T21:15:00.000+00:00"],
            ["2019-03-13T21:25:00.000+00:00", "2019-04-04T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6e2c9466-417e-4970-b6b0-26e4aad225ae",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-03T14:00:00.000+00:00", "2019-10-14T12:59:59.000+00:00"],
            ["2019-10-03T14:00:00.000+00:00", "2019-10-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "728e51dd-768c-47a1-b94f-d5a0c86171aa",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "77a27a72-8a11-4d9a-8009-dce524925591",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-27T22:00:00.000+00:00", "2018-06-07T22:00:00.000+00:00"],
            ["2019-05-27T22:00:00.000+00:00", "2018-06-07T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "80ec3863-b7bb-4958-a268-40839517b3b0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8d951802-8eeb-4628-972d-cace60ae15ee",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-30T13:00:00.000+00:00", "2020-02-06T12:59:59.000+00:00"],
            ["2020-01-30T13:00:00.000+00:00", "2020-02-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8f11bb72-88d5-4954-8269-b571a2d708ba",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
            ["2024-03-30T13:00:00.000+00:00", "2024-04-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "NESP_2019_SRW",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-17T14:00:00.000+00:00", "2019-08-24T13:59:59.000+00:00"],
            ["2019-08-17T14:00:00.000+00:00", "2019-08-24T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ae93cd79-c4b5-44df-8d31-64c9132c41b6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-11T14:00:00.000+00:00", "2021-06-23T13:59:59.000+00:00"],
            ["2021-06-11T14:00:00.000+00:00", "2021-06-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c4e068b6-d251-45ff-bc26-79622b3791a8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-10T14:00:00.000+00:00", null],
            ["2019-04-10T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "022331ec-1ace-4988-8369-10264ce08f49",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-09T00:00:00.000+00:00", "2019-09-29T03:00:00.000+00:00"],
            ["2019-09-09T00:00:00.000+00:00", "2019-09-29T03:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "149a7e29-fd62-435c-92bb-39cb0a4182b8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "166510f6-e3a1-496f-970a-9b01fbb65f87",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1cd85e25-913d-4ac6-8256-e1b339008c7b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-29T13:00:00.000+00:00", "2025-02-28T12:59:59.000+00:00"],
            ["2024-02-29T13:00:00.000+00:00", "2025-02-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1fbdc158-0c21-447e-a14d-f645675f81fe",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-08T03:25:00.000+00:00", "2021-06-02T22:15:00.000+00:00"],
            ["2021-05-08T03:25:00.000+00:00", "2021-06-02T22:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2976325c-86ac-4539-adfa-e1e35d76990d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-31T13:00:00.000+00:00", "2022-12-01T12:59:59.000+00:00"],
            ["2021-12-31T13:00:00.000+00:00", "2022-12-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "364e4eb8-1415-401a-8984-dfe91476f9a5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "37751f5b-3c93-40df-9913-951df310cbc8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4434200d-6a06-4666-a375-e41be8c6db6c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-10T19:25:00.000+00:00", "2020-08-17T05:15:00.000+00:00"],
            ["2020-08-10T19:25:00.000+00:00", "2020-08-17T05:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "44e47376-8627-4daa-a49a-7c2d31294537",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-04-20T14:00:00.000+00:00", "2030-04-21T13:59:59.000+00:00"],
            ["2020-04-20T14:00:00.000+00:00", "2030-04-21T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "48373f80-cf27-4883-bb0d-2549bf3edb8c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5bf2ba67-909b-409b-a0fc-23301773a750",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-14T05:30:00.000+00:00", "2019-06-13T22:00:00.000+00:00"],
            ["2019-05-14T05:30:00.000+00:00", "2019-06-13T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5caaca7e-7471-47d3-8538-25271ee0cd37",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-09-12T14:00:00.000+00:00", "2023-09-30T13:59:59.000+00:00"],
            ["2023-09-12T14:00:00.000+00:00", "2023-09-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5e4edfa2-b363-44e1-844d-45c7a4be9ded",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6447f562-9063-4879-8598-ca0b5c4e0175",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "697aa9e7-bf24-4f9e-9950-d5cfd78f1b35",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "711ed22e-10a1-4102-b564-581f95823e65",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
            ["2020-12-04T21:00:00.000+00:00", "2021-01-15T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "77f46a04-f07d-4968-a5f9-1da8df9706a7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7edbdc17-24b9-4b22-909b-6e7978500d98",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
            ["2022-07-13T14:00:00.000+00:00", "2022-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8cbb20ff-ed25-4e5c-89cb-9732ebed1036",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "93561671-c14f-4207-92e1-3b24d419855b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-28T13:00:00.000+00:00", "2021-06-15T13:59:59.000+00:00"],
            ["2020-12-28T13:00:00.000+00:00", "2021-06-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9c0a333d-ebdd-487f-9856-8d55e3ded684",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
            ["2022-11-18T13:00:00.000+00:00", "2022-12-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a9e03db8-f277-45d1-821d-cfcbfe8ae6be",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "abb48b82-61d4-4166-91eb-27c5a48312d1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-19T09:00:00.000+00:00", "2019-12-16T21:00:00.000+00:00"],
            ["2019-10-19T09:00:00.000+00:00", "2019-12-16T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ad4d6908-3a36-4991-996a-5b00ac162794",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-20T14:00:00.000+00:00", null],
            ["2022-05-20T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c9c47c36-c028-4d35-a34e-da29f6ceaebd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "de61f7c0-41bb-47bf-895a-7ff958689657",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
            ["2021-04-11T14:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0715091c-53e2-436a-a080-f71ec09bbfeb",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-09T13:00:00.000+00:00", "2023-12-31T12:59:59.000+00:00"],
            ["2023-01-09T13:00:00.000+00:00", "2023-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "08b6b404-e76d-4f82-82e2-b96022eb86c1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
            ["2022-09-29T14:00:00.000+00:00", "2022-11-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1a050822-d3ea-4432-a145-8aee41e7cf4d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-20T00:00:00.000+00:00", "2021-11-27T21:15:00.000+00:00"],
            ["2021-11-20T00:00:00.000+00:00", "2021-11-27T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2019_davis_station_survey",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-30T13:00:00.000+00:00", "2019-02-07T12:59:59.000+00:00"],
            ["2019-01-30T13:00:00.000+00:00", "2019-02-07T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "27625ece-a38a-400e-9a1e-857d88d85655",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "296b44de-1496-420e-93b1-3c310578ba66",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-13T13:00:00.000+00:00", "2021-02-16T12:59:59.000+00:00"],
            ["2020-03-13T13:00:00.000+00:00", "2021-02-16T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3e5c3b49-4d38-4978-98af-c6e0c5994656",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "435a4b98-d5f8-48be-8b9c-79812afd094d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-04-30T13:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-04-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "47848595-038b-46b3-ba75-6f52d5295a62",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-31T14:00:00.000+00:00", "2020-06-22T13:59:59.000+00:00"],
            ["2019-07-31T14:00:00.000+00:00", "2020-06-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "532690ce-ca84-4c03-a1da-c966917de0da",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "57fd1633-58b9-42ae-b815-0cb1619ab9bd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6205e8e9-d946-4125-8807-57a5b109c667",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "62a4765b-fb88-4e65-be5d-cb70d40044fd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-18T21:00:00.000+00:00", "2019-03-04T19:00:00.000+00:00"],
            ["2019-01-18T21:00:00.000+00:00", "2019-03-04T19:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "652ec22e-73fb-4eaa-ba6d-a7a6a7ec31d9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-30T13:00:00.000+00:00", "2024-12-20T12:59:59.000+00:00"],
            ["2022-11-30T13:00:00.000+00:00", "2024-12-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "74ce768e-f06f-4f30-a0dd-f9cd7bf81690",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-07-31T14:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "76e98f7f-1b0b-4b60-936d-4f135ca4e8ef",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-10-26T13:00:00.000+00:00", "2024-11-06T12:59:59.000+00:00"],
            ["2024-10-26T13:00:00.000+00:00", "2024-11-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "771a59b4-7565-4840-9c8a-a2911014fa33",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
            ["2019-07-19T11:00:00.000+00:00", "2019-08-01T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7973dc11-095a-4cc9-a3e3-15d414b04a43",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-28T16:01:09.000+00:00", "2019-05-09T05:15:00.000+00:00"],
            ["2019-04-28T16:01:09.000+00:00", "2019-05-09T05:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7fcf99b3-b95c-489a-bc4c-f4f1b75af9f2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-05-30T13:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-05-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "88b5ef7f-fb0a-4314-86a5-6c550db0d85b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-04T14:00:00.000+00:00", "2023-07-18T13:59:59.000+00:00"],
            ["2023-07-04T14:00:00.000+00:00", "2023-07-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "88b606a8-384e-4902-a8fc-44104c19b855",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-26T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
            ["2022-05-26T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "91b30eef-3e87-4e57-9ac9-ee3bd4c88e74",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-07-07T14:00:00.000+00:00", "2024-07-15T13:59:59.000+00:00"],
            ["2024-07-07T14:00:00.000+00:00", "2024-07-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "94c06824-6d01-47bc-a652-998fcff1ffe9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-02-28T02:10:00.000+00:00", "2022-03-21T02:00:00.000+00:00"],
            ["2022-02-28T02:10:00.000+00:00", "2022-03-21T02:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "95c09bad-1847-48f0-9ed7-1ba36e7abb8d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-19T13:00:00.000+00:00", null],
            ["2019-12-19T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9754a0e3-d45d-4392-9947-23686e3c2d57",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
            ["2020-01-07T21:00:00.000+00:00", "2020-03-05T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9ba1fa28-76a6-4ef8-8a1d-1643a11ae232",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
            ["2019-08-06T21:00:00.000+00:00", "2019-09-02T22:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9eff1f00-5115-4726-b41f-5a1a93f97575",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-01-31T13:00:00.000+00:00", null],
            ["2022-01-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4101_ENRICH_IN2019V01_Incubation_Pigments",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-18T13:00:00.000+00:00", "2019-02-26T12:59:59.000+00:00"],
            ["2019-01-18T13:00:00.000+00:00", "2019-02-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4512_TEMPO_Voyage_2021",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
            ["2021-01-28T13:00:00.000+00:00", "2021-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bc6955fd-cd47-48cf-84ba-69eb09296ecf",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bdf1bf5a-3ca9-402f-9846-123a99b8ddb9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "be7daab3-8b0d-4af6-9b49-1fd8af58846f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-28T13:00:00.000+00:00", "2019-05-01T13:59:59.000+00:00"],
            ["2019-02-28T13:00:00.000+00:00", "2019-05-01T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bfa11626-c285-4130-ba2a-ca00bd59f867",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c5bc7619-46c3-4773-b64e-cdce82c444e1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-10T13:00:00.000+00:00", "2019-10-11T12:59:59.000+00:00"],
            ["2019-10-10T13:00:00.000+00:00", "2019-10-11T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "162954a3-3f6b-466a-b754-11a68e7c33ac",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-29T13:00:00.000+00:00", "2026-12-31T12:59:59.000+00:00"],
            ["2024-02-29T13:00:00.000+00:00", "2026-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1c0f1282-b8fc-4a8f-9990-2e91196a9834",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-03T14:00:00.000+00:00", "2019-12-12T12:59:59.000+00:00"],
            ["2019-09-03T14:00:00.000+00:00", "2019-12-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1d61a308-091e-46de-995b-1e1035fe9580",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
            ["2024-01-01T13:00:00.000+00:00", "2024-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "229c27aa-87f2-4aab-a626-441a0fe0b061",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-12T13:00:00.000+00:00", "2019-07-11T13:59:59.000+00:00"],
            ["2019-02-12T13:00:00.000+00:00", "2019-07-11T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "300dade6-edde-4d2e-bcff-8b48e1f840ad",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-30T14:00:00.000+00:00", "2021-11-30T12:59:59.000+00:00"],
            ["2021-09-30T14:00:00.000+00:00", "2021-11-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "47523b9a-36dc-4c4f-ac0d-9fe2a3973a6e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-13T13:00:00.000+00:00", "2021-02-16T12:59:59.000+00:00"],
            ["2020-03-13T13:00:00.000+00:00", "2021-02-16T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "547a31d3-c56d-457b-b42a-74e5dda49e63",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-13T13:00:00.000+00:00", "2023-12-19T12:59:59.000+00:00"],
            ["2023-11-13T13:00:00.000+00:00", "2023-12-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "72e60dd3-f407-4be4-acb6-c611291fc912",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-31T14:00:00.000+00:00", "2023-02-28T12:59:59.000+00:00"],
            ["2022-05-31T14:00:00.000+00:00", "2023-02-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "73fb03a7-d144-4300-b2ee-a3e222c9bdfc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-05T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
            ["2023-01-05T13:00:00.000+00:00", "2023-01-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7857ff01-9f4e-4fc6-9ce1-db8824fb0292",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-08-31T13:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-08-31T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7e1f590e-a75e-47d7-83d6-8a5aaa730eb7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-03-03T13:00:00.000+00:00", "2026-12-10T12:59:59.000+00:00"],
            ["2024-03-03T13:00:00.000+00:00", "2026-12-10T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7e4d3f91-a85f-47e1-802c-09b506f21fe5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-20T14:00:00.000+00:00", "2021-03-21T12:59:59.000+00:00"],
            ["2021-08-20T14:00:00.000+00:00", "2021-03-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9ed1d710-deef-4410-a73a-bb756745677f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-08T02:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
            ["2020-10-08T02:00:00.000+00:00", "2020-11-02T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4556_TEMPO_Euphausiid_metabarcoding_data",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-12T13:00:00.000+00:00", "2021-03-11T12:59:59.000+00:00"],
            ["2021-02-12T13:00:00.000+00:00", "2021-03-11T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a0336049-49be-4dab-9038-8928ec9a67ce",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-29T13:00:00.000+00:00", "2026-03-01T12:59:59.000+00:00"],
            ["2024-02-29T13:00:00.000+00:00", "2026-03-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a56b2120-9753-4285-9767-f09060f8f3b8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b2a07531-d36c-47cd-b3ad-9744dce280c0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-20T00:00:00.000+00:00", "2021-11-27T21:15:00.000+00:00"],
            ["2021-11-20T00:00:00.000+00:00", "2021-11-27T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b3c9732e-c4dc-47cb-bf26-7b8100081994",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-17T13:00:00.000+00:00", "2020-09-05T13:59:59.000+00:00"],
            ["2019-03-17T13:00:00.000+00:00", "2020-09-05T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ba06d72a-55d9-42b5-a336-95b68ddcc84e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-13T13:00:00.000+00:00", "2023-12-19T12:59:59.000+00:00"],
            ["2023-11-13T13:00:00.000+00:00", "2023-12-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1ec2e43b-899e-40a8-a7f8-a02ea089499f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-24T13:00:00.000+00:00", "2019-04-10T13:59:59.000+00:00"],
            ["2019-02-24T13:00:00.000+00:00", "2019-04-10T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "20251749-03cc-4b96-8ddc-4d2e4f44d8c7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-01T13:00:00.000+00:00", "2020-11-15T12:59:59.000+00:00"],
            ["2020-11-01T13:00:00.000+00:00", "2020-11-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "214d03bc-79bd-4453-9e81-bb93e47b87e9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-31T14:00:00.000+00:00", "2023-12-31T12:59:59.000+00:00"],
            ["2022-05-31T14:00:00.000+00:00", "2023-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5524dfb5-a598-4023-ab20-9e573c5fd4aa",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "722b22c9-c843-4c42-a86b-60b2de05d0d0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
            ["2019-10-18T13:00:00.000+00:00", "2019-12-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7cb3ac61-dd39-448a-8b2f-2b9d64f153c6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-31T14:00:00.000+00:00", "2023-12-15T12:59:59.000+00:00"],
            ["2022-05-31T14:00:00.000+00:00", "2023-12-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "86d17e0f-c825-47d3-9480-114253bacd30",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8e403cca-19c9-498e-9e60-077646a3b0fc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "94318f9a-170a-47a0-abb0-1226a3245e36",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
            ["2020-07-28T16:00:00.000+00:00", "2020-08-05T20:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "94fb49d8-e0a4-4005-a0b4-239b54be1d5e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9f4b71ac-34c6-4942-bff7-4dc75e33b137",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "Genetic_identification_of_seabird_bycatch_Supp_Info",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-31T13:00:00.000+00:00", "2022-12-30T12:59:59.000+00:00"],
            ["2019-01-31T13:00:00.000+00:00", "2022-12-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a5de0c5c-edbf-4bd2-8715-a23f22d3a2d7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-30T13:00:00.000+00:00", "2020-12-03T12:59:59.000+00:00"],
            ["2020-11-30T13:00:00.000+00:00", "2020-12-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a99cefff-dd6e-4afe-9102-37ab2bf0a8e5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-30T13:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
            ["2020-10-30T13:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b718dfac-28b1-4cf9-ac33-aac21de8d478",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
            ["2021-11-29T21:00:00.000+00:00", "2021-12-07T21:15:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "25974977-cf2e-404c-b987-b5ce9ecc4273",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-29T13:00:00.000+00:00", "2025-02-28T12:59:59.000+00:00"],
            ["2024-02-29T13:00:00.000+00:00", "2025-02-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2784c430-23c0-4290-ba2a-b21d036cd37b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
            ["2021-06-10T14:00:00.000+00:00", "2021-06-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5eb00030-a97d-4567-a681-76c2d635af4c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-16T19:00:00.000+00:00", "2019-03-28T07:00:00.000+00:00"],
            ["2019-03-16T19:00:00.000+00:00", "2019-03-28T07:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "61ccd268-f010-4679-bc1a-be0b1688cd0b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8133f4f6-f5b1-4b8b-a113-b00f59b8aef7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
            ["2021-12-14T21:00:00.000+00:00", "2021-12-19T21:00:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4519_IN2020_V01_DredgeReport",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "af3fdcd6-dd92-418e-b5f5-57cec9c66d4b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-20T13:00:00.000+00:00", null],
            ["2023-11-20T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b90ec525-ce1a-4f82-be91-4837121367ce",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-09T13:00:00.000+00:00", null],
            ["2023-10-09T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "cdaf5407-b99c-402b-8c3c-1e2e6fd776e7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-16T13:00:00.000+00:00", "2019-03-28T12:59:59.000+00:00"],
            ["2019-03-16T13:00:00.000+00:00", "2019-03-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "15dca9a6-766a-46d9-8b1b-f9466e724c7a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-28T14:00:00.000+00:00", "2021-11-07T12:59:59.000+00:00"],
            ["2021-09-28T14:00:00.000+00:00", "2021-11-07T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "21bbe313-e806-4442-bfed-3f7e24b8571b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-31T14:00:00.000+00:00", "2023-06-01T13:59:59.000+00:00"],
            ["2020-07-31T14:00:00.000+00:00", "2023-06-01T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2a76fa0e-7cfa-4ae6-9d45-80df490058a8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-06-30T14:00:00.000+00:00", "2020-12-23T12:59:59.000+00:00"],
            ["2020-06-30T14:00:00.000+00:00", "2020-12-23T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "301b7f2b-1c1f-4c60-859e-593a039a6908",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-12-31T13:00:00.000+00:00", "2025-02-28T12:59:59.000+00:00"],
            ["2022-12-31T13:00:00.000+00:00", "2025-02-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3b070ea7-6e83-42dd-a2f6-44bc5fb03718",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-12T14:00:00.000+00:00", null],
            ["2019-05-12T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4673208b-def5-4340-9818-8419496e4863",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-13T13:00:00.000+00:00", "2023-09-22T13:59:59.000+00:00"],
            ["2020-12-13T13:00:00.000+00:00", "2023-09-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "770cbe09-6bc3-4f10-930b-313c1ea54547",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-30T13:00:00.000+00:00", "2023-01-31T12:59:59.000+00:00"],
            ["2023-01-30T13:00:00.000+00:00", "2023-01-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "91498abc-a4a0-4a07-b9a8-83f41bc408f0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-09T13:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
            ["2023-01-09T13:00:00.000+00:00", "2024-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9fbbacb9-10bc-46f2-b382-b1f0f81381e5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-20T14:00:00.000+00:00", "2020-01-05T12:59:59.000+00:00"],
            ["2019-05-20T14:00:00.000+00:00", "2020-01-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a3641013-dd42-4dff-bbd0-000306574bbf",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
            ["2021-11-09T12:30:00.000+00:00", "2021-11-13T13:30:00.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "aaed79bd-7163-4a33-a0f5-e79eb0726052",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-20T14:00:00.000+00:00", "2020-01-05T12:59:59.000+00:00"],
            ["2019-05-20T14:00:00.000+00:00", "2020-01-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c54c129b-df94-483e-b651-641c1bcc18e7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-12T13:00:00.000+00:00", "2019-03-19T12:59:59.000+00:00"],
            ["2019-01-12T13:00:00.000+00:00", "2019-03-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c58e91fb-a580-46d9-a7b3-659396c76d3e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-29T13:00:00.000+00:00", "2025-02-10T12:59:59.000+00:00"],
            ["2024-02-29T13:00:00.000+00:00", "2025-02-10T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c99acf82-c118-4817-8abb-a4dcea9738a5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-24T13:00:00.000+00:00", null],
            ["2020-02-24T13:00:00.000+00:00", "0021-03-16T14:10:43.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "04c7257a-9941-4378-8fca-2d8dc05e6c67",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-10T13:00:00.000+00:00", null],
            ["2019-11-10T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0d9d231b-ecdc-4bcc-9fba-db10a0f89081",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2ab0b398-07fe-4d36-8e15-106c469d8bbc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-02-28T13:00:00.000+00:00", "2025-07-31T13:59:59.000+00:00"],
            ["2023-02-28T13:00:00.000+00:00", "2025-07-31T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3892741d-0f3d-456d-b769-26ec4131eff5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-26T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
            ["2022-05-26T14:00:00.000+00:00", "2022-07-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4c756475-eb5b-406c-93eb-278e4197f082",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-24T01:37:00.000+00:00", null],
            ["2019-06-24T01:37:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "77d8eeff-7b54-4f43-993e-daef26c08cab",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-20T13:00:00.000+00:00", "2022-10-27T12:59:59.000+00:00"],
            ["2021-11-20T13:00:00.000+00:00", "2022-10-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7bc0d1fc-d0e4-4c1a-956f-8f7cd1a6892d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-07T13:00:00.000+00:00", null],
            ["2019-10-07T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "85241b4c-4106-4a9d-992b-a77ee8c615ff",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-15T13:00:00.000+00:00", null],
            ["2019-10-15T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "908afd8c-cc7a-4ea3-a87e-4497ae8da87a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-09-16T14:00:00.000+00:00", null],
            ["2020-09-16T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "956a2c2f-ecfe-423d-bfa9-cc9d9770f846",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-24T13:00:00.000+00:00", "2019-03-03T12:59:59.000+00:00"],
            ["2019-01-24T13:00:00.000+00:00", "2019-03-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b1505222-743a-4425-a4f0-d23b93dcd465",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-31T13:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
            ["2019-12-31T13:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bcccb39e-60c0-4664-83f3-f840c13ea212",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-05-14T14:00:00.000+00:00", "2023-06-15T13:59:59.000+00:00"],
            ["2023-05-14T14:00:00.000+00:00", "2023-06-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c9e2de61-9aad-4755-b8cf-8b96d32d35fe",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-17T14:00:00.000+00:00", "2020-06-22T13:59:59.000+00:00"],
            ["2019-07-17T14:00:00.000+00:00", "2020-06-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0bbc661d-d18b-441f-9b81-58810d1cf767",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-31T14:00:00.000+00:00", "2024-03-31T12:59:59.000+00:00"],
            ["2022-05-31T14:00:00.000+00:00", "2024-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "259bec4c-39eb-43d0-aca2-ff43db9a4316",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-31T13:00:00.000+00:00", "2020-12-30T12:59:59.000+00:00"],
            ["2020-01-31T13:00:00.000+00:00", "2020-12-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "436e10ed-3322-494c-93a3-3bdf3405c045",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-12-31T13:00:00.000+00:00", "2024-12-31T12:59:59.000+00:00"],
            ["2022-12-31T13:00:00.000+00:00", "2024-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4fca5250-7381-4a09-b02d-4b7347c495a5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-30T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-09-30T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5905b3eb-aad0-4f9c-a03e-a02fb3488082",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-30T14:00:00.000+00:00", "2022-12-31T12:59:59.000+00:00"],
            ["2021-09-30T14:00:00.000+00:00", "2022-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "79f7d3b9-92cf-470d-83b6-285efa6d31f6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8417d105-02ee-49b1-9e9d-59e466c9bafd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-10T14:00:00.000+00:00", "2020-08-14T13:59:59.000+00:00"],
            ["2020-08-10T14:00:00.000+00:00", "2020-08-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9b496f48-e7aa-4eb0-a0fd-fb0bc65ef90c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-15T13:00:00.000+00:00", "2024-12-15T12:59:59.000+00:00"],
            ["2023-01-15T13:00:00.000+00:00", "2024-12-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c46d1882-cb48-4412-b62b-992580b86c18",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-12-31T13:00:00.000+00:00", "2023-10-01T12:59:59.000+00:00"],
            ["2022-12-31T13:00:00.000+00:00", "2023-10-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03a5693e-d764-48d4-8e9c-211a5d52c13b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-10-26T13:00:00.000+00:00", "2022-10-27T12:59:59.000+00:00"],
            ["2022-10-26T13:00:00.000+00:00", "2022-10-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0bf544ee-1a95-4db4-b37e-1c06cafcde65",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-29T13:00:00.000+00:00", "2026-02-10T12:59:59.000+00:00"],
            ["2024-02-29T13:00:00.000+00:00", "2026-02-10T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "107e6eab-b647-4310-9bc5-a4792ebbf25b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-14T13:00:00.000+00:00", "2021-12-10T12:59:59.000+00:00"],
            ["2021-11-14T13:00:00.000+00:00", "2021-12-10T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "242826bd-a159-4836-9103-f19dd37c65ac",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "28047a73-ad75-4035-9188-ac1b3a92bf78",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2c010ab2-4e47-455f-9492-cbafbf56e281",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-31T14:00:00.000+00:00", "2024-05-30T13:59:59.000+00:00"],
            ["2022-05-31T14:00:00.000+00:00", "2024-05-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2ea27f68-f65b-47ad-9a84-eb284170cbde",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-28T13:00:00.000+00:00", "2022-02-28T12:59:59.000+00:00"],
            ["2019-02-28T13:00:00.000+00:00", "2022-02-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "433e18cd-c908-4553-b116-b604327730b0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "46f1a4c1-fed1-4a26-b3ad-6aae62bf25dd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-29T13:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2020-02-29T13:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "684f371f-c5de-4a39-af91-35a24bfc526e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-30T13:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
            ["2020-10-30T13:00:00.000+00:00", "2021-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "697b1314-7351-4478-b5f4-7ca4e5a1db3a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-09-24T14:00:00.000+00:00", "2023-09-25T13:59:59.000+00:00"],
            ["2023-09-24T14:00:00.000+00:00", "2023-09-25T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8bff4e20-60ff-4bd1-a95d-c548a052248f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-28T13:00:00.000+00:00", "2020-02-13T12:59:59.000+00:00"],
            ["2020-01-28T13:00:00.000+00:00", "2020-02-13T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8eca7224-1d85-4412-8ae9-c02092cabc07",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4506_NILAS_SOFTWARE",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-02-09T13:00:00.000+00:00", "2023-02-10T12:59:59.000+00:00"],
            ["2023-02-09T13:00:00.000+00:00", "2023-02-10T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4593_attenuation_dispersion_profiles",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-09-30T14:00:00.000+00:00", "2020-10-31T12:59:59.000+00:00"],
            ["2020-09-30T14:00:00.000+00:00", "2020-10-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b2e09ad6-8369-48a1-b523-87e3ce321aa6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "be6c80f4-dc02-47b9-97fd-f5423abc2860",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-11T13:00:00.000+00:00", "2022-04-03T13:59:59.000+00:00"],
            ["2021-12-11T13:00:00.000+00:00", "2022-04-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "cbe3e3fc-c951-428b-a89a-ee345a352da2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
            ["2020-08-06T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "075a8c40-78bb-466c-8399-da5159f69174",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-12-31T13:00:00.000+00:00", "2021-12-31T12:59:59.000+00:00"],
            ["2023-12-31T13:00:00.000+00:00", "2021-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "15e3c11d-5ecf-4a05-9acf-4c59b7c28967",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-09-14T14:00:00.000+00:00", "2023-09-15T13:59:59.000+00:00"],
            ["2023-09-14T14:00:00.000+00:00", "2023-09-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2b049116-949f-4f5a-9b5f-bf245936884c",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-03T14:00:00.000+00:00", "2020-10-05T12:59:59.000+00:00"],
            ["2020-10-03T14:00:00.000+00:00", "2020-10-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2cd22229-a38d-4abf-b57c-0a41aa5b7d50",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-13T14:00:00.000+00:00", null],
            ["2021-04-13T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5a2a7cd8-f91a-4a05-9e1d-290873d22279",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-26T14:00:00.000+00:00", "2020-08-27T13:59:59.000+00:00"],
            ["2020-08-26T14:00:00.000+00:00", "2020-08-27T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5aa2f15d-cac9-4b6c-9955-ddcfd61f8534",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-28T13:00:00.000+00:00", "2021-08-31T13:59:59.000+00:00"],
            ["2021-02-28T13:00:00.000+00:00", "2021-08-31T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5ba45aa9-55bb-453d-bead-7dc54e2daa42",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-31T14:00:00.000+00:00", "2024-02-28T12:59:59.000+00:00"],
            ["2022-05-31T14:00:00.000+00:00", "2024-02-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5e47d39a-5792-45d4-8d91-2373310ba81a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2022-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6205351f-cdc0-4bca-a788-9f5e4801454b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-03T14:00:00.000+00:00", "2020-10-09T12:59:59.000+00:00"],
            ["2020-10-03T14:00:00.000+00:00", "2020-10-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "95a03c39-3f94-4826-a438-6bd4df38acee",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-01-30T13:00:00.000+00:00", "2022-03-16T12:59:59.000+00:00"],
            ["2022-01-30T13:00:00.000+00:00", "2022-03-16T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ba9110f1-072c-4d15-8328-2091be983991",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-03-24T13:00:00.000+00:00", null],
            ["2021-03-24T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bcdd3a79-7324-43cf-880f-9f3481d25948",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
            ["2022-05-03T14:00:00.000+00:00", "2022-05-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c746da08-80d0-4044-a2b6-8f745035d386",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-30T13:00:00.000+00:00", null],
            ["2021-12-30T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0e8fa772-7b00-4714-9c73-2fea0ab0d22e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-10T13:00:00.000+00:00", null],
            ["2021-01-10T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "10f739c6-605a-4d16-a1e0-ad02afb50aa2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-01T13:00:00.000+00:00", "2020-11-15T12:59:59.000+00:00"],
            ["2020-11-01T13:00:00.000+00:00", "2020-11-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "17eb252e-8b67-4a48-99d0-8568a5c06c44",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-10T13:00:00.000+00:00", "2019-02-07T12:59:59.000+00:00"],
            ["2019-01-10T13:00:00.000+00:00", "2019-02-07T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "223d3cdd-6b4f-4bd5-bea9-5fa0df1cab08",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-31T13:00:00.000+00:00", null],
            ["2021-12-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3ae5db0a-3592-4145-a3f8-8e4c25b19ce9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-30T14:00:00.000+00:00", "2022-10-25T12:59:59.000+00:00"],
            ["2021-06-30T14:00:00.000+00:00", "2022-10-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "493443ef-be06-40bf-b4af-7f6cd566c1a3",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-04-13T14:00:00.000+00:00", "2023-06-02T13:59:59.000+00:00"],
            ["2023-04-13T14:00:00.000+00:00", "2023-06-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5d14f00f-6c24-43c1-b44e-70fe013d0757",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-31T13:00:00.000+00:00", null],
            ["2020-12-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "647d1c42-f3b0-4ed6-b300-4416702a7729",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-03T14:00:00.000+00:00", "2020-10-09T12:59:59.000+00:00"],
            ["2020-10-03T14:00:00.000+00:00", "2020-10-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7413ab95-c741-4daa-94e0-60eb3804240f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-24T14:00:00.000+00:00", "2019-09-16T13:59:59.000+00:00"],
            ["2019-07-24T14:00:00.000+00:00", "2019-09-16T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "743b1215-66b4-4803-9e4e-6e8c503fe8a8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-22T14:00:00.000+00:00", "2022-11-01T12:59:59.000+00:00"],
            ["2022-05-22T14:00:00.000+00:00", "2022-11-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9f40ac0c-e0b1-436b-abc7-b19bc7159d86",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-31T13:00:00.000+00:00", null],
            ["2019-10-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "RSVNUYINA_V1_23-24_SEA_ICE_DATA",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-08T13:00:00.000+00:00", "2023-12-01T12:59:59.000+00:00"],
            ["2023-10-08T13:00:00.000+00:00", "2023-12-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "097a31c7-331e-4673-b7a0-889cba1f5318",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-04T14:00:00.000+00:00", null],
            ["2021-05-04T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "880b1886-7322-47bc-b56e-49111581a584",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-29T13:00:00.000+00:00", "2021-01-30T12:59:59.000+00:00"],
            ["2019-01-29T13:00:00.000+00:00", "2021-01-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9ada4f7f-abf2-468b-a158-e1c7dba11b92",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-29T13:00:00.000+00:00", "2021-03-31T12:59:59.000+00:00"],
            ["2020-02-29T13:00:00.000+00:00", "2021-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4556_V1_2019_Euphausiid_raw_sequencing_data",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-15T13:00:00.000+00:00", "2019-11-26T12:59:59.000+00:00"],
            ["2019-11-15T13:00:00.000+00:00", "2019-11-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a7e5a691-5b29-4ba1-b014-b06bbf10250b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-30T14:00:00.000+00:00", "2021-10-31T12:59:59.000+00:00"],
            ["2021-04-30T14:00:00.000+00:00", "2021-10-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0b8504cd-3866-48af-aea4-a132cd3803c9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-29T13:00:00.000+00:00", "2021-03-31T12:59:59.000+00:00"],
            ["2020-02-29T13:00:00.000+00:00", "2021-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "48de2e3c-52a9-42f0-84ac-eb13baab0b07",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-31T13:00:00.000+00:00", "2023-10-31T12:59:59.000+00:00"],
            ["2020-12-31T13:00:00.000+00:00", "2023-10-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "4b199e09-4b27-4e74-b3b1-a40849b5b823",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-27T13:00:00.000+00:00", "2022-04-13T13:59:59.000+00:00"],
            ["2022-03-27T13:00:00.000+00:00", "2022-04-13T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7b8c95fb-af4e-40c6-be25-9981b70923b6",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-02-21T13:00:00.000+00:00", "2022-07-20T13:59:59.000+00:00"],
            ["2022-02-21T13:00:00.000+00:00", "2022-07-20T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAS_4519_IN2020_V01_DredgeLog",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
            ["2020-01-09T13:00:00.000+00:00", "2020-03-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3b7e25b7-de6c-4213-a79a-3093f52e0e42",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-03T13:00:00.000+00:00", "2020-07-04T13:59:59.000+00:00"],
            ["2020-01-03T13:00:00.000+00:00", "2020-07-04T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "44c37bd2-5a3b-4eb5-92e1-6fc37345bc37",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-04-21T14:00:00.000+00:00", null],
            ["2022-04-21T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ACP_IceSheetSeaLevel_Outlook",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-09-22T14:00:00.000+00:00", "2024-09-23T13:59:59.000+00:00"],
            ["2024-09-22T14:00:00.000+00:00", "2024-09-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "GEBCO_2021_GEOTIFF",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-31T13:00:00.000+00:00", "2021-12-31T12:59:59.000+00:00"],
            ["2020-12-31T13:00:00.000+00:00", "2021-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-8039-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-08-10T14:00:00.000+00:00", "2023-08-14T13:59:59.000+00:00"],
            ["2023-08-10T14:00:00.000+00:00", "2023-08-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-803A-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-05-28T14:00:00.000+00:00", "2023-06-05T13:59:59.000+00:00"],
            ["2023-05-28T14:00:00.000+00:00", "2023-06-05T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-803C-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-05-27T14:00:00.000+00:00", "2023-06-22T13:59:59.000+00:00"],
            ["2023-05-27T14:00:00.000+00:00", "2023-06-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-803D-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-11T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
            ["2023-07-11T14:00:00.000+00:00", "2023-07-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-803E-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-23T14:00:00.000+00:00", "2023-08-07T13:59:59.000+00:00"],
            ["2023-07-23T14:00:00.000+00:00", "2023-08-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-803F-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-07-13T14:00:00.000+00:00", "2023-07-22T13:59:59.000+00:00"],
            ["2023-07-13T14:00:00.000+00:00", "2023-07-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-8040-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-07T14:00:00.000+00:00", "2023-06-09T13:59:59.000+00:00"],
            ["2023-06-07T14:00:00.000+00:00", "2023-06-09T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-8041-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-08T14:00:00.000+00:00", "2023-06-15T13:59:59.000+00:00"],
            ["2023-06-08T14:00:00.000+00:00", "2023-06-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-8042-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-23T14:00:00.000+00:00", "2023-06-26T13:59:59.000+00:00"],
            ["2023-06-23T14:00:00.000+00:00", "2023-06-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-8043-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-06-25T14:00:00.000+00:00", "2023-07-10T13:59:59.000+00:00"],
            ["2023-06-25T14:00:00.000+00:00", "2023-07-10T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03C77636-6BFD-152F-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-08-19T14:00:00.000+00:00", "2023-08-22T13:59:59.000+00:00"],
            ["2023-08-19T14:00:00.000+00:00", "2023-08-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0403D342-98BB-22DF-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-08-22T14:00:00.000+00:00", "2023-09-12T13:59:59.000+00:00"],
            ["2023-08-22T14:00:00.000+00:00", "2023-09-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "05AA41F8-F8C3-6F63-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-09-13T14:00:00.000+00:00", "2023-09-24T13:59:59.000+00:00"],
            ["2023-09-13T14:00:00.000+00:00", "2023-09-24T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "065F4F4C-0E89-014D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-08-19T14:00:00.000+00:00", "2023-08-22T13:59:59.000+00:00"],
            ["2023-08-19T14:00:00.000+00:00", "2023-08-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "06AFC62B-7FAD-0C8C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-09-30T14:00:00.000+00:00", "2023-10-09T12:59:59.000+00:00"],
            ["2023-09-30T14:00:00.000+00:00", "2023-10-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "07F1A430-6841-0657-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-12T13:00:00.000+00:00", "2023-10-27T12:59:59.000+00:00"],
            ["2023-10-12T13:00:00.000+00:00", "2023-10-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0805C154-E07A-6665-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-10T13:00:00.000+00:00", "2023-10-25T12:59:59.000+00:00"],
            ["2023-10-10T13:00:00.000+00:00", "2023-10-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "090B4610-5D2A-2A34-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-29T13:00:00.000+00:00", "2023-11-13T12:59:59.000+00:00"],
            ["2023-10-29T13:00:00.000+00:00", "2023-11-13T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "09AC33F3-B142-3E8B-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-25T13:00:00.000+00:00", "2023-10-30T12:59:59.000+00:00"],
            ["2023-10-25T13:00:00.000+00:00", "2023-10-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "09AC33F3-B143-3E8B-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-30T13:00:00.000+00:00", "2023-11-25T12:59:59.000+00:00"],
            ["2023-10-30T13:00:00.000+00:00", "2023-11-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0A6141C9-C171-6770-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-14T13:00:00.000+00:00", "2023-12-05T12:59:59.000+00:00"],
            ["2023-11-14T13:00:00.000+00:00", "2023-12-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0B52A69E-9A3A-3607-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-11-27T13:00:00.000+00:00", "2023-12-15T12:59:59.000+00:00"],
            ["2023-11-27T13:00:00.000+00:00", "2023-12-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0C9487B7-61F9-598B-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-12-13T13:00:00.000+00:00", "2023-12-22T12:59:59.000+00:00"],
            ["2023-12-13T13:00:00.000+00:00", "2023-12-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0CA8A286-B3CE-3DC8-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-12-14T13:00:00.000+00:00", "2023-12-19T12:59:59.000+00:00"],
            ["2023-12-14T13:00:00.000+00:00", "2023-12-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0CF91AAB-24FB-46AD-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-12-18T13:00:00.000+00:00", "2023-12-21T12:59:59.000+00:00"],
            ["2023-12-18T13:00:00.000+00:00", "2023-12-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0D215870-C5C3-74CF-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-12-21T13:00:00.000+00:00", "2024-01-04T12:59:59.000+00:00"],
            ["2023-12-21T13:00:00.000+00:00", "2024-01-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0D9A0BA5-1C90-1CB8-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-12-26T13:00:00.000+00:00", "2024-01-16T12:59:59.000+00:00"],
            ["2023-12-26T13:00:00.000+00:00", "2024-01-16T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0E6335FC-D058-504B-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-06T13:00:00.000+00:00", "2024-01-22T12:59:59.000+00:00"],
            ["2024-01-06T13:00:00.000+00:00", "2024-01-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0F90F59D-6961-0EE5-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-20T13:00:00.000+00:00", "2024-02-09T12:59:59.000+00:00"],
            ["2024-01-20T13:00:00.000+00:00", "2024-02-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0F90F59D-6962-0EE5-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-21T13:00:00.000+00:00", "2024-01-24T12:59:59.000+00:00"],
            ["2024-01-21T13:00:00.000+00:00", "2024-01-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0FA50FBC-7E3D-1DE4-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-23T13:00:00.000+00:00", "2024-02-06T12:59:59.000+00:00"],
            ["2024-01-23T13:00:00.000+00:00", "2024-02-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0FE16CD5-EF4A-1F92-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-25T13:00:00.000+00:00", "2024-01-28T12:59:59.000+00:00"],
            ["2024-01-25T13:00:00.000+00:00", "2024-01-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0FE16CD5-EF4B-1F92-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-25T13:00:00.000+00:00", "2024-01-28T12:59:59.000+00:00"],
            ["2024-01-25T13:00:00.000+00:00", "2024-01-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "114B825F-7C32-4FB8-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-11T13:00:00.000+00:00", "2024-03-04T12:59:59.000+00:00"],
            ["2024-02-11T13:00:00.000+00:00", "2024-03-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1200902D-F2E2-455C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-23T13:00:00.000+00:00", "2024-01-27T12:59:59.000+00:00"],
            ["2024-01-23T13:00:00.000+00:00", "2024-01-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1200902D-F2E3-455C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-22T13:00:00.000+00:00", "2024-01-25T12:59:59.000+00:00"],
            ["2024-01-22T13:00:00.000+00:00", "2024-01-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1200902D-F2E4-455C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-21T13:00:00.000+00:00", "2024-01-24T12:59:59.000+00:00"],
            ["2024-01-21T13:00:00.000+00:00", "2024-01-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "126524D9-D709-141C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-21T13:00:00.000+00:00", "2024-01-29T12:59:59.000+00:00"],
            ["2024-01-21T13:00:00.000+00:00", "2024-01-29T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "126524D9-D70B-141C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-27T13:00:00.000+00:00", "2024-02-09T12:59:59.000+00:00"],
            ["2024-01-27T13:00:00.000+00:00", "2024-02-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "126524D9-D70C-141C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-08T13:00:00.000+00:00", "2024-02-24T12:59:59.000+00:00"],
            ["2024-02-08T13:00:00.000+00:00", "2024-02-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "126524D9-D70D-141C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-26T13:00:00.000+00:00", "2024-02-06T12:59:59.000+00:00"],
            ["2024-01-26T13:00:00.000+00:00", "2024-02-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "126524D9-D70F-141C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-06T13:00:00.000+00:00", "2024-01-22T12:59:59.000+00:00"],
            ["2024-01-06T13:00:00.000+00:00", "2024-01-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "126524D9-D710-141C-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-01-21T13:00:00.000+00:00", "2024-01-27T12:59:59.000+00:00"],
            ["2024-01-21T13:00:00.000+00:00", "2024-01-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "12A18131-6D96-0D2B-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-28T13:00:00.000+00:00", "2024-03-14T12:59:59.000+00:00"],
            ["2024-02-28T13:00:00.000+00:00", "2024-03-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2a414204-ed47-431d-bad7-a6fee9dca874",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-06T14:00:00.000+00:00", "2022-07-06T13:59:59.000+00:00"],
            ["2022-05-06T14:00:00.000+00:00", "2022-07-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "42c0e99b-879b-48b4-9ae6-2b72a5995aa7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-30T14:00:00.000+00:00", "2019-05-14T13:59:59.000+00:00"],
            ["2019-04-30T14:00:00.000+00:00", "2019-05-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5263c0bd-aa00-4769-9041-f42390920c3f",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-10T13:00:00.000+00:00", "2020-12-30T12:59:59.000+00:00"],
            ["2020-01-10T13:00:00.000+00:00", "2020-12-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "53ad4154-0686-4e07-997a-71c10510860e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-20T13:00:00.000+00:00", "2021-12-22T12:59:59.000+00:00"],
            ["2021-12-20T13:00:00.000+00:00", "2021-12-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "615e208d-f6c7-4b2f-b99e-d4fc50614e48",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-28T13:00:00.000+00:00", "2020-03-31T12:59:59.000+00:00"],
            ["2019-02-28T13:00:00.000+00:00", "2020-03-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "778cc4e3-7979-4601-8fdf-772f345d8956",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-31T13:00:00.000+00:00", null],
            ["2019-12-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "783c3b23-6d58-47cc-bdd1-f5ac37cd9275",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-10-31T13:00:00.000+00:00", "2024-04-30T13:59:59.000+00:00"],
            ["2023-10-31T13:00:00.000+00:00", "2024-04-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7E83B957-400D-3B41-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-02T13:00:00.000+00:00", "2019-01-30T12:59:59.000+00:00"],
            ["2019-01-02T13:00:00.000+00:00", "2019-01-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7E972456-6EEC-5698-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-02T13:00:00.000+00:00", "2019-01-13T12:59:59.000+00:00"],
            ["2019-01-02T13:00:00.000+00:00", "2019-01-13T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7F74160C-6C3A-418D-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-13T13:00:00.000+00:00", "2019-01-18T12:59:59.000+00:00"],
            ["2019-01-13T13:00:00.000+00:00", "2019-01-18T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "806565BD-C469-0AD7-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-24T13:00:00.000+00:00", "2019-02-03T12:59:59.000+00:00"],
            ["2019-01-24T13:00:00.000+00:00", "2019-02-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "80B5076F-F3BA-2CAD-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-30T13:00:00.000+00:00", "2019-02-09T12:59:59.000+00:00"],
            ["2019-01-30T13:00:00.000+00:00", "2019-02-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8195996F-0FA0-6A06-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-04T13:00:00.000+00:00", "2019-02-11T12:59:59.000+00:00"],
            ["2019-02-04T13:00:00.000+00:00", "2019-02-11T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "81D27786-97D0-2D88-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-12T13:00:00.000+00:00", "2019-03-06T12:59:59.000+00:00"],
            ["2019-02-12T13:00:00.000+00:00", "2019-03-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "81D27786-97D1-2D88-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-11T13:00:00.000+00:00", "2019-02-23T12:59:59.000+00:00"],
            ["2019-02-11T13:00:00.000+00:00", "2019-02-23T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "832511E6-9DDE-1E94-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-02T13:00:00.000+00:00", "2019-03-09T12:59:59.000+00:00"],
            ["2019-03-02T13:00:00.000+00:00", "2019-03-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "83B1F167-6720-345E-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-07T13:00:00.000+00:00", "2019-03-21T12:59:59.000+00:00"],
            ["2019-03-07T13:00:00.000+00:00", "2019-03-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8401EB97-759D-3854-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-11T13:00:00.000+00:00", "2019-03-19T12:59:59.000+00:00"],
            ["2019-03-11T13:00:00.000+00:00", "2019-03-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "84DF34D4-0B30-0AC7-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-21T13:00:00.000+00:00", "2019-04-05T12:59:59.000+00:00"],
            ["2019-03-21T13:00:00.000+00:00", "2019-04-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "852FAC8B-393B-543B-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-03-26T13:00:00.000+00:00", "2019-04-09T13:59:59.000+00:00"],
            ["2019-03-26T13:00:00.000+00:00", "2019-04-09T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "860D5C45-6919-34AC-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-07T14:00:00.000+00:00", "2019-05-02T13:59:59.000+00:00"],
            ["2019-04-07T14:00:00.000+00:00", "2019-05-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8712DE93-0503-55A8-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-19T14:00:00.000+00:00", "2019-04-26T13:59:59.000+00:00"],
            ["2019-04-19T14:00:00.000+00:00", "2019-04-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "87B366C6-1452-6074-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-04-27T14:00:00.000+00:00", "2019-05-05T13:59:59.000+00:00"],
            ["2019-04-27T14:00:00.000+00:00", "2019-05-05T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8840A909-2D0F-3585-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-04T14:00:00.000+00:00", "2019-05-15T13:59:59.000+00:00"],
            ["2019-05-04T14:00:00.000+00:00", "2019-05-15T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "88A52EE6-95E6-1CAF-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-09T14:00:00.000+00:00", "2019-05-17T13:59:59.000+00:00"],
            ["2019-05-09T14:00:00.000+00:00", "2019-05-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8931FE74-17FF-7CF9-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-16T14:00:00.000+00:00", "2019-05-25T13:59:59.000+00:00"],
            ["2019-05-16T14:00:00.000+00:00", "2019-05-25T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8959D998-90F6-6F05-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-18T14:00:00.000+00:00", "2019-05-23T13:59:59.000+00:00"],
            ["2019-05-18T14:00:00.000+00:00", "2019-05-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8A2A6E41-DC42-6284-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-27T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
            ["2019-05-27T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8A2A6E41-DC43-6284-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-28T14:00:00.000+00:00", "2019-06-06T13:59:59.000+00:00"],
            ["2019-05-28T14:00:00.000+00:00", "2019-06-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8AEC2EE4-D665-2242-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-08T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
            ["2019-06-08T14:00:00.000+00:00", "2019-06-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8B7FCBCC-88F2-00E3-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-15T14:00:00.000+00:00", "2019-06-21T13:59:59.000+00:00"],
            ["2019-06-15T14:00:00.000+00:00", "2019-06-21T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8C0624D1-5DB3-0CAE-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-22T14:00:00.000+00:00", "2019-06-26T13:59:59.000+00:00"],
            ["2019-06-22T14:00:00.000+00:00", "2019-06-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8C9339DA-04AE-17B1-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-28T14:00:00.000+00:00", "2019-07-08T13:59:59.000+00:00"],
            ["2019-06-28T14:00:00.000+00:00", "2019-07-08T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8E75CB5F-62AE-1BA7-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-10T14:00:00.000+00:00", "2019-07-17T13:59:59.000+00:00"],
            ["2019-07-10T14:00:00.000+00:00", "2019-07-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8E75CB5F-62AF-1BA7-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-19T14:00:00.000+00:00", "2019-07-26T13:59:59.000+00:00"],
            ["2019-07-19T14:00:00.000+00:00", "2019-07-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8E75CB5F-62B0-1BA7-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-20T14:00:00.000+00:00", "2019-07-24T13:59:59.000+00:00"],
            ["2019-07-20T14:00:00.000+00:00", "2019-07-24T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8EB215F9-3BE8-6865-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-24T14:00:00.000+00:00", "2019-08-11T13:59:59.000+00:00"],
            ["2019-07-24T14:00:00.000+00:00", "2019-08-11T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "901C36EA-6B1C-73BC-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-11T14:00:00.000+00:00", "2019-08-21T13:59:59.000+00:00"],
            ["2019-08-11T14:00:00.000+00:00", "2019-08-21T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "90E552CA-F3C6-1458-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-22T14:00:00.000+00:00", "2019-08-27T13:59:59.000+00:00"],
            ["2019-08-22T14:00:00.000+00:00", "2019-08-27T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "90F9699E-AD17-1C46-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-23T14:00:00.000+00:00", "2019-09-07T13:59:59.000+00:00"],
            ["2019-08-23T14:00:00.000+00:00", "2019-09-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "915E2187-E467-6F24-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-28T14:00:00.000+00:00", "2019-09-12T13:59:59.000+00:00"],
            ["2019-08-28T14:00:00.000+00:00", "2019-09-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "923B053D-B27A-5437-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-09T14:00:00.000+00:00", "2019-10-01T13:59:59.000+00:00"],
            ["2019-09-09T14:00:00.000+00:00", "2019-10-01T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "93A53A36-890A-216E-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-25T14:00:00.000+00:00", "2019-09-28T13:59:59.000+00:00"],
            ["2019-09-25T14:00:00.000+00:00", "2019-09-28T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "93B93CFD-38C3-2B62-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-27T14:00:00.000+00:00", "2019-10-11T12:59:59.000+00:00"],
            ["2019-09-27T14:00:00.000+00:00", "2019-10-11T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "941DEEEA-A6AD-12CD-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-02T14:00:00.000+00:00", "2019-10-14T12:59:59.000+00:00"],
            ["2019-10-02T14:00:00.000+00:00", "2019-10-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "94FB1AC6-F3A2-4BE9-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-13T13:00:00.000+00:00", "2019-10-28T12:59:59.000+00:00"],
            ["2019-10-13T13:00:00.000+00:00", "2019-10-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "95378859-F213-2179-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-17T13:00:00.000+00:00", "2019-10-23T12:59:59.000+00:00"],
            ["2019-10-17T13:00:00.000+00:00", "2019-10-23T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "95D88123-9C8D-7311-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-23T13:00:00.000+00:00", "2019-11-05T12:59:59.000+00:00"],
            ["2019-10-23T13:00:00.000+00:00", "2019-11-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "96C9E163-671A-2904-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-05T13:00:00.000+00:00", "2019-11-14T12:59:59.000+00:00"],
            ["2019-11-05T13:00:00.000+00:00", "2019-11-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "96F2164C-7371-1159-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-07T13:00:00.000+00:00", "2019-11-17T12:59:59.000+00:00"],
            ["2019-11-07T13:00:00.000+00:00", "2019-11-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "96d45ccb-7616-43b5-8486-60ec87fb6628",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-30T13:00:00.000+00:00", "2023-12-01T12:59:59.000+00:00"],
            ["2019-11-30T13:00:00.000+00:00", "2023-12-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9793055C-334A-3FDF-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-15T13:00:00.000+00:00", "2019-12-01T12:59:59.000+00:00"],
            ["2019-11-15T13:00:00.000+00:00", "2019-12-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9793055C-334B-3FDF-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-16T13:00:00.000+00:00", "2019-11-20T12:59:59.000+00:00"],
            ["2019-11-16T13:00:00.000+00:00", "2019-11-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "97F79D65-AC97-7860-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-21T13:00:00.000+00:00", "2019-12-14T12:59:59.000+00:00"],
            ["2019-11-21T13:00:00.000+00:00", "2019-12-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9833F2F5-1BBE-0BD4-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-11T14:00:00.000+00:00", "2019-09-22T13:59:59.000+00:00"],
            ["2019-09-11T14:00:00.000+00:00", "2019-09-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9833F2F5-1BC8-0BD4-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-13T14:00:00.000+00:00", "2019-07-18T13:59:59.000+00:00"],
            ["2019-06-13T14:00:00.000+00:00", "2019-07-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9833F2F5-1BC9-0BD4-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-05T14:00:00.000+00:00", "2019-05-08T13:59:59.000+00:00"],
            ["2019-05-05T14:00:00.000+00:00", "2019-05-08T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9833F2F5-1BD8-0BD4-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-07-25T14:00:00.000+00:00", "2019-07-28T13:59:59.000+00:00"],
            ["2019-07-25T14:00:00.000+00:00", "2019-07-28T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9833F2F5-1BD9-0BD4-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-30T13:00:00.000+00:00", "2019-11-05T12:59:59.000+00:00"],
            ["2019-10-30T13:00:00.000+00:00", "2019-11-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9833F2F5-1BDB-0BD4-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-25T13:00:00.000+00:00", "2019-03-02T12:59:59.000+00:00"],
            ["2019-02-25T13:00:00.000+00:00", "2019-03-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "99255DD5-3D89-4602-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-05T13:00:00.000+00:00", "2019-12-13T12:59:59.000+00:00"],
            ["2019-12-05T13:00:00.000+00:00", "2019-12-13T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "99C6362E-23A4-1AD0-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-13T13:00:00.000+00:00", "2019-12-24T12:59:59.000+00:00"],
            ["2019-12-13T13:00:00.000+00:00", "2019-12-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9A2ACC79-8076-3E72-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-19T13:00:00.000+00:00", "2019-12-21T12:59:59.000+00:00"],
            ["2019-12-19T13:00:00.000+00:00", "2019-12-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9B305067-A8E2-6099-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-31T13:00:00.000+00:00", "2020-01-22T12:59:59.000+00:00"],
            ["2019-12-31T13:00:00.000+00:00", "2020-01-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9B44855D-41D7-4C7E-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-23T13:00:00.000+00:00", "2019-12-31T12:59:59.000+00:00"],
            ["2019-12-23T13:00:00.000+00:00", "2019-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9B44855D-41D8-4C7E-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-20T13:00:00.000+00:00", "2019-12-28T12:59:59.000+00:00"],
            ["2019-12-20T13:00:00.000+00:00", "2019-12-28T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9E2FE400-5BB7-0B7C-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-22T13:00:00.000+00:00", "2020-01-25T12:59:59.000+00:00"],
            ["2020-01-22T13:00:00.000+00:00", "2020-01-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9E2FE400-5BB8-0B7C-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-28T13:00:00.000+00:00", "2020-01-31T12:59:59.000+00:00"],
            ["2020-01-28T13:00:00.000+00:00", "2020-01-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9E2FE400-5BB9-0B7C-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-01T13:00:00.000+00:00", "2020-02-04T12:59:59.000+00:00"],
            ["2020-02-01T13:00:00.000+00:00", "2020-02-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9E2FE400-5BBA-0B7C-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-05T13:00:00.000+00:00", "2020-02-23T12:59:59.000+00:00"],
            ["2020-02-05T13:00:00.000+00:00", "2020-02-23T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9E2FE400-5BBB-0B7C-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-06T13:00:00.000+00:00", "2020-02-26T12:59:59.000+00:00"],
            ["2020-02-06T13:00:00.000+00:00", "2020-02-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9E2FE400-5BBD-0B7C-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-30T13:00:00.000+00:00", "2020-02-05T12:59:59.000+00:00"],
            ["2020-01-30T13:00:00.000+00:00", "2020-02-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9E2FE400-5BBE-0B7C-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-22T13:00:00.000+00:00", "2020-01-31T12:59:59.000+00:00"],
            ["2020-01-22T13:00:00.000+00:00", "2020-01-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9E2FE400-5BBF-0B7C-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-22T13:00:00.000+00:00", "2020-01-29T12:59:59.000+00:00"],
            ["2020-01-22T13:00:00.000+00:00", "2020-01-29T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9F6EAFBF-2785-6D95-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-22T13:00:00.000+00:00", "2020-04-28T13:59:59.000+00:00"],
            ["2020-02-22T13:00:00.000+00:00", "2020-04-28T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9FD33083-BF13-02B1-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-02-28T13:00:00.000+00:00", "2020-03-04T12:59:59.000+00:00"],
            ["2020-02-28T13:00:00.000+00:00", "2020-03-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A088B970-AC6F-72D4-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-22T13:00:00.000+00:00", "2020-01-31T12:59:59.000+00:00"],
            ["2020-01-22T13:00:00.000+00:00", "2020-01-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A088B970-AC70-72D4-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-05T13:00:00.000+00:00", "2020-03-27T12:59:59.000+00:00"],
            ["2020-03-05T13:00:00.000+00:00", "2020-03-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A27F3D17-FE87-4610-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-29T13:00:00.000+00:00", "2020-04-10T13:59:59.000+00:00"],
            ["2020-03-29T13:00:00.000+00:00", "2020-04-10T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A2A774DE-5518-0EAE-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-05-23T14:00:00.000+00:00", "2020-06-14T13:59:59.000+00:00"],
            ["2020-05-23T14:00:00.000+00:00", "2020-06-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A3D532E1-0B86-744D-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-04-20T14:00:00.000+00:00", "2020-04-22T13:59:59.000+00:00"],
            ["2020-04-20T14:00:00.000+00:00", "2020-04-22T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A48A427A-8254-08BC-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-04-21T14:00:00.000+00:00", "2020-05-06T13:59:59.000+00:00"],
            ["2020-04-21T14:00:00.000+00:00", "2020-05-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A4EED733-69F5-3ED6-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-04-27T14:00:00.000+00:00", "2020-05-09T13:59:59.000+00:00"],
            ["2020-04-27T14:00:00.000+00:00", "2020-05-09T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A57BA58B-ACEB-4BBF-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-05-10T14:00:00.000+00:00", "2020-05-19T13:59:59.000+00:00"],
            ["2020-05-10T14:00:00.000+00:00", "2020-05-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A6087BCC-55B9-7875-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-05-17T14:00:00.000+00:00", "2020-05-21T13:59:59.000+00:00"],
            ["2020-05-17T14:00:00.000+00:00", "2020-05-21T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A61C98A9-570E-7737-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-05-11T14:00:00.000+00:00", "2020-06-05T13:59:59.000+00:00"],
            ["2020-05-11T14:00:00.000+00:00", "2020-06-05T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A630A1DD-EE7E-784A-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-05-20T14:00:00.000+00:00", "2020-05-24T13:59:59.000+00:00"],
            ["2020-05-20T14:00:00.000+00:00", "2020-05-24T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A7C9FCB3-689F-6138-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-06-07T14:00:00.000+00:00", "2020-06-23T13:59:59.000+00:00"],
            ["2020-06-07T14:00:00.000+00:00", "2020-06-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A7C9FCB3-68A2-6138-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-05-11T14:00:00.000+00:00", "2020-06-05T13:59:59.000+00:00"],
            ["2020-05-11T14:00:00.000+00:00", "2020-06-05T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A8279BFE-1178-6616-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-06-15T14:00:00.000+00:00", "2020-06-19T13:59:59.000+00:00"],
            ["2020-06-15T14:00:00.000+00:00", "2020-06-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A92D2310-5821-2509-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-06-27T14:00:00.000+00:00", "2020-07-03T13:59:59.000+00:00"],
            ["2020-06-27T14:00:00.000+00:00", "2020-07-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A97D990F-2F81-7066-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-01T14:00:00.000+00:00", "2020-07-06T13:59:59.000+00:00"],
            ["2020-07-01T14:00:00.000+00:00", "2020-07-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A9F63A7A-5887-7EB9-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-06T14:00:00.000+00:00", "2020-07-17T13:59:59.000+00:00"],
            ["2020-07-06T14:00:00.000+00:00", "2020-07-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AA0A6A7A-A59B-7D08-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-07T14:00:00.000+00:00", "2020-07-16T13:59:59.000+00:00"],
            ["2020-07-07T14:00:00.000+00:00", "2020-07-16T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AA832240-10B4-7223-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-05-19T14:00:00.000+00:00", "2020-06-06T13:59:59.000+00:00"],
            ["2020-05-19T14:00:00.000+00:00", "2020-06-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AAFBD176-8B20-12D3-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-19T14:00:00.000+00:00", "2020-08-04T13:59:59.000+00:00"],
            ["2020-07-19T14:00:00.000+00:00", "2020-08-04T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ABED5132-B62F-1F93-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-31T14:00:00.000+00:00", "2020-08-07T13:59:59.000+00:00"],
            ["2020-07-31T14:00:00.000+00:00", "2020-08-07T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AC8E410B-1429-09EC-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-09T14:00:00.000+00:00", "2020-08-13T13:59:59.000+00:00"],
            ["2020-08-09T14:00:00.000+00:00", "2020-08-13T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ACB689DB-674C-78F3-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-11T14:00:00.000+00:00", "2020-08-18T13:59:59.000+00:00"],
            ["2020-08-11T14:00:00.000+00:00", "2020-08-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AD071950-89A0-5AE6-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-15T14:00:00.000+00:00", "2020-09-10T13:59:59.000+00:00"],
            ["2020-08-15T14:00:00.000+00:00", "2020-09-10T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AD7F77DA-54B4-21E8-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-20T14:00:00.000+00:00", "2020-08-25T13:59:59.000+00:00"],
            ["2020-08-20T14:00:00.000+00:00", "2020-08-25T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AE5CC041-1766-0D57-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-08-31T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
            ["2020-08-31T14:00:00.000+00:00", "2020-09-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AE84FBE2-2999-742B-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-09-02T14:00:00.000+00:00", "2020-09-04T13:59:59.000+00:00"],
            ["2020-09-02T14:00:00.000+00:00", "2020-09-04T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AF4E3834-0529-3863-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-09-12T14:00:00.000+00:00", "2020-09-23T13:59:59.000+00:00"],
            ["2020-09-12T14:00:00.000+00:00", "2020-09-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AFC6E896-1C88-6C9E-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-09-16T14:00:00.000+00:00", "2020-09-21T13:59:59.000+00:00"],
            ["2020-09-16T14:00:00.000+00:00", "2020-09-21T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B053BB98-9037-1F82-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-09-24T14:00:00.000+00:00", "2020-10-01T13:59:59.000+00:00"],
            ["2020-09-24T14:00:00.000+00:00", "2020-10-01T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B055FAD0-9D16-0D1A-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-09-24T14:00:00.000+00:00", "2020-10-17T12:59:59.000+00:00"],
            ["2020-09-24T14:00:00.000+00:00", "2020-10-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B0F4AB04-E3C8-0147-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-03T14:00:00.000+00:00", "2020-10-20T12:59:59.000+00:00"],
            ["2020-10-03T14:00:00.000+00:00", "2020-10-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B29B1E1F-B572-5428-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-24T13:00:00.000+00:00", "2020-10-26T12:59:59.000+00:00"],
            ["2020-10-24T13:00:00.000+00:00", "2020-10-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B2C3489A-C021-555C-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-27T13:00:00.000+00:00", "2020-11-02T12:59:59.000+00:00"],
            ["2020-10-27T13:00:00.000+00:00", "2020-11-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B327EF10-DE19-5F9E-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-31T13:00:00.000+00:00", "2020-11-14T12:59:59.000+00:00"],
            ["2020-10-31T13:00:00.000+00:00", "2020-11-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B441800B-955F-799E-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-04T13:00:00.000+00:00", "2020-11-15T12:59:59.000+00:00"],
            ["2020-11-04T13:00:00.000+00:00", "2020-11-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B469DE60-0F65-24E5-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-16T13:00:00.000+00:00", "2020-11-19T12:59:59.000+00:00"],
            ["2020-11-16T13:00:00.000+00:00", "2020-11-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B47DE98D-F62B-23D9-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-18T13:00:00.000+00:00", "2020-11-24T12:59:59.000+00:00"],
            ["2020-11-18T13:00:00.000+00:00", "2020-11-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B47DE98D-F62C-23D9-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-18T13:00:00.000+00:00", "2020-11-20T12:59:59.000+00:00"],
            ["2020-11-18T13:00:00.000+00:00", "2020-11-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B4F6A88A-970D-3013-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-23T13:00:00.000+00:00", "2020-12-02T12:59:59.000+00:00"],
            ["2020-11-23T13:00:00.000+00:00", "2020-12-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B55B203C-4413-2B51-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-28T13:00:00.000+00:00", "2020-12-22T12:59:59.000+00:00"],
            ["2020-11-28T13:00:00.000+00:00", "2020-12-22T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B5837237-1C1C-2733-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-01T13:00:00.000+00:00", "2020-12-04T12:59:59.000+00:00"],
            ["2020-12-01T13:00:00.000+00:00", "2020-12-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B5FC0FF3-BA02-1F1E-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-04T13:00:00.000+00:00", "2020-12-20T12:59:59.000+00:00"],
            ["2020-12-04T13:00:00.000+00:00", "2020-12-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B7663A55-3AC8-6E82-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-24T13:00:00.000+00:00", "2021-01-03T12:59:59.000+00:00"],
            ["2020-12-24T13:00:00.000+00:00", "2021-01-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B8072717-5D30-577F-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-02T13:00:00.000+00:00", "2021-01-05T12:59:59.000+00:00"],
            ["2021-01-02T13:00:00.000+00:00", "2021-01-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B82F636B-5DD2-7607-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-03T13:00:00.000+00:00", "2021-01-15T12:59:59.000+00:00"],
            ["2021-01-03T13:00:00.000+00:00", "2021-01-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B8578F62-780F-0CA9-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-05T13:00:00.000+00:00", "2021-01-25T12:59:59.000+00:00"],
            ["2021-01-05T13:00:00.000+00:00", "2021-01-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "B920CE52-BB8C-13DD-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-12T13:00:00.000+00:00", "2021-01-29T12:59:59.000+00:00"],
            ["2021-01-12T13:00:00.000+00:00", "2021-01-29T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BA62A94D-E6F0-377D-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-31T13:00:00.000+00:00", "2021-02-17T12:59:59.000+00:00"],
            ["2021-01-31T13:00:00.000+00:00", "2021-02-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BA62A94D-E6F1-377D-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-31T13:00:00.000+00:00", "2021-02-21T12:59:59.000+00:00"],
            ["2021-01-31T13:00:00.000+00:00", "2021-02-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BBF4EAA4-B0FE-66F4-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-20T13:00:00.000+00:00", "2021-02-25T12:59:59.000+00:00"],
            ["2021-02-20T13:00:00.000+00:00", "2021-02-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BC1D3FC1-C70E-17C3-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-23T13:00:00.000+00:00", "2021-02-27T12:59:59.000+00:00"],
            ["2021-02-23T13:00:00.000+00:00", "2021-02-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BC599167-1B79-3D97-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-02-26T13:00:00.000+00:00", "2021-03-01T12:59:59.000+00:00"],
            ["2021-02-26T13:00:00.000+00:00", "2021-03-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BCBE27AE-9168-0E10-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-03-02T13:00:00.000+00:00", "2021-03-16T12:59:59.000+00:00"],
            ["2021-03-02T13:00:00.000+00:00", "2021-03-16T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BCBE27AE-9169-0E10-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-03-03T13:00:00.000+00:00", "2021-03-08T12:59:59.000+00:00"],
            ["2021-03-03T13:00:00.000+00:00", "2021-03-08T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BDB20909-EDBC-6673-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-03-12T13:00:00.000+00:00", "2021-03-15T12:59:59.000+00:00"],
            ["2021-03-12T13:00:00.000+00:00", "2021-03-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BDC3B0D3-327F-31BF-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-03-15T13:00:00.000+00:00", "2021-04-06T13:59:59.000+00:00"],
            ["2021-03-15T13:00:00.000+00:00", "2021-04-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BE0003C0-E3D5-6F35-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-03-18T13:00:00.000+00:00", "2021-04-08T13:59:59.000+00:00"],
            ["2021-03-18T13:00:00.000+00:00", "2021-04-08T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BF7E3941-4902-6F26-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-07T14:00:00.000+00:00", "2021-04-10T13:59:59.000+00:00"],
            ["2021-04-07T14:00:00.000+00:00", "2021-04-10T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BFA67527-F9A8-0F1C-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-08T14:00:00.000+00:00", "2021-04-24T13:59:59.000+00:00"],
            ["2021-04-08T14:00:00.000+00:00", "2021-04-24T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C01F18F9-3E38-6B40-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-14T14:00:00.000+00:00", "2021-04-21T13:59:59.000+00:00"],
            ["2021-04-14T14:00:00.000+00:00", "2021-04-21T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C0FC7222-ABEF-75EC-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-26T14:00:00.000+00:00", "2021-05-18T13:59:59.000+00:00"],
            ["2021-04-26T14:00:00.000+00:00", "2021-05-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C1249CA3-6DD5-4BA4-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-27T14:00:00.000+00:00", "2021-05-10T13:59:59.000+00:00"],
            ["2021-04-27T14:00:00.000+00:00", "2021-05-10T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C2525BC2-703A-4B15-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-11T14:00:00.000+00:00", "2021-05-24T13:59:59.000+00:00"],
            ["2021-05-11T14:00:00.000+00:00", "2021-05-24T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C2F35BD1-26C1-0981-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-21T14:00:00.000+00:00", "2021-05-26T13:59:59.000+00:00"],
            ["2021-05-21T14:00:00.000+00:00", "2021-05-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C343D6DF-E115-328E-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-26T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
            ["2021-05-26T14:00:00.000+00:00", "2021-06-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C357E2E2-1B54-55BC-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-26T14:00:00.000+00:00", "2021-05-29T13:59:59.000+00:00"],
            ["2021-05-26T14:00:00.000+00:00", "2021-05-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C3A85A4B-4F2E-09E3-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-29T14:00:00.000+00:00", "2021-06-14T13:59:59.000+00:00"],
            ["2021-05-29T14:00:00.000+00:00", "2021-06-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C5DE6E2C-B19C-616A-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-18T14:00:00.000+00:00", "2021-06-21T13:59:59.000+00:00"],
            ["2021-06-18T14:00:00.000+00:00", "2021-06-21T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C5DE6E2C-B19D-616A-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-18T14:00:00.000+00:00", "2021-07-04T13:59:59.000+00:00"],
            ["2021-06-18T14:00:00.000+00:00", "2021-07-04T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C5DE6E2C-B19E-616A-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-08T14:00:00.000+00:00", "2021-06-16T13:59:59.000+00:00"],
            ["2021-06-08T14:00:00.000+00:00", "2021-06-16T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C5DE6E2C-B19F-616A-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-06-02T14:00:00.000+00:00", "2021-06-06T13:59:59.000+00:00"],
            ["2021-06-02T14:00:00.000+00:00", "2021-06-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C690A7D6-B417-2A2B-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-07-06T14:00:00.000+00:00", "2021-07-12T13:59:59.000+00:00"],
            ["2021-07-06T14:00:00.000+00:00", "2021-07-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C8C3EAF8-4670-13E4-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-01T14:00:00.000+00:00", "2021-08-12T13:59:59.000+00:00"],
            ["2021-08-01T14:00:00.000+00:00", "2021-08-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "C9C971DA-E954-3942-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-15T14:00:00.000+00:00", "2021-08-29T13:59:59.000+00:00"],
            ["2021-08-15T14:00:00.000+00:00", "2021-08-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CA6A5E62-C440-4917-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-23T14:00:00.000+00:00", "2021-09-06T13:59:59.000+00:00"],
            ["2021-08-23T14:00:00.000+00:00", "2021-09-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CB0B4F3B-CCBF-432A-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-31T14:00:00.000+00:00", "2021-09-20T13:59:59.000+00:00"],
            ["2021-08-31T14:00:00.000+00:00", "2021-09-20T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CBC05BCE-77D2-0C25-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-07T14:00:00.000+00:00", "2021-09-18T13:59:59.000+00:00"],
            ["2021-09-07T14:00:00.000+00:00", "2021-09-18T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CC8983DE-84BC-3AA2-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-19T14:00:00.000+00:00", "2021-10-04T12:59:59.000+00:00"],
            ["2021-09-19T14:00:00.000+00:00", "2021-10-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CCB1BF4D-62AC-307D-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-22T14:00:00.000+00:00", "2021-09-30T13:59:59.000+00:00"],
            ["2021-09-22T14:00:00.000+00:00", "2021-09-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CD8F0A4C-C6AF-2DB3-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-10-01T14:00:00.000+00:00", "2021-10-06T12:59:59.000+00:00"],
            ["2021-10-01T14:00:00.000+00:00", "2021-10-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CDDF818C-91BF-0643-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-10-06T13:00:00.000+00:00", "2021-10-27T12:59:59.000+00:00"],
            ["2021-10-06T13:00:00.000+00:00", "2021-10-27T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CE1BDB0D-95C3-0C9D-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-10-09T13:00:00.000+00:00", "2021-11-01T12:59:59.000+00:00"],
            ["2021-10-09T13:00:00.000+00:00", "2021-11-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CF5DB88B-7259-7073-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-10-26T13:00:00.000+00:00", "2021-10-29T12:59:59.000+00:00"],
            ["2021-10-26T13:00:00.000+00:00", "2021-10-29T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "CFAE2FED-D4A6-1EA0-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-10-29T13:00:00.000+00:00", "2021-11-11T12:59:59.000+00:00"],
            ["2021-10-29T13:00:00.000+00:00", "2021-11-11T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D03AFF49-A150-33C1-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-04T13:00:00.000+00:00", "2021-11-26T12:59:59.000+00:00"],
            ["2021-11-04T13:00:00.000+00:00", "2021-11-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D0C7D1B1-A14D-4893-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-12T13:00:00.000+00:00", "2021-11-21T12:59:59.000+00:00"],
            ["2021-11-12T13:00:00.000+00:00", "2021-11-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D190FC18-DFB4-398E-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-22T13:00:00.000+00:00", "2021-11-30T12:59:59.000+00:00"],
            ["2021-11-22T13:00:00.000+00:00", "2021-11-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D21DCCFD-5FEA-6CBA-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-29T13:00:00.000+00:00", "2021-12-10T12:59:59.000+00:00"],
            ["2021-11-29T13:00:00.000+00:00", "2021-12-10T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D231EAD4-0299-551D-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-01T13:00:00.000+00:00", "2021-12-21T12:59:59.000+00:00"],
            ["2021-12-01T13:00:00.000+00:00", "2021-12-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D3376EB8-8A79-5065-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-13T13:00:00.000+00:00", "2021-12-16T12:59:59.000+00:00"],
            ["2021-12-13T13:00:00.000+00:00", "2021-12-16T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D3376EB8-8A7A-5065-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-15T13:00:00.000+00:00", "2021-12-29T12:59:59.000+00:00"],
            ["2021-12-15T13:00:00.000+00:00", "2021-12-29T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D3D85D7F-0D05-3C6A-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-22T13:00:00.000+00:00", "2021-12-26T12:59:59.000+00:00"],
            ["2021-12-22T13:00:00.000+00:00", "2021-12-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D428D4D8-A7DA-62CA-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-26T13:00:00.000+00:00", "2021-12-29T12:59:59.000+00:00"],
            ["2021-12-26T13:00:00.000+00:00", "2021-12-29T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D4B5A5C3-AE02-47AB-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-01-02T13:00:00.000+00:00", "2022-01-15T12:59:59.000+00:00"],
            ["2022-01-02T13:00:00.000+00:00", "2022-01-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D4C9C395-DA2A-39FA-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-01-01T13:00:00.000+00:00", "2022-01-23T12:59:59.000+00:00"],
            ["2022-01-01T13:00:00.000+00:00", "2022-01-23T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D5E36575-FE7C-4CDB-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-01-16T13:00:00.000+00:00", "2022-02-01T12:59:59.000+00:00"],
            ["2022-01-16T13:00:00.000+00:00", "2022-02-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D647FA8D-8236-5539-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-01-22T13:00:00.000+00:00", "2022-01-25T12:59:59.000+00:00"],
            ["2022-01-22T13:00:00.000+00:00", "2022-01-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D6C0ABB4-3F50-4518-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-01-28T13:00:00.000+00:00", "2022-02-15T12:59:59.000+00:00"],
            ["2022-01-28T13:00:00.000+00:00", "2022-02-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D7395F40-70D4-4070-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-02-03T13:00:00.000+00:00", "2022-02-13T12:59:59.000+00:00"],
            ["2022-02-03T13:00:00.000+00:00", "2022-02-13T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D852FFFE-F2B7-3249-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-02-17T13:00:00.000+00:00", "2022-03-11T12:59:59.000+00:00"],
            ["2022-02-17T13:00:00.000+00:00", "2022-03-11T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D87B3B8B-99EB-7344-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-02-18T13:00:00.000+00:00", "2022-03-02T12:59:59.000+00:00"],
            ["2022-02-18T13:00:00.000+00:00", "2022-03-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "D980BF03-1989-3D86-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-04T13:00:00.000+00:00", "2022-03-24T12:59:59.000+00:00"],
            ["2022-03-04T13:00:00.000+00:00", "2022-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "DB8BC704-BEA4-1092-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-26T13:00:00.000+00:00", "2022-04-02T12:59:59.000+00:00"],
            ["2022-03-26T13:00:00.000+00:00", "2022-04-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "DB8BC704-BEA5-1092-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-17T13:00:00.000+00:00", "2022-03-24T12:59:59.000+00:00"],
            ["2022-03-17T13:00:00.000+00:00", "2022-03-24T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "DBDC3E65-F339-302E-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-04-04T14:00:00.000+00:00", "2022-04-21T13:59:59.000+00:00"],
            ["2022-04-04T14:00:00.000+00:00", "2022-04-21T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "DBF05C5D-D27D-13AE-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-04-02T13:00:00.000+00:00", "2022-04-08T13:59:59.000+00:00"],
            ["2022-04-02T13:00:00.000+00:00", "2022-04-08T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "DE4BDE6A-8CB1-1335-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-04-25T14:00:00.000+00:00", "2022-05-17T13:59:59.000+00:00"],
            ["2022-04-25T14:00:00.000+00:00", "2022-05-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "DE4BDE6A-8CB2-1335-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-04-13T14:00:00.000+00:00", "2022-05-03T13:59:59.000+00:00"],
            ["2022-04-13T14:00:00.000+00:00", "2022-05-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E16374D7-90F1-1BD3-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-06-01T14:00:00.000+00:00", "2022-06-10T13:59:59.000+00:00"],
            ["2022-06-01T14:00:00.000+00:00", "2022-06-10T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E16374D7-90F2-1BD3-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-06-12T14:00:00.000+00:00", "2022-06-17T13:59:59.000+00:00"],
            ["2022-06-12T14:00:00.000+00:00", "2022-06-17T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E16374D7-90F3-1BD3-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-11T14:00:00.000+00:00", "2022-05-24T13:59:59.000+00:00"],
            ["2022-05-11T14:00:00.000+00:00", "2022-05-24T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E16374D7-90F4-1BD3-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-25T14:00:00.000+00:00", "2022-05-28T13:59:59.000+00:00"],
            ["2022-05-25T14:00:00.000+00:00", "2022-05-28T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E16374D7-90F5-1BD3-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-27T14:00:00.000+00:00", "2022-05-30T13:59:59.000+00:00"],
            ["2022-05-27T14:00:00.000+00:00", "2022-05-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E16374D7-90F6-1BD3-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-25T14:00:00.000+00:00", "2022-06-11T13:59:59.000+00:00"],
            ["2022-05-25T14:00:00.000+00:00", "2022-06-11T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E198C1A1-0814-68DE-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-06-13T14:00:00.000+00:00", "2022-06-29T13:59:59.000+00:00"],
            ["2022-06-13T14:00:00.000+00:00", "2022-06-29T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E1ACDFB2-0768-4614-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-06-16T14:00:00.000+00:00", "2022-06-19T13:59:59.000+00:00"],
            ["2022-06-16T14:00:00.000+00:00", "2022-06-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E2EEBF0D-4A80-3B34-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-01T14:00:00.000+00:00", "2022-07-13T13:59:59.000+00:00"],
            ["2022-07-01T14:00:00.000+00:00", "2022-07-13T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E3F44324-0805-69D8-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-15T14:00:00.000+00:00", "2022-07-28T13:59:59.000+00:00"],
            ["2022-07-15T14:00:00.000+00:00", "2022-07-28T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E458D838-77B8-0BCE-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-19T14:00:00.000+00:00", "2022-07-26T13:59:59.000+00:00"],
            ["2022-07-19T14:00:00.000+00:00", "2022-07-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E4E5A91A-B438-3AB3-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-27T14:00:00.000+00:00", "2022-07-30T13:59:59.000+00:00"],
            ["2022-07-27T14:00:00.000+00:00", "2022-07-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E52202AF-8DCF-56E7-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-07-29T14:00:00.000+00:00", "2022-08-19T13:59:59.000+00:00"],
            ["2022-07-29T14:00:00.000+00:00", "2022-08-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E58697DE-49EF-4B85-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-04T14:00:00.000+00:00", "2022-08-06T13:59:59.000+00:00"],
            ["2022-08-04T14:00:00.000+00:00", "2022-08-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E6DC913F-5481-702C-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-21T14:00:00.000+00:00", "2022-09-10T13:59:59.000+00:00"],
            ["2022-08-21T14:00:00.000+00:00", "2022-09-10T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E923F4AC-6E03-4D49-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-19T14:00:00.000+00:00", "2022-09-26T13:59:59.000+00:00"],
            ["2022-09-19T14:00:00.000+00:00", "2022-09-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "E99CA797-5458-2774-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-26T14:00:00.000+00:00", "2022-10-06T12:59:59.000+00:00"],
            ["2022-09-26T14:00:00.000+00:00", "2022-10-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EA51B444-0665-4D38-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-09-22T14:00:00.000+00:00", "2022-10-04T12:59:59.000+00:00"],
            ["2022-09-22T14:00:00.000+00:00", "2022-10-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EA8E0DAE-170E-6DCC-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-10-02T13:00:00.000+00:00", "2022-10-15T12:59:59.000+00:00"],
            ["2022-10-02T13:00:00.000+00:00", "2022-10-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EB1ADEAA-FD58-3C04-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-10-14T13:00:00.000+00:00", "2022-10-17T12:59:59.000+00:00"],
            ["2022-10-14T13:00:00.000+00:00", "2022-10-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EB2EFC63-82B9-2326-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-10-10T13:00:00.000+00:00", "2022-10-17T12:59:59.000+00:00"],
            ["2022-10-10T13:00:00.000+00:00", "2022-10-17T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EB7F73C1-145A-384E-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-10-18T13:00:00.000+00:00", "2022-11-04T12:59:59.000+00:00"],
            ["2022-10-18T13:00:00.000+00:00", "2022-11-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EB939192-A8E1-1DD4-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-10-19T13:00:00.000+00:00", "2022-11-06T12:59:59.000+00:00"],
            ["2022-10-19T13:00:00.000+00:00", "2022-11-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ED25E671-FA59-4C51-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-08T13:00:00.000+00:00", "2022-11-19T12:59:59.000+00:00"],
            ["2022-11-08T13:00:00.000+00:00", "2022-11-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ED4E2230-257D-727C-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-09T13:00:00.000+00:00", "2022-11-25T12:59:59.000+00:00"],
            ["2022-11-09T13:00:00.000+00:00", "2022-11-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EE2B6A5C-A3A2-613F-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-21T13:00:00.000+00:00", "2022-12-13T12:59:59.000+00:00"],
            ["2022-11-21T13:00:00.000+00:00", "2022-12-13T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EEA41D76-B8E6-28D9-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-27T13:00:00.000+00:00", "2022-12-08T12:59:59.000+00:00"],
            ["2022-11-27T13:00:00.000+00:00", "2022-12-08T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EFA9A160-C783-100E-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-12-09T13:00:00.000+00:00", "2022-12-23T12:59:59.000+00:00"],
            ["2022-12-09T13:00:00.000+00:00", "2022-12-23T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "EFFA18DD-F09F-0F67-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-12-15T13:00:00.000+00:00", "2022-12-30T12:59:59.000+00:00"],
            ["2022-12-15T13:00:00.000+00:00", "2022-12-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F0EB7CAD-A692-0E9E-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-12-27T13:00:00.000+00:00", "2023-01-07T12:59:59.000+00:00"],
            ["2022-12-27T13:00:00.000+00:00", "2023-01-07T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F1784DE8-7BEC-122C-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-02T13:00:00.000+00:00", "2023-01-19T12:59:59.000+00:00"],
            ["2023-01-02T13:00:00.000+00:00", "2023-01-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F1F102BD-02B6-2AEF-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-08T13:00:00.000+00:00", "2023-01-14T12:59:59.000+00:00"],
            ["2023-01-08T13:00:00.000+00:00", "2023-01-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F2417A2F-EB0C-20F2-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-13T13:00:00.000+00:00", "2023-01-16T12:59:59.000+00:00"],
            ["2023-01-13T13:00:00.000+00:00", "2023-01-16T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F25597F2-31C6-7399-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-15T13:00:00.000+00:00", "2023-01-21T12:59:59.000+00:00"],
            ["2023-01-15T13:00:00.000+00:00", "2023-01-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F2F686B8-7BA4-5F82-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-21T13:00:00.000+00:00", "2023-02-06T12:59:59.000+00:00"],
            ["2023-01-21T13:00:00.000+00:00", "2023-02-06T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F346FE1A-3CF3-56ED-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-25T13:00:00.000+00:00", "2023-02-08T12:59:59.000+00:00"],
            ["2023-01-25T13:00:00.000+00:00", "2023-02-08T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F488DB86-DDDE-12F6-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-02-10T13:00:00.000+00:00", "2023-02-25T12:59:59.000+00:00"],
            ["2023-02-10T13:00:00.000+00:00", "2023-02-25T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F5CAB751-728A-389E-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-02-26T13:00:00.000+00:00", "2023-03-19T12:59:59.000+00:00"],
            ["2023-02-26T13:00:00.000+00:00", "2023-03-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F6BE5C94-DA78-1565-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-02-15T13:00:00.000+00:00", "2023-03-09T12:59:59.000+00:00"],
            ["2023-02-15T13:00:00.000+00:00", "2023-03-09T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F6BE5C94-DA79-1565-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-10T13:00:00.000+00:00", "2023-03-21T12:59:59.000+00:00"],
            ["2023-03-10T13:00:00.000+00:00", "2023-03-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F6BE5C94-DA7A-1565-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-02-08T13:00:00.000+00:00", "2023-02-11T12:59:59.000+00:00"],
            ["2023-02-08T13:00:00.000+00:00", "2023-02-11T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F7712B9B-22DC-3C84-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-20T13:00:00.000+00:00", "2023-03-23T12:59:59.000+00:00"],
            ["2023-03-20T13:00:00.000+00:00", "2023-03-23T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F799674C-3A68-6D52-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-21T13:00:00.000+00:00", "2023-04-03T13:59:59.000+00:00"],
            ["2023-03-21T13:00:00.000+00:00", "2023-04-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F7AD852C-C895-47F0-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-22T13:00:00.000+00:00", "2023-04-01T12:59:59.000+00:00"],
            ["2023-03-22T13:00:00.000+00:00", "2023-04-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F8C72716-FB34-4F81-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-04-05T14:00:00.000+00:00", "2023-04-23T13:59:59.000+00:00"],
            ["2023-04-05T14:00:00.000+00:00", "2023-04-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F92BBC2D-74B4-407C-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-04-09T14:00:00.000+00:00", "2023-04-28T13:59:59.000+00:00"],
            ["2023-04-09T14:00:00.000+00:00", "2023-04-28T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "FA1D1F9D-9C8A-0B36-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-04-22T14:00:00.000+00:00", "2023-04-25T13:59:59.000+00:00"],
            ["2023-04-22T14:00:00.000+00:00", "2023-04-25T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "FA455E6A-E142-2CC0-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-04-24T14:00:00.000+00:00", "2023-04-30T13:59:59.000+00:00"],
            ["2023-04-24T14:00:00.000+00:00", "2023-04-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "FA6D9735-07E2-51AC-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-04-27T14:00:00.000+00:00", "2023-05-08T13:59:59.000+00:00"],
            ["2023-04-27T14:00:00.000+00:00", "2023-05-08T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "FAE64DC4-9AC6-562A-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-05-03T14:00:00.000+00:00", "2023-05-23T13:59:59.000+00:00"],
            ["2023-05-03T14:00:00.000+00:00", "2023-05-23T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "FB36C257-F723-5618-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-05-08T14:00:00.000+00:00", "2023-05-26T13:59:59.000+00:00"],
            ["2023-05-08T14:00:00.000+00:00", "2023-05-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "03671CBF-803B-158D-E064-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-08-15T14:00:00.000+00:00", null],
            ["2023-08-15T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "19ff51dc-9750-4d8f-9f5e-4bb36051f107",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-05-30T14:00:00.000+00:00", null],
            ["2022-05-30T14:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "50f9d8bd-eeee-41cb-aea4-d58b0679f78a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-08-07T14:00:00.000+00:00", "2023-10-31T12:59:59.000+00:00"],
            ["2023-08-07T14:00:00.000+00:00", "2023-10-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "54cae135-2bc1-4f6a-8941-063a359e8c74",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-11-30T13:00:00.000+00:00", null],
            ["2019-11-30T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "99193599-75d5-4745-a8d9-3a0041e6ee64",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-10-14T13:00:00.000+00:00", null],
            ["2021-10-14T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A337A7D4-3447-6ADE-E054-0010E056919A",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-09-10T14:00:00.000+00:00", "2023-09-04T13:59:59.000+00:00"],
            ["2020-09-10T14:00:00.000+00:00", "2023-09-04T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "A7C9FCB3-68A1-6138-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-26T13:00:00.000+00:00", "2024-06-12T13:59:59.000+00:00"],
            ["2019-01-26T13:00:00.000+00:00", "2024-06-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "AA832240-10B3-7223-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-26T14:00:00.000+00:00", "2024-07-12T13:59:59.000+00:00"],
            ["2019-05-26T14:00:00.000+00:00", "2024-07-12T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "BD0E8C97-FA84-418B-E054-022128574717",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-27T13:00:00.000+00:00", "2024-07-13T13:59:59.000+00:00"],
            ["2019-01-27T13:00:00.000+00:00", "2024-07-13T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F6BE5C94-DA7B-1565-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-09T13:00:00.000+00:00", null],
            ["2023-03-09T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "F6BE5C94-DA7C-1565-E054-6805CAA9DBF0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-09T13:00:00.000+00:00", null],
            ["2023-03-09T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b4014ccb-06e0-45ca-a507-3dea7e0f442b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-04-09T14:00:00.000+00:00", "2020-10-18T12:59:59.000+00:00"],
            ["2020-04-09T14:00:00.000+00:00", "2020-10-18T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2fcaec3b-2828-451f-89a6-215db3db3cf1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-07T13:00:00.000+00:00", "2020-04-08T13:59:59.000+00:00"],
            ["2020-03-07T13:00:00.000+00:00", "2020-04-08T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "52274977-d58e-47fc-8bc0-f438837f6ea4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-08-11T14:00:00.000+00:00", "2021-09-03T13:59:59.000+00:00"],
            ["2021-08-11T14:00:00.000+00:00", "2021-09-03T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "525b46fc-fedb-482b-ae89-9cf355d79ce7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-01T14:00:00.000+00:00", "2019-05-14T13:59:59.000+00:00"],
            ["2019-05-01T14:00:00.000+00:00", "2019-05-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7ccc16a1-fb39-42d9-9bf6-9dffaa0bafa3",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-31T13:00:00.000+00:00", "2019-11-01T12:59:59.000+00:00"],
            ["2019-10-31T13:00:00.000+00:00", "2019-11-01T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9e27e495-5bd3-4e9c-a956-b387cbefdd4a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-05-31T14:00:00.000+00:00", "2021-09-30T13:59:59.000+00:00"],
            ["2021-05-31T14:00:00.000+00:00", "2021-09-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "69a54e85-597a-4c0e-824b-32ef4fb9b1e2",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-07T13:00:00.000+00:00", "2020-04-08T13:59:59.000+00:00"],
            ["2020-03-07T13:00:00.000+00:00", "2020-04-08T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7238c10f-a4e7-423d-be6f-48e3b3512bce",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-10T14:00:00.000+00:00", "2021-06-02T13:59:59.000+00:00"],
            ["2019-09-10T14:00:00.000+00:00", "2021-06-02T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "73c7ab6e-f98d-4737-93a3-9a30e53ba66e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-28T13:00:00.000+00:00", "2023-02-13T12:59:59.000+00:00"],
            ["2020-10-28T13:00:00.000+00:00", "2023-02-13T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "84cf58a5-66f9-425f-a704-b9079be816f7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-31T13:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
            ["2020-10-31T13:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9d12f638-45a2-43e0-86a8-3a9216cca1e7",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-31T14:00:00.000+00:00", "2019-10-31T12:59:59.000+00:00"],
            ["2019-08-31T14:00:00.000+00:00", "2019-10-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ac6a1809-7239-4b6a-ad23-722750006868",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-05T13:00:00.000+00:00", "2023-03-04T12:59:59.000+00:00"],
            ["2022-11-05T13:00:00.000+00:00", "2023-03-04T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b6013ce3-5c19-4243-804e-6ff7c3469cac",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-10T13:00:00.000+00:00", "2020-12-30T12:59:59.000+00:00"],
            ["2020-01-10T13:00:00.000+00:00", "2020-12-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2b985f42-c369-4e9d-95fc-e08ba729052d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-01-09T13:00:00.000+00:00", "2020-03-05T12:59:59.000+00:00"],
            ["2020-01-09T13:00:00.000+00:00", "2020-03-05T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3fb7fe49-e552-4503-80e7-08b4afc69d2a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-07-26T14:00:00.000+00:00", "2020-09-26T13:59:59.000+00:00"],
            ["2020-07-26T14:00:00.000+00:00", "2020-09-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "67be607d-48e0-4c65-a833-f43a54aebbba",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-30T14:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
            ["2019-06-30T14:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a8fb5e8a-3e4c-48b8-ad3d-8c9ae03d82cd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-04-08T14:00:00.000+00:00", "2021-06-27T13:59:59.000+00:00"],
            ["2021-04-08T14:00:00.000+00:00", "2021-06-27T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c1c34a57-065f-45db-8714-acc4f5e48993",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-31T13:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
            ["2019-12-31T13:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "32af0387-4e75-41c1-b000-1e37ad4bb366",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-07T13:00:00.000+00:00", "2019-12-14T12:59:59.000+00:00"],
            ["2019-10-07T13:00:00.000+00:00", "2019-12-14T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "38c829d4-6b6d-44a1-9476-f9b0955ce0b8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-31T13:00:00.000+00:00", null],
            ["2019-12-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "446ae502-eeb4-4bfe-9481-b7cbd25cb2b8",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-07T13:00:00.000+00:00", "2019-10-08T12:59:59.000+00:00"],
            ["2019-10-07T13:00:00.000+00:00", "2019-10-08T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "672053ba-95b9-4559-8175-1823bf6971ec",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-12-13T13:00:00.000+00:00", "2023-12-15T12:59:59.000+00:00"],
            ["2023-12-13T13:00:00.000+00:00", "2023-12-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a71bfe39-9c20-4792-b3bb-7dbdd8291472",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-30T14:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
            ["2019-06-30T14:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "404ac4e1-f1db-45fb-a49e-4494aae72be9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-10-12T13:00:00.000+00:00", "2023-02-02T12:59:59.000+00:00"],
            ["2022-10-12T13:00:00.000+00:00", "2023-02-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "55e955ec-7c26-4b78-a568-621af6b031bc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-09T13:00:00.000+00:00", "2022-11-20T12:59:59.000+00:00"],
            ["2022-11-09T13:00:00.000+00:00", "2022-11-20T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7c0c95ec-23ca-4269-a9a9-e3fd003dea1a",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-05T13:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
            ["2020-12-05T13:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a131d610-b3d0-44c8-9f5a-01b5b2b08427",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-31T13:00:00.000+00:00", "2020-01-31T12:59:59.000+00:00"],
            ["2019-10-31T13:00:00.000+00:00", "2020-01-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ba33552d-1cdb-41d9-86ef-220cbe41ba30",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-12-31T13:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
            ["2019-12-31T13:00:00.000+00:00", "2020-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8e11bfa1-bf96-450c-8b1f-814be17317fe",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-31T13:00:00.000+00:00", null],
            ["2020-12-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9506be86-b6e0-4589-8d28-91dddf091f55",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-02-27T13:00:00.000+00:00", "2022-03-26T12:59:59.000+00:00"],
            ["2022-02-27T13:00:00.000+00:00", "2022-03-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "9fb02277-0237-4098-b284-faad6fe3f397",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-31T13:00:00.000+00:00", null],
            ["2020-12-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "b0a85a12-7409-4199-83d4-9691fa1daaa4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-31T13:00:00.000+00:00", "2022-12-31T12:59:59.000+00:00"],
            ["2021-12-31T13:00:00.000+00:00", "2022-12-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "ba6c9c47-a2a8-4015-b006-14e16292b210",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-03T13:00:00.000+00:00", "2021-12-07T12:59:59.000+00:00"],
            ["2021-11-03T13:00:00.000+00:00", "2021-12-07T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c785d756-d250-4a5f-875f-9fa3e57cdd82",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-31T13:00:00.000+00:00", null],
            ["2020-12-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a1f1303f-edd3-456b-b3c7-43e616391d02",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-01T13:00:00.000+00:00", "2020-11-15T12:59:59.000+00:00"],
            ["2020-11-01T13:00:00.000+00:00", "2020-11-15T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c49b30cf-c95b-45aa-b4b9-9c66364fd546",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-30T14:00:00.000+00:00", "2020-07-14T13:59:59.000+00:00"],
            ["2019-06-30T14:00:00.000+00:00", "2020-07-14T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0c3ce59d-1aab-499c-9655-6870a735b0cc",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-30T14:00:00.000+00:00", "2021-10-31T12:59:59.000+00:00"],
            ["2021-09-30T14:00:00.000+00:00", "2021-10-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2af624ad-2e31-48fa-a2f9-ec8e82678b17",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-02-27T13:00:00.000+00:00", "2022-03-26T12:59:59.000+00:00"],
            ["2022-02-27T13:00:00.000+00:00", "2022-03-26T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8783acc6-c5fd-4b49-8904-ed18f7b3bc8e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-06-30T14:00:00.000+00:00", "2022-10-31T12:59:59.000+00:00"],
            ["2020-06-30T14:00:00.000+00:00", "2022-10-31T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "a86b9bca-1982-4669-ab81-a1c6fb8c583e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-30T14:00:00.000+00:00", "2022-05-01T13:59:59.000+00:00"],
            ["2021-09-30T14:00:00.000+00:00", "2022-05-01T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1af5519a-5d98-409d-bfe5-44b96c56cf78",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-02-24T13:00:00.000+00:00", null],
            ["2022-02-24T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "30114fb2-4feb-40ff-a67d-8e2983af01de",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-09-30T14:00:00.000+00:00", "2020-12-30T12:59:59.000+00:00"],
            ["2019-09-30T14:00:00.000+00:00", "2020-12-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "3fd37e52-12cf-4b59-8873-96b82bc955c9",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2024-02-29T13:00:00.000+00:00", null],
            ["2024-02-29T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5695b7b7-faa8-45fa-a942-376e13cfb932",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-11-04T13:00:00.000+00:00", "2020-11-21T12:59:59.000+00:00"],
            ["2020-11-04T13:00:00.000+00:00", "2020-11-21T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "1c739022-c703-4e95-8bea-7f4eb2312b13",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-08-20T14:00:00.000+00:00", "2019-09-06T13:59:59.000+00:00"],
            ["2019-08-20T14:00:00.000+00:00", "2019-09-06T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "49a297f2-48f5-4770-bccf-a21be78ec813",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-06-30T14:00:00.000+00:00", "2023-06-30T13:59:59.000+00:00"],
            ["2019-06-30T14:00:00.000+00:00", "2023-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "6a222348-4cc3-4684-9ff8-e19a960d741d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-09-30T14:00:00.000+00:00", "2021-11-30T12:59:59.000+00:00"],
            ["2021-09-30T14:00:00.000+00:00", "2021-11-30T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "709b291b-a453-452a-b0a2-e6c8a7249045",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-01-02T13:00:00.000+00:00", "2023-07-19T13:59:59.000+00:00"],
            ["2023-01-02T13:00:00.000+00:00", "2023-07-19T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "8365120c-20c9-4571-a523-61e9443430a4",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-30T13:00:00.000+00:00", "2022-12-02T12:59:59.000+00:00"],
            ["2022-11-30T13:00:00.000+00:00", "2022-12-02T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "bbd8bb75-9921-434f-ad07-3606685d4dcf",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-01-18T13:00:00.000+00:00", null],
            ["2021-01-18T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c353b247-abb1-46cf-bfe2-aa65e727eca5",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-12-31T13:00:00.000+00:00", null],
            ["2020-12-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c3265008-5647-4b98-a10d-3b42ba12d0dd",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-11-12T13:00:00.000+00:00", "2022-11-19T12:59:59.000+00:00"],
            ["2022-11-12T13:00:00.000+00:00", "2022-11-19T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c345fe8a-78a6-45ca-a3ac-1a44a31a4d08",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-11-10T13:00:00.000+00:00", "2022-02-03T12:59:59.000+00:00"],
            ["2021-11-10T13:00:00.000+00:00", "2022-02-03T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "16149125-d7f4-4143-8d2d-131399c1bba0",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-08-12T14:00:00.000+00:00", "2022-08-13T13:59:59.000+00:00"],
            ["2022-08-12T14:00:00.000+00:00", "2022-08-13T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "67294ab0-b38b-43f6-b2fc-a02799be39ec",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2023-03-25T13:00:00.000+00:00", null],
            ["2023-03-25T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "7234752b-249b-4d39-b39f-12bb01503d04",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-10-23T13:00:00.000+00:00", null],
            ["2020-10-23T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "06cc20aa-fd46-47f7-871c-01a63d468ddf",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-03-25T13:00:00.000+00:00", "2022-05-04T13:59:59.000+00:00"],
            ["2022-03-25T13:00:00.000+00:00", "2022-05-04T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "2dcee86e-3bc3-43af-be7c-7d6d51065725",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2022-10-10T13:00:00.000+00:00", "2023-10-13T12:59:59.000+00:00"],
            ["2022-10-10T13:00:00.000+00:00", "2023-10-13T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c2d17720-fdd1-44a5-9ae8-9e17cdbe353d",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2021-12-31T13:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
            ["2021-12-31T13:00:00.000+00:00", "2022-06-30T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "0478852b-27ad-48dc-833f-ae93920ce73e",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-01-28T13:00:00.000+00:00", null],
            ["2019-01-28T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "5a20d372-1400-494a-b593-9673e6207d0b",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-02-04T13:00:00.000+00:00", "2019-02-07T12:59:59.000+00:00"],
            ["2019-02-04T13:00:00.000+00:00", "2019-02-07T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "aaaca7e7-760b-44ce-be08-838d530ab348",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2020-03-31T13:00:00.000+00:00", null],
            ["2020-03-31T13:00:00.000+00:00", null],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "32bd4139-ad9f-4b74-8281-df4ed4e67af1",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-10-31T13:00:00.000+00:00", "2022-01-12T12:59:59.000+00:00"],
            ["2019-10-31T13:00:00.000+00:00", "2022-01-12T12:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
    {
      properties: {},
      id: "c0d4b54b-f392-4e68-bf57-28626e32ce52",
      links: [],
      extent: {
        spatial: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" },
        temporal: {
          interval: [
            ["2019-05-19T14:00:00.000+00:00", "2019-05-26T13:59:59.000+00:00"],
            ["2019-05-19T14:00:00.000+00:00", "2019-05-26T13:59:59.000+00:00"],
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        },
      },
      itemType: "Collection",
    },
  ],
  total: 970,
  search_after: ["1.0", "51", "c0d4b54b-f392-4e68-bf57-28626e32ce52"],
};

export { responseIdProvider, responseIdTemporal };
