const dateDefault = {
  // Must use this format to do search, we do not care about the time
  DATE_TIME_FORMAT: "YYYY-MM-DDT00:00:00[Z]",
  DATE_FORMAT: "YYYY-MM-DD",
  DATE_YEAR_MONTH_FORMAT: "YYYY-MM",
  DISPLAY_FORMAT: "DD/MM/YYYY",
  min: new Date("01/01/1970"),
  max: new Date(),
};

const pageDefault = {
  error: "/error",
  degraded: "/degraded",
  search: "/search",
  details: "/details",
  landing: "/",
  url: {
    IMOS: "https://imos.org.au",
    AODN: "https://www.aodn.org.au",
  },
};

const pageReferer = {
  LANDING_PAGE_REFERER: "LANDING_PAGE",
  SEARCH_PAGE_REFERER: "SEARCH_PAGE",
  DETAIL_PAGE_REFERER: "DETAIL_PAGE",
  COMPONENT_COMPLEX_TEXT_REFERER: "COMPONENT_COMPLEX_TEXT_REFER",
};

const marineParkDefault = {
  geojson: "/data/Australian_Marine_Parks_boundaries.json",
  acknowledge:
    "Anyone can see this content, refer to /data/README.md for source",
  termsOfUse:
    "This dataset is released under Creative Commons by Attribution 4.0 International (CC BY 4.0).",
};

const marineEcoregionOfWorldDefault = {
  geojson: "/data/Meow.json",
  acknowledge:
    "Anyone can see this content, refer to /data/README.md for source",
  termsOfUse:
    "This dataset is released under Creative Commons by Attribution 4.0 International (CC BY 4.0).",
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

const contactRoles = {
  ABOUT: "about",
  METADATA: "metadata",
  CITATION: "citation",
};

export {
  dateDefault,
  pageDefault,
  pageReferer,
  detailPageDefault,
  marineParkDefault,
  marineEcoregionOfWorldDefault,
  contactRoles,
};
