import dayjs from "@/utils/dayjs";

const dateDefault = {
  // Wire formats — machine-readable, NOT for display. Do not repoint these.
  DATE_TIME_FORMAT: "YYYY-MM-DDTHH:mm:ss[Z]", // CQL temporal filters
  DATE_FORMAT: "YYYY-MM-DD", // machine day keys, slider I/O

  // Display formats — every user-facing date goes through formatDate().
  DISPLAY_FORMAT: "DD MMM YYYY",
  // Metadata Dates panel: keeps the GeoNetwork time-of-day + GMT+0000 hack.
  DISPLAY_FORMAT_WITH_TIME: "DD MMM YYYY HH:mm:ss [GMT+0000]",
  min: dayjs.tz(0),
  get max() {
    return dayjs.tz();
  },
  get currentYear() {
    return dayjs.tz().year();
  },
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
  geojson: "/api/v1/ogc/ext/static/Australian_Marine_Parks_boundaries.json",
  acknowledge:
    "Anyone can see this content, refer to /data/README.md for source",
  termsOfUse:
    "This dataset is released under Creative Commons by Attribution 4.0 International (CC BY 4.0).",
};

const marineEcoregionOfWorldDefault = {
  geojson: "/api/v1/ogc/ext/static/Meow.json",
  acknowledge:
    "Anyone can see this content, refer to /data/README.md for source",
  termsOfUse:
    "This dataset is released under Creative Commons by Attribution 4.0 International (CC BY 4.0).",
};

const allenCoralAtlasDefault = {
  geojson: "/api/v1/ogc/ext/static/Allen_Coral_Atlas.json",
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
  MAP: "map",
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

const SIMPLE_FILTER_DEFAULT_HEIGHT = 40;

const imosInfoDefault = {
  EMAIL: {
    RECIPIENT: "info@aodn.org.au",
    SUBJECT: "AODN Data Discovery enquiry",
  },
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
  imosInfoDefault,
  playwrightTestIds,
  SIMPLE_FILTER_DEFAULT_HEIGHT,
};
