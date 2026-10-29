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

  it("sorts existing select items by value and keeps their labels", () => {
    const items = [
      { value: "layer-two", label: "Layer Two" },
      { value: "layer-one", label: "Layer One" },
    ];

    expect(sortDatasetOptions(items)).toEqual([
      { value: "layer-one", label: "Layer One" },
      { value: "layer-two", label: "Layer Two" },
    ]);
    expect(items.map((item) => item.value)).toEqual(["layer-two", "layer-one"]);
  });
});
