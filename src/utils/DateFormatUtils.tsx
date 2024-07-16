/**
 * Convert date format from "2021-08-01T00:00:00.000Z" to "Sun Aug 01 2021 05:30:00 GMT+0530" (example)
 * @param dateString
 */
const convertDateFormat = (dateString: string) => {
  const date = new Date(dateString);
  const convertedString = date.toString();
  const index = convertedString.indexOf("(");
  return convertedString.substring(0, index).trim();
};

export { convertDateFormat };
