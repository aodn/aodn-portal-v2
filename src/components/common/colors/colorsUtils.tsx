/**
 * Copy from here https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
 *
 * @param str
 * @returns
 */
const stringToColor = (
  s: string,
  saturation: number = 100,
  lightness: number = 75,
  alpha: number = 0.2
) => {
  let hash = 0;

  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return `hsla(${hash % 360}, ${saturation}%, ${lightness}%, ${alpha})`;
};

export { stringToColor };
