import {
  OGCCollection,
  OPTIMIZED_PYTHON_NOTEBOOK_LINK_TITLE,
} from "@/app/store/OGCCollectionDefinitions";
import { getCODatasetOptions, sortDatasetOptions } from "../DatasetOptionUtils";

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

describe("getCODatasetOptions", () => {
  it("uses the CO key as the value and the readable name as the label, sorted by label", () => {
    const collection = new OGCCollection();
    collection.links = [
      { rel: "summary", href: "", type: "", title: "animal_gps.parquet" },
      { rel: "summary", href: "", type: "", title: "animal_ctd.parquet" },
      { rel: "summary", href: "", type: "", title: "animal_extra.parquet" },
      {
        rel: "related",
        href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/animal_gps.ipynb",
        type: "application/x-ipynb+json",
        title: `${OPTIMIZED_PYTHON_NOTEBOOK_LINK_TITLE} - Real time - GPS`,
      },
      {
        rel: "related",
        href: "https://github.com/aodn/aodn_cloud_optimised/blob/main/notebooks/animal_ctd.ipynb",
        type: "application/x-ipynb+json",
        title: `${OPTIMIZED_PYTHON_NOTEBOOK_LINK_TITLE} - Real time - CTD profile`,
      },
    ];

    expect(getCODatasetOptions(collection)).toEqual([
      { value: "animal_extra.parquet", label: "animal_extra" },
      { value: "animal_ctd.parquet", label: "Real time - CTD profile" },
      { value: "animal_gps.parquet", label: "Real time - GPS" },
    ]);
  });

  it("returns no options without a collection", () => {
    expect(getCODatasetOptions(undefined)).toEqual([]);
  });
});
