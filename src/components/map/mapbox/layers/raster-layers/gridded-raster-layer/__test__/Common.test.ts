import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  buildGriddedTileUrl,
  buildTileDateMarks,
  formatProductLabel,
  shouldQueryGriddedTiles,
  toGriddedRasterProducts,
  toSelectItems,
} from "../Common";
import {
  TileProduct,
  TileProductsResponse,
} from "@/app/store/GriddedTileDefinitions";
import {
  DatasetType,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";

const VISUAL_TEMPLATE =
  "/api/v1/ogc/collections/uuid-1/map/tiles/WebMercatorQuad/{z}/{tileRow}/{tileCol}" +
  "?dataset=model_sea_level_anomaly_gridded_realtime&variable=gsla" +
  "&datetime={datetime}&f=png";

// A two-variable product's `variable` param arrives percent-encoded. The `%2B`
// must survive verbatim: an unencoded "+" decodes to a space and 400s.
const TWO_VARIABLE_TEMPLATE =
  "/api/v1/ogc/collections/uuid-2/map/tiles/WebMercatorQuad/{z}/{tileRow}/{tileCol}" +
  "?dataset=model_currents&variable=ucur%2Bvcur&datetime={datetime}&f=png";

const visualProduct = (overrides: Partial<TileProduct> = {}): TileProduct => ({
  id: "model_sea_level_anomaly_gridded_realtime:gsla",
  variable: "GSLA",
  tile_types: ["visual", "data"],
  available_dates: ["2024-01-01", "2024-01-02"],
  visual_tile_url_template: VISUAL_TEMPLATE,
  ...overrides,
});

const collectionWith = (types?: DatasetType[]): OGCCollection =>
  ({ getDatasetType: () => types }) as unknown as OGCCollection;

describe("shouldQueryGriddedTiles", () => {
  it("is true only for a collection carrying a zarr dataset", () => {
    expect(shouldQueryGriddedTiles(collectionWith([DatasetType.ZARR]))).toBe(
      true
    );
    expect(
      shouldQueryGriddedTiles(
        collectionWith([DatasetType.PARQUET, DatasetType.ZARR])
      )
    ).toBe(true);
    expect(shouldQueryGriddedTiles(collectionWith([DatasetType.PARQUET]))).toBe(
      false
    );
    expect(shouldQueryGriddedTiles(collectionWith(undefined))).toBe(false);
    expect(shouldQueryGriddedTiles(undefined)).toBe(false);
    expect(shouldQueryGriddedTiles(null)).toBe(false);
  });
});

describe("buildGriddedTileUrl", () => {
  it("substitutes {datetime} and translates {tileRow}/{tileCol} into Mapbox's {y}/{x}", () => {
    const url = buildGriddedTileUrl(VISUAL_TEMPLATE, "2024-01-02");
    expect(url).toContain("/WebMercatorQuad/{z}/{y}/{x}");
    expect(url).toContain("datetime=2024-01-02");
    expect(url).not.toContain("{datetime}");
    expect(url).not.toContain("{tileRow}");
    expect(url).not.toContain("{tileCol}");
    expect(url).toBe(
      VISUAL_TEMPLATE.replace("{datetime}", "2024-01-02")
        .replace("{tileRow}", "{y}")
        .replace("{tileCol}", "{x}")
    );
  });

  it("keeps %2B encoded for a two-variable product", () => {
    const url = buildGriddedTileUrl(TWO_VARIABLE_TEMPLATE, "2024-01-02");
    expect(url).toContain("%2B");
    expect(url).not.toContain("%252B");
    expect(url).not.toMatch(/variable=[^&]*\+/);
  });

  it("substitutes every occurrence of {datetime}", () => {
    expect(buildGriddedTileUrl("a={datetime}&b={datetime}", "2024-01-02")).toBe(
      "a=2024-01-02&b=2024-01-02"
    );
  });

  it("returns undefined rather than a URL carrying a literal {datetime}", () => {
    // No dayKey shape/calendar re-check here: only ever called with a value
    // already validated by `dayKeyToUtcValue` during discovery, so this is
    // just the "nothing selected yet" / missing-input guard.
    expect(buildGriddedTileUrl(VISUAL_TEMPLATE, undefined)).toBeUndefined();
    expect(buildGriddedTileUrl(VISUAL_TEMPLATE, "")).toBeUndefined();
    expect(buildGriddedTileUrl(undefined, "2024-01-02")).toBeUndefined();
    expect(buildGriddedTileUrl("", "2024-01-02")).toBeUndefined();
  });
});

describe("buildTileDateMarks", () => {
  it("sorts, de-duplicates and drops impossible days", () => {
    const marks = buildTileDateMarks([
      "2024-01-03",
      "2024-01-01",
      "2024-01-03",
      "2024-02-31",
      "garbage",
      "2024-01-02",
    ]);
    expect(marks.dates).toEqual(["2024-01-01", "2024-01-02", "2024-01-03"]);
    expect(marks.values).toEqual([...marks.values].sort((a, b) => a - b));
    expect(marks.values).toHaveLength(3);
    expect(marks.latest).toBe("2024-01-03");
  });

  it("returns an empty, non-throwing result for empty or missing input", () => {
    [undefined, []].forEach((input) => {
      const marks = buildTileDateMarks(input);
      expect(marks.values).toEqual([]);
      expect(marks.dates).toEqual([]);
      expect(marks.latest).toBeUndefined();
      expect(marks.byValue.size).toBe(0);
    });
  });

  // The whole point of byValue: the day sent to the backend is recovered from
  // the map, never re-derived from the timestamp. Run under two timezones so a
  // browser-timezone regression cannot pass.
  describe.each(["Pacific/Auckland", "America/Los_Angeles"])(
    "date round-trip under TZ=%s",
    (timezone) => {
      const originalTz = process.env.TZ;
      beforeAll(() => {
        process.env.TZ = timezone;
      });
      afterAll(() => {
        process.env.TZ = originalTz;
      });

      it("recovers the original day key and lands on UTC midnight", () => {
        const marks = buildTileDateMarks(["2024-01-01", "2024-01-02"]);
        const last = marks.values[marks.values.length - 1];
        expect(marks.byValue.get(last)).toBe("2024-01-02");
        expect(new Date(last).toISOString()).toMatch(/^2024-01-02/);
      });
    }
  );
});

describe("formatProductLabel", () => {
  it('formats "<dataset> — <vars>" with underscores as spaces', () => {
    expect(
      formatProductLabel({
        id: "model_sea_level_anomaly_gridded_realtime:gsla",
        variable: "GSLA",
      })
    ).toBe("model sea level anomaly gridded realtime — GSLA");
  });

  it("joins multiple variables with a plus", () => {
    expect(
      formatProductLabel({
        id: "model_currents:ucur+vcur",
        variable: ["UCUR", "VCUR"],
      })
    ).toContain("UCUR + VCUR");
  });

  it("falls back to the dataset alone when there is no variable", () => {
    expect(formatProductLabel({ id: "some_dataset" })).toBe("some dataset");
  });
});

describe("toGriddedRasterProducts", () => {
  it("returns an empty list for an empty or absent products array", () => {
    expect(toGriddedRasterProducts({ products: [] })).toEqual([]);
    expect(toGriddedRasterProducts({})).toEqual([]);
    expect(toGriddedRasterProducts(undefined)).toEqual([]);
  });

  it("throws only when products is present but not an array", () => {
    expect(() =>
      toGriddedRasterProducts({
        products: "nope",
      } as unknown as TileProductsResponse)
    ).toThrow();
  });

  it("drops data-only products, whatever their variable arity", () => {
    const response: TileProductsResponse = {
      products: [
        visualProduct({
          id: "a:one",
          tile_types: ["data"],
          visual_tile_url_template: undefined,
        }),
        visualProduct({
          id: "b:two",
          variable: ["UCUR", "VCUR"],
          tile_types: ["data"],
          visual_tile_url_template: undefined,
        }),
      ],
    };
    expect(toGriddedRasterProducts(response)).toEqual([]);
  });

  it("drops a visual-capable product with no template", () => {
    expect(
      toGriddedRasterProducts({
        products: [visualProduct({ visual_tile_url_template: undefined })],
      })
    ).toEqual([]);
  });

  it.each([
    ["{datetime}", VISUAL_TEMPLATE.replace("{datetime}", "2024-01-01")],
    ["{z}", VISUAL_TEMPLATE.replace("{z}", "5")],
    ["{tileRow}", VISUAL_TEMPLATE.replace("{tileRow}", "5")],
    ["{tileCol}", VISUAL_TEMPLATE.replace("{tileCol}", "5")],
  ])("drops a template missing %s", (_token, template) => {
    expect(
      toGriddedRasterProducts({
        products: [visualProduct({ visual_tile_url_template: template })],
      })
    ).toEqual([]);
  });

  it("drops a product with no usable day", () => {
    expect(
      toGriddedRasterProducts({
        products: [visualProduct({ available_dates: [] })],
      })
    ).toEqual([]);
    expect(
      toGriddedRasterProducts({
        products: [visualProduct({ available_dates: ["2024-02-31"] })],
      })
    ).toEqual([]);
  });

  it("keeps valid siblings when one entry is malformed", () => {
    const result = toGriddedRasterProducts({
      products: [
        visualProduct({ id: "a:one", visual_tile_url_template: "broken" }),
        visualProduct({ id: "b:two" }),
        null as unknown as TileProduct,
        visualProduct({ id: "c:three" }),
      ],
    });
    expect(result.map((p) => p.id)).toEqual(["b:two", "c:three"]);
  });

  it("preserves server order — the backend controls the default", () => {
    const result = toGriddedRasterProducts({
      products: [
        visualProduct({ id: "z_dataset:zzz" }),
        visualProduct({ id: "a_dataset:aaa" }),
        visualProduct({ id: "m_dataset:mmm" }),
      ],
    });
    expect(result.map((p) => p.id)).toEqual([
      "z_dataset:zzz",
      "a_dataset:aaa",
      "m_dataset:mmm",
    ]);
  });

  it("normalises dates and keeps the template verbatim", () => {
    const [product] = toGriddedRasterProducts({
      products: [
        visualProduct({
          available_dates: ["2024-01-02", "2024-01-01", "2024-01-02"],
          visual_tile_url_template: TWO_VARIABLE_TEMPLATE,
          variable: ["UCUR", "VCUR"],
        }),
      ],
    });
    expect(product.dates).toEqual(["2024-01-01", "2024-01-02"]);
    expect(product.template).toBe(TWO_VARIABLE_TEMPLATE);
    expect(product.label).toContain("UCUR + VCUR");
  });
});

describe("toSelectItems", () => {
  it("maps products to dropdown items in order", () => {
    const products = toGriddedRasterProducts({
      products: [
        visualProduct({ id: "b_dataset:bbb" }),
        visualProduct({ id: "a_dataset:aaa" }),
      ],
    });
    expect(toSelectItems(products)).toEqual([
      { value: "b_dataset:bbb", label: "b dataset — GSLA" },
      { value: "a_dataset:aaa", label: "a dataset — GSLA" },
    ]);
  });
});
