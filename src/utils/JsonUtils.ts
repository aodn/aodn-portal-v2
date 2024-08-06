const parseJson = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Invalid JSON string:", error);
    return null;
  }
};

export { parseJson };
