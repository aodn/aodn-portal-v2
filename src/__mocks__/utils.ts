export const sleep = (milliSecond: number) =>
  new Promise((resolve) => setTimeout(resolve, milliSecond));
