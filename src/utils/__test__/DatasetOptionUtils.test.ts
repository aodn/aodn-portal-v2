import { sortDatasetOptions } from "../DatasetOptionUtils";

describe("sortDatasetOptions", () => {
  it("copies and sorts keys, and strips zarr and parquet extensions from labels", () => {
    const keys = ["b.zarr", "a.parquet"];

    expect(sortDatasetOptions(keys)).toEqual([
      { value: "a.parquet", label: "a" },
      { value: "b.zarr", label: "b" },
    ]);
    expect(keys).toEqual(["b.zarr", "a.parquet"]);
  });

  it("sorts select items by the displayed label, then by value", () => {
    const items = [
      { value: "a-name", label: "Zebra" },
      { value: "z-name", label: "Alpha" },
      { value: "m-name", label: "Alpha" },
    ];

    expect(sortDatasetOptions(items)).toEqual([
      { value: "m-name", label: "Alpha" },
      { value: "z-name", label: "Alpha" },
      { value: "a-name", label: "Zebra" },
    ]);
    expect(items[0].value).toBe("a-name");
  });

  it("orders labels with localeCompare so accented characters stay with their letter", () => {
    expect(
      sortDatasetOptions([
        { value: "f", label: "f" },
        { value: "e", label: "é" },
      ]).map((item) => item.label)
    ).toEqual(["é", "f"]);
  });
});
