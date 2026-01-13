/**
 * @example
 * addSpacesToCamelCase("pointOfContact") // "point Of Contact"
 */
export const addSpacesToCamelCase = (text: string): string => {
  return text.replace(/([A-Z])/g, " $1").trim();
};
