import { describe, expect, it, vi } from "vitest";
import type { LayerSpecification, Map as MapboxMap } from "mapbox-gl";
import {
  addDataLayer,
  addMenuOverlayLayer,
  ensureMenuOverlayLayersOnTop,
  getDataLayerBeforeId,
  getFirstDrawLayerId,
  getFirstMenuOverlayLayerId,
  getMenuOverlayBeforeId,
  isMenuOverlayLayerId,
} from "../layerOrder";

const makeMap = (layerIds: string[]): MapboxMap => {
  const layers = layerIds.map((id) => ({ id }));
  return {
    getStyle: () => ({ layers }),
    getLayer: (id: string) => (layerIds.includes(id) ? { id } : undefined),
    addLayer: vi.fn(),
    moveLayer: vi.fn(),
  } as unknown as MapboxMap;
};

describe("layerOrder", () => {
  describe("isMenuOverlayLayerId", () => {
    it("matches static, world, and selected-area layers", () => {
      expect(
        isMenuOverlayLayerId("static-geojson-result-map-layer-marine-parks")
      ).toBe(true);
      expect(
        isMenuOverlayLayerId("static-geojson-result-map-label-marine-parks")
      ).toBe(true);
      expect(
        isMenuOverlayLayerId("mapbox-world-country-boundaries-layer")
      ).toBe(true);
      expect(
        isMenuOverlayLayerId("mapbox-world-country-undisputed-country-label")
      ).toBe(true);
      expect(isMenuOverlayLayerId("selected-area-layer")).toBe(true);
      expect(isMenuOverlayLayerId("selected-area-label-layer")).toBe(true);
    });

    it("does not match data or draw layers", () => {
      expect(isMenuOverlayLayerId("cluster-layer")).toBe(false);
      expect(isMenuOverlayLayerId("pmtiles-density-layer")).toBe(false);
      expect(isMenuOverlayLayerId("gl-draw-polygon-fill.cold")).toBe(false);
    });
  });

  describe("beforeId helpers", () => {
    it("finds first menu overlay and draw layer", () => {
      const map = makeMap([
        "base",
        "cluster-layer",
        "static-geojson-m-layer-x",
        "mapbox-world-country-boundaries-layer",
        "gl-draw-polygon-fill.cold",
      ]);

      expect(getFirstMenuOverlayLayerId(map)).toBe("static-geojson-m-layer-x");
      expect(getFirstDrawLayerId(map)).toBe("gl-draw-polygon-fill.cold");
      expect(getDataLayerBeforeId(map)).toBe("static-geojson-m-layer-x");
      expect(getMenuOverlayBeforeId(map)).toBe("gl-draw-polygon-fill.cold");
    });

    it("uses draw layer as data beforeId when no menu overlay exists", () => {
      const map = makeMap(["cluster-layer", "gl-draw-polygon-fill.cold"]);
      expect(getDataLayerBeforeId(map)).toBe("gl-draw-polygon-fill.cold");
      expect(getMenuOverlayBeforeId(map)).toBe("gl-draw-polygon-fill.cold");
    });

    it("returns undefined when stack is empty of overlays/draw", () => {
      const map = makeMap(["cluster-layer"]);
      expect(getDataLayerBeforeId(map)).toBeUndefined();
      expect(getMenuOverlayBeforeId(map)).toBeUndefined();
    });
  });

  describe("addDataLayer / addMenuOverlayLayer", () => {
    it("inserts data layers before the first menu overlay", () => {
      const map = makeMap([
        "cluster-layer",
        "static-geojson-m-layer-x",
        "gl-draw-polygon-fill.cold",
      ]);
      const layer = { id: "heatmap-layer", type: "heatmap" as const };

      addDataLayer(map, layer as unknown as LayerSpecification);

      expect(map.addLayer).toHaveBeenCalledWith(
        layer,
        "static-geojson-m-layer-x"
      );
    });

    it("inserts menu overlay layers before draw tools", () => {
      const map = makeMap([
        "cluster-layer",
        "static-geojson-m-layer-x",
        "gl-draw-polygon-fill.cold",
      ]);
      const layer = {
        id: "mapbox-world-country-boundaries-layer",
        type: "fill" as const,
      };

      addMenuOverlayLayer(map, layer as unknown as LayerSpecification);

      expect(map.addLayer).toHaveBeenCalledWith(
        layer,
        "gl-draw-polygon-fill.cold"
      );
    });

    it("adds at top when no beforeId is available", () => {
      const map = makeMap(["cluster-layer"]);
      const layer = { id: "new-data", type: "circle" as const };

      addDataLayer(map, layer as unknown as LayerSpecification);

      expect(map.addLayer).toHaveBeenCalledWith(layer);
    });
  });

  describe("ensureMenuOverlayLayersOnTop", () => {
    it("moves menu overlays below draw layers", () => {
      const map = makeMap([
        "static-geojson-m-layer-x",
        "static-geojson-m-label-x",
        "gl-draw-polygon-fill.cold",
      ]);

      ensureMenuOverlayLayersOnTop(map);

      expect(map.moveLayer).toHaveBeenCalledWith(
        "static-geojson-m-layer-x",
        "gl-draw-polygon-fill.cold"
      );
      expect(map.moveLayer).toHaveBeenCalledWith(
        "static-geojson-m-label-x",
        "gl-draw-polygon-fill.cold"
      );
    });

    it("moves menu overlays to top when no draw layers", () => {
      const map = makeMap(["cluster-layer", "static-geojson-m-layer-x"]);

      ensureMenuOverlayLayersOnTop(map);

      expect(map.moveLayer).toHaveBeenCalledWith("static-geojson-m-layer-x");
    });

    it("no-ops when there are no menu overlays", () => {
      const map = makeMap(["cluster-layer"]);
      ensureMenuOverlayLayersOnTop(map);
      expect(map.moveLayer).not.toHaveBeenCalled();
    });
  });
});
