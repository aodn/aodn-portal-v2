import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  applyRenderStyleToTemplate,
  buildGriddedLegendUrl,
  buildGriddedManifestUrl,
  buildGriddedPointUrl,
  buildGriddedTileUrl,
  buildPointValuePopupHtml,
  getGriddedRenderStyle,
  toLegendRange,
  toCategoricalLabels,
  toLegendUnit,
  buildTileDateMarks,
  formatPointValue,
  wrapLongitude,
  formatProductLabel,
  shouldQueryGriddedTiles,
  toGriddedRasterProducts,
  toSelectItems,
} from "../Common";
import { DEFAULT_GRIDDED_COLORMAP } from "../TilerColormaps";
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
  available_dates: ["2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z"],
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
    // No shape/calendar re-check here: only ever called with a value already
    // validated by `utcIsoToDayKey` during discovery, so this is just the
    // "nothing selected yet" / missing-input guard.
    expect(buildGriddedTileUrl(VISUAL_TEMPLATE, undefined)).toBeUndefined();
    expect(buildGriddedTileUrl(VISUAL_TEMPLATE, "")).toBeUndefined();
    expect(buildGriddedTileUrl(undefined, "2024-01-02")).toBeUndefined();
    expect(buildGriddedTileUrl("", "2024-01-02")).toBeUndefined();
  });
});

describe("buildTileDateMarks", () => {
  it("sorts, de-duplicates and drops impossible days", () => {
    const marks = buildTileDateMarks([
      "2024-01-03T00:00:00Z",
      "2024-01-01T00:00:00Z",
      "2024-01-03T00:00:00Z",
      "2024-02-31T00:00:00Z",
      "garbage",
      "2024-01-02T00:00:00Z",
    ]);
    expect(marks.dates).toEqual([
      "2024-01-01T00:00:00Z",
      "2024-01-02T00:00:00Z",
      "2024-01-03T00:00:00Z",
    ]);
    expect(marks.values).toEqual([...marks.values].sort((a, b) => a - b));
    expect(marks.values).toHaveLength(3);
    expect(marks.latest).toBe("2024-01-03T00:00:00Z");
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

      it("recovers the original datetime and lands on UTC midnight", () => {
        const marks = buildTileDateMarks([
          "2024-01-01T00:00:00Z",
          "2024-01-02T00:00:00Z",
        ]);
        const last = marks.values[marks.values.length - 1];
        expect(marks.byValue.get(last)).toBe("2024-01-02T00:00:00Z");
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
        products: [
          visualProduct({ available_dates: ["2024-02-31T00:00:00Z"] }),
        ],
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

  it("normalises dates and keeps the template verbatim apart from the colormap", () => {
    const [product] = toGriddedRasterProducts(
      {
        products: [
          visualProduct({
            available_dates: [
              "2024-01-02T00:00:00Z",
              "2024-01-01T00:00:00Z",
              "2024-01-02T00:00:00Z",
            ],
            visual_tile_url_template: TWO_VARIABLE_TEMPLATE,
            variable: ["UCUR", "VCUR"],
          }),
        ],
      },
      {}
    );
    expect(product.dates).toEqual([
      "2024-01-01T00:00:00Z",
      "2024-01-02T00:00:00Z",
    ]);
    expect(product.tileTemplate).toBe(
      `${TWO_VARIABLE_TEMPLATE}&colormap=viridis`
    );
    expect(product.tileTemplate).not.toContain("%252B");
    expect(product.label).toContain("UCUR + VCUR");
  });

  it("applies the default colormap and server range to an unlisted product", () => {
    const [product] = toGriddedRasterProducts(
      { products: [visualProduct()] },
      {}
    );
    expect(product.colormap).toBe(DEFAULT_GRIDDED_COLORMAP);
    expect(product.rescale).toBeUndefined();
    expect(product.tileTemplate).toBe(`${VISUAL_TEMPLATE}&colormap=viridis`);
  });

  it("applies a listed product's colormap and fixed range to its tiles", () => {
    const [product] = toGriddedRasterProducts(
      { products: [visualProduct({ id: "a:one" })] },
      { "a:one": { colormap: "rdbu_r", rescale: [-1, 1] } }
    );
    expect(product.colormap).toBe("rdbu_r");
    expect(product.rescale).toEqual([-1, 1]);
    expect(product.tileTemplate).toBe(
      `${VISUAL_TEMPLATE}&colormap=rdbu_r&rescale=-1,1`
    );
  });

  it("keeps the variable name, joining a two-variable product", () => {
    const [single, pair] = toGriddedRasterProducts({
      products: [
        visualProduct({ id: "a:one", variable: "GSLA" }),
        visualProduct({ id: "b:two", variable: ["UCUR", "VCUR"] }),
      ],
    });
    expect(single.variable).toBe("GSLA");
    expect(pair.variable).toBe("UCUR + VCUR");
  });

  it("reads the categorical flag, treating null or missing as continuous", () => {
    const [flagged, unknown, missing] = toGriddedRasterProducts({
      products: [
        visualProduct({ id: "a:one", categorical: true }),
        visualProduct({ id: "b:two", categorical: null }),
        visualProduct({ id: "c:three" }),
      ],
    });
    expect(flagged.categorical).toBe(true);
    expect(unknown.categorical).toBe(false);
    expect(missing.categorical).toBe(false);
  });

  it("never sends a rescale for a categorical product", () => {
    const [product] = toGriddedRasterProducts(
      { products: [visualProduct({ id: "a:one", categorical: true })] },
      { "a:one": { colormap: "mcs_category", rescale: [0, 3] } }
    );
    expect(product.rescale).toBeUndefined();
    expect(product.tileTemplate).toBe(
      `${VISUAL_TEMPLATE}&colormap=mcs_category`
    );
  });

  it("gives an unlisted categorical product the default categorical colormap", () => {
    const [product] = toGriddedRasterProducts(
      { products: [visualProduct({ id: "a:one", categorical: true })] },
      {}
    );
    expect(product.colormap).toBe("default_categorical");
    expect(product.tileTemplate).toBe(
      `${VISUAL_TEMPLATE}&colormap=default_categorical`
    );
  });

  it("carries the legend and manifest templates through unresolved", () => {
    const legend = "/api/v1/ogc/ext/tiles/colormaps/legend?colormap={colormap}";
    const manifest =
      "/api/v1/ogc/ext/tiles/collections/uuid-1/visual_tiles/manifest" +
      "?dataset=d&variable=v&datetime={datetime}";
    const [withBoth, withNeither] = toGriddedRasterProducts({
      products: [
        visualProduct({
          id: "a:one",
          legend_url: legend,
          visual_manifest_url_template: manifest,
        }),
        visualProduct({
          id: "b:two",
          legend_url: "",
          visual_manifest_url_template: "",
        }),
      ],
    });
    expect(withBoth.legendTemplate).toBe(legend);
    expect(withBoth.manifestTemplate).toBe(manifest);
    expect(withNeither.legendTemplate).toBeUndefined();
    expect(withNeither.manifestTemplate).toBeUndefined();
  });
});

describe("getGriddedRenderStyle", () => {
  it("falls back to the default colormap and no range", () => {
    expect(getGriddedRenderStyle("x:y", false, {})).toEqual({
      colormap: "viridis",
      rescale: undefined,
    });
  });

  it("keeps the default colormap when only a range is listed", () => {
    expect(
      getGriddedRenderStyle("x:y", false, { "x:y": { rescale: [0, 5] } })
    ).toEqual({ colormap: "viridis", rescale: [0, 5] });
  });

  it("gives an unlisted categorical product the default categorical colormap", () => {
    expect(getGriddedRenderStyle("x:y", true, {})).toEqual({
      colormap: "default_categorical",
      rescale: undefined,
    });
  });

  it("uses a listed categorical product's colormap but never its range", () => {
    expect(
      getGriddedRenderStyle("x:y", true, {
        "x:y": { colormap: "mcs_category", rescale: [0, 3] },
      })
    ).toEqual({ colormap: "mcs_category", rescale: undefined });
  });
});

describe("applyRenderStyleToTemplate", () => {
  it("starts a query string when the template has none", () => {
    expect(applyRenderStyleToTemplate("/tiles/{z}", "viridis")).toBe(
      "/tiles/{z}?colormap=viridis"
    );
  });
});

describe("buildGriddedManifestUrl", () => {
  it("fills the datetime verbatim", () => {
    expect(
      buildGriddedManifestUrl(
        "/manifest?variable=v&datetime={datetime}",
        "2026-06-16T00:00:00Z"
      )
    ).toBe("/manifest?variable=v&datetime=2026-06-16T00:00:00Z");
  });

  it("returns undefined without a template or a datetime", () => {
    expect(buildGriddedManifestUrl(undefined, "2026-06-16T00:00:00Z")).toBe(
      undefined
    );
    expect(buildGriddedManifestUrl("/m?d={datetime}", undefined)).toBe(
      undefined
    );
  });
});

describe("toLegendUnit", () => {
  it("reads the manifest's valueUnit, trimmed", () => {
    expect(toLegendUnit({ valueUnit: " m " })).toBe("m");
  });

  it("is undefined when the unit is absent, null or blank", () => {
    expect(toLegendUnit({ valueRange: [0, 1] })).toBeUndefined();
    expect(toLegendUnit({ valueUnit: null })).toBeUndefined();
    expect(toLegendUnit({ valueUnit: "  " })).toBeUndefined();
    expect(toLegendUnit(undefined)).toBeUndefined();
  });
});

describe("toCategoricalLabels", () => {
  const manifest = {
    flagValues: [0, 1, 2],
    flagMeanings: ["none", "moderate", "strong"],
  };
  const inline = (values: number[]) =>
    JSON.stringify({ mode: "categorical", values, colors: [] });

  it("uses the flag meanings in value order", () => {
    expect(toCategoricalLabels(manifest, "default_categorical")).toEqual([
      "none",
      "moderate",
      "strong",
    ]);
  });

  it("falls back to the flag values without one meaning per value", () => {
    expect(toCategoricalLabels({ flagValues: [0, 1, 2] })).toEqual([
      "0",
      "1",
      "2",
    ]);
    expect(
      toCategoricalLabels({ flagValues: [0, 1], flagMeanings: ["none"] })
    ).toEqual(["0", "1"]);
  });

  it("accepts an inline colormap with one value per flag", () => {
    expect(toCategoricalLabels(manifest, inline([0, 1, 2]))).toHaveLength(3);
  });

  it("gives no labels when an inline colormap has a different block count", () => {
    expect(toCategoricalLabels(manifest, inline([0, 1, 2, 3]))).toBeUndefined();
  });

  it("gives no labels for a continuous manifest", () => {
    expect(toCategoricalLabels({ valueRange: [0, 1] })).toBeUndefined();
    expect(toCategoricalLabels(undefined)).toBeUndefined();
  });
});

describe("toLegendRange", () => {
  it("reads a scalar product's valueRange", () => {
    expect(toLegendRange({ valueRange: [-0.4, 0.9] })).toEqual([-0.4, 0.9]);
  });

  it("is undefined for a categorical product", () => {
    expect(
      toLegendRange({ valueRange: [0, 3], flagValues: [0, 1, 2, 3] })
    ).toBeUndefined();
  });

  it("is undefined for an empty or malformed range", () => {
    expect(toLegendRange({ valueRange: [null, null] })).toBeUndefined();
    expect(toLegendRange({ valueRange: [1] })).toBeUndefined();
    expect(toLegendRange({ valueRange: null })).toBeUndefined();
    expect(toLegendRange({})).toBeUndefined();
    expect(toLegendRange(undefined)).toBeUndefined();
  });
});

describe("buildGriddedLegendUrl", () => {
  const TEMPLATE = "/api/v1/ogc/ext/tiles/colormaps/legend?colormap={colormap}";

  it("defaults the colormap to viridis", () => {
    expect(buildGriddedLegendUrl(TEMPLATE)).toBe(
      "/api/v1/ogc/ext/tiles/colormaps/legend?colormap=viridis"
    );
  });

  it("fills in an explicit colormap", () => {
    expect(buildGriddedLegendUrl(TEMPLATE, "plasma")).toBe(
      "/api/v1/ogc/ext/tiles/colormaps/legend?colormap=plasma"
    );
  });

  it("leaves an already-resolved url untouched", () => {
    const resolved = "/api/v1/ogc/ext/tiles/colormaps/legend?colormap=accent";
    expect(buildGriddedLegendUrl(resolved, "viridis")).toBe(resolved);
  });

  it("url-encodes an inline JSON colormap", () => {
    const inline = '{"mode":"categorical","values":[0],"colors":["#8c0000"]}';
    const url = buildGriddedLegendUrl(TEMPLATE, inline);
    expect(url).toBe(
      `/api/v1/ogc/ext/tiles/colormaps/legend?colormap=${encodeURIComponent(inline)}`
    );
    expect(url).not.toContain("#");
  });

  it("returns undefined without a url", () => {
    expect(buildGriddedLegendUrl(undefined)).toBeUndefined();
    expect(buildGriddedLegendUrl("")).toBeUndefined();
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

describe("buildGriddedPointUrl", () => {
  const POINT_TEMPLATE =
    "/api/v1/ogc/ext/tiles/collections/uuid-2/data_tiles/point" +
    "?dataset=model_currents&variable=ucur%2Bvcur" +
    "&datetime={datetime}&lat={lat}&lon={lon}";

  it("fills datetime, lat and lon, keeping %2B verbatim", () => {
    expect(
      buildGriddedPointUrl(POINT_TEMPLATE, "2024-01-01T00:00:00Z", -44.27, 132)
    ).toBe(
      "/api/v1/ogc/ext/tiles/collections/uuid-2/data_tiles/point" +
        "?dataset=model_currents&variable=ucur%2Bvcur" +
        "&datetime=2024-01-01T00:00:00Z&lat=-44.27&lon=132"
    );
  });

  it("is undefined without a template or a date", () => {
    expect(buildGriddedPointUrl(undefined, "2024-01-01", 0, 0)).toBeUndefined();
    expect(
      buildGriddedPointUrl(POINT_TEMPLATE, undefined, 0, 0)
    ).toBeUndefined();
  });

  it("is taken from point_url_template by toGriddedRasterProducts", () => {
    const [product] = toGriddedRasterProducts({
      products: [visualProduct({ point_url_template: POINT_TEMPLATE })],
    });
    expect(product.pointTemplate).toBe(POINT_TEMPLATE);
    const [withoutPoint] = toGriddedRasterProducts({
      products: [visualProduct()],
    });
    expect(withoutPoint.pointTemplate).toBeUndefined();
  });
});

describe("wrapLongitude", () => {
  it("wraps world-copy longitudes into -180..180", () => {
    expect(wrapLongitude(132)).toBe(132);
    expect(wrapLongitude(190)).toBe(-170);
    expect(wrapLongitude(-190)).toBe(170);
    expect(wrapLongitude(540)).toBe(-180);
  });
});

describe("formatPointValue", () => {
  it("rounds to 4 significant digits and reports missing values", () => {
    expect(formatPointValue(0.046846628)).toBe("0.04685");
    expect(formatPointValue(1234.5678)).toBe("1235");
    expect(formatPointValue(null)).toBe("No data");
    expect(formatPointValue(Number.NaN)).toBe("No data");
  });
});

describe("buildPointValuePopupHtml", () => {
  it("prefers the snapped grid coordinates and lists each variable", () => {
    const html = buildPointValuePopupHtml(
      {
        lat: -44.20000076,
        lon: 132,
        variables: { GSLA: { value: 0.046846628, units: "m" } },
      },
      { lat: -44.27, lon: 132.01 }
    );
    expect(html).toContain("Lat: -44.20<br>");
    expect(html).toContain("Lon: 132.00<br>");
    expect(html).toContain("GSLA: 0.04685 m");
  });

  it("falls back to the clicked point and shows no data without variables", () => {
    const html = buildPointValuePopupHtml({}, { lat: -10, lon: 20 });
    expect(html).toContain("Lat: -10.00<br>");
    expect(html).toContain("Lon: 20.00<br>");
    expect(html).toContain("No data");
  });
});
