const dateDefault = {
  // Must use this format to do search, we do not care about the time
  DATE_TIME_FORMAT: "YYYY-MM-DDT00:00:00[Z]",
  min: new Date("01/01/1970"),
  max: new Date(),
};

const pageDefault = {
  error: "/error",
  search: "/search",
  details: "/details",
  landing: "/",
};

export { dateDefault, pageDefault };
