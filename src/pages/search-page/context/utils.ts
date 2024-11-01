export const checkLoading = (count: number): boolean => {
  if (count > 0) {
    return true;
  }
  if (count === 0) {
    // a 0.5s late finish loading is useful to improve the stability of the system
    setTimeout(() => false, 500);
  }
  if (count < 0) {
    // TODO: use beffer handling to replace this
    throw new Error("Loading counter is negative");
  }
  return false;
};

//util function for join uuids in a specific pattern for fetching data
export const createFilterString = (uuids: Array<string>): string => {
  if (!Array.isArray(uuids) || uuids.length === 0) {
    return "";
  }
  return uuids.map((uuid) => `id='${uuid}'`).join(" or ");
};
