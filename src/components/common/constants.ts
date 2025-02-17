const dateDefault = {
  // Must use this format to do search, we do not care about the time
  DATE_TIME_FORMAT: "YYYY-MM-DDT00:00:00[Z]",
  DATE_FORMAT: "YYYY-MM-DD",
  SIMPLE_DATE_FORMAT: "MM-YYYY",
  min: new Date("01/01/1970"),
  max: new Date(),
};

const pageDefault = {
  error: "/error",
  search: "/search",
  details: "/details",
  landing: "/",
};

const marineParkDefault = {
  geojson: "./data/Australian_Marine_Parks_boundaries.json",
};

const detailPageDefault = {
  ABOUT: "about",
  ASSOCIATED_RECORDS: "associated records",
  CITATION: "citation",
  LINKS: "links",
  LINEAGE: "lineage",
  METADATA_INFORMATION: "metadata information",
  SUMMARY: "summary",
};

export { dateDefault, pageDefault, detailPageDefault };
