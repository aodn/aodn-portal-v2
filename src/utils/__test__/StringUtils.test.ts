import {
  capitalizeFirstLetter,
  decodeHtmlEntities,
  formatNumber,
  truncateText,
} from "../StringUtils";

describe("decodeHtmlEntities", () => {
  it("should decode basic HTML entities", () => {
    const input = "foo&amp;bar";
    const output = decodeHtmlEntities(input);
    expect(output).toBe("foo&bar");
  });

  it("shouldn't decode invalid HTML entities in strict mode", () => {
    const input = "foo&ampbar";
    const output = decodeHtmlEntities(input);
    expect(output).toBe("foo&ampbar");
  });

  it("should handle invalid HTML entities gracefully", () => {
    const input = "foo&invalid;bar";
    const output = decodeHtmlEntities(input);
    expect(output).toBe("foo&invalid;bar");
  });
});

describe("truncateText", () => {
  it("should truncate a string longer than the specified length", () => {
    const input = "Hello, World!";
    const output = truncateText(input, 5);
    expect(output).toBe("Hello...");
  });

  it("should return the original string if it is shorter than the specified length", () => {
    const input = "Hello";
    const output = truncateText(input, 10);
    expect(output).toBe("Hello");
  });

  it("should handle an empty string", () => {
    const input = "";
    const output = truncateText(input, 5);
    expect(output).toBe("");
  });

  it("should return the original string if it is exactly the specified length", () => {
    const input = "Hello";
    const output = truncateText(input, 5);
    expect(output).toBe("Hello");
  });
});

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a lowercase string", () => {
    const input = "hello";
    const output = capitalizeFirstLetter(input);
    expect(output).toBe("Hello");
  });

  it("should capitalize the first letter of an already capitalized string", () => {
    const input = "Hello";
    const output = capitalizeFirstLetter(input);
    expect(output).toBe("Hello");
  });

  it("should handle an empty string", () => {
    const input = "";
    const output = capitalizeFirstLetter(input);
    expect(output).toBe("");
  });

  it("should capitalize the first letter of a string with mixed case", () => {
    const input = "hElLo";
    const output = capitalizeFirstLetter(input);
    expect(output).toBe("Hello");
  });
});

describe("formatNumber", () => {
  it("should format a number with thousands separators", () => {
    const input = 1234567;
    const output = formatNumber(input);
    expect(output).toBe("1,234,567");
  });

  it("should handle a number without thousands separators", () => {
    const input = 123;
    const output = formatNumber(input);
    expect(output).toBe("123");
  });

  it("should handle zero", () => {
    const input = 0;
    const output = formatNumber(input);
    expect(output).toBe("0");
  });

  it("should handle negative numbers", () => {
    const input = -1234567;
    const output = formatNumber(input);
    expect(output).toBe("-1,234,567");
  });
});
