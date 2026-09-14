import { describe, expect, it } from "vitest";
import {
  getValidEstimatedSizeBytes,
  isImosOnlyDataset,
} from "../DownloadDefinitions";

describe("getValidEstimatedSizeBytes", () => {
  it.each([
    [0, 0],
    [987654, 987654],
    [-1, undefined],
    [1.5, undefined],
    [undefined, undefined],
    [null, undefined],
  ])("validates %s as %s", (value, expected) => {
    expect(getValidEstimatedSizeBytes(value)).toBe(expected);
  });
});

describe("isImosOnlyDataset", () => {
  it.each([
    [["imos"], true],
    [["IMOS"], true],
    [["aims"], false],
    [["csiro"], false],
    [["imos", "aims"], false],
    [["imos", "csiro"], false],
    [[], false],
    [undefined, false],
  ])("treats dataset_group %s as isImosOnlyDataset = %s", (group, expected) => {
    expect(isImosOnlyDataset(group)).toBe(expected);
  });
});
