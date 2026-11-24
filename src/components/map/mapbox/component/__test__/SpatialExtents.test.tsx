import { render, waitFor } from "@testing-library/react";
import type { Map as MapboxMap } from "mapbox-gl";
import { describe, expect, it, vi } from "vitest";
import MapContext from "@/components/map/mapbox/MapContext";
import SpatialExtents from "@/components/map/mapbox/component/SpatialExtents";
import { EXTENT_OUTLINE_SYMBOLOGY } from "@/components/map/mapbox/constants";

vi.mock("@/app/store/hooks", () => ({
  useAppDispatch: () => () => ({ unwrap: () => Promise.resolve("{}") }),
}));
vi.mock("@/app/store/searchReducer", () => ({
  fetchResultNoStore: vi.fn(),
  jsonToOGCCollections: () => ({
    collections: [{ getGeometry: () => ({ type: "GeometryCollection" }) }],
  }),
}));

describe("consistent extent outline across maps", () => {
  it("draws the search map extent with the shared outline", async () => {
    const map = {
      getSource: vi.fn(),
      addSource: vi.fn(),
      removeSource: vi.fn(),
      getLayer: vi.fn(),
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
      getStyle: () => ({ layers: [] }),
      on: vi.fn(),
      off: vi.fn(),
    } as unknown as MapboxMap;

    render(
      <MapContext.Provider value={{ map }}>
        <SpatialExtents layerId="clusters" selectedUuids={["uuid-1"]} />
      </MapContext.Provider>
    );

    await waitFor(() => {
      const lines = vi
        .mocked(map.addLayer)
        .mock.calls.map(([layer]) => layer)
        .filter(
          (layer) =>
            layer.id.endsWith("-polygons-casing") ||
            layer.id.endsWith("-polygons-outline")
        );
      expect(lines.map((layer) => "paint" in layer && layer.paint)).toEqual([
        {
          "line-color": EXTENT_OUTLINE_SYMBOLOGY.CASING_COLOR,
          "line-width": EXTENT_OUTLINE_SYMBOLOGY.CASING_WIDTH,
        },
        {
          "line-color": EXTENT_OUTLINE_SYMBOLOGY.COLOR,
          "line-width": EXTENT_OUTLINE_SYMBOLOGY.WIDTH,
        },
      ]);
    });
  });
});
