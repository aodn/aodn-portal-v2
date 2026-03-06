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

const allenCoralAtlasDefault = {
  geojson: "/data/Allen_Coral_Atlas.json",
  acknowledge:
    "Allen Coral Atlas (2020). Imagery, maps and monitoring of the world's tropical coral reefs. doi.org/10.5281/zenodo.3833242 For more information on citation and attribution: https://github.com/CoralMapping/AllenCoralAtlas We would love to hear about any use of our data. Please tell us about it at: support@allencoralatlas.org",
  termsOfUse:
    "Allen Coral Atlas maps, bathymetry and map statistics are © 2018-2023 Allen Coral Atlas Partnership and Arizona State University and licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)",
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

const playwrightTestIds = {
  DETAIL_MAP_POPUP: "map-popup",
};

export {
  allenCoralAtlasDefault,
  dateDefault,
  pageDefault,
  pageReferer,
  detailPageDefault,
  marineParkDefault,
  marineEcoregionOfWorldDefault,
  contactRoles,
  playwrightTestIds,
};
