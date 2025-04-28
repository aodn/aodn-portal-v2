const dateDefault = {
  // Must use this format to do search, we do not care about the time
  DATE_TIME_FORMAT: "YYYY-MM-DDT00:00:00[Z]",
  DATE_FORMAT: "YYYY-MM-DD",
  DISPLAY_FORMAT: "DD/MM/YYYY",
  SIMPLE_DATE_FORMAT: "MM-YYYY",
  SIMPLE_Y_M_DATE_FORMAT: "YYYY-MM",
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
  ADDITIONAL_INFO: "additional-info",
  ASSOCIATED_RECORDS: "associated-records",
  CITATION: "citation",
  DATA_ACCESS: "data-access",
  LINEAGE: "lineage",
  METADATA_INFORMATION: "metadata-information",
  SUMMARY: "summary",
};

export { dateDefault, pageDefault, detailPageDefault, marineParkDefault };
