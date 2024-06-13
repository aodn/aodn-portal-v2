const trimContent = (c: string | undefined, size: number = 90): string => {
  if (c) {
    return `${c.slice(0, 90)}${c.length > size ? "..." : ""}`;
  } else {
    return "";
  }
};

export { trimContent };
