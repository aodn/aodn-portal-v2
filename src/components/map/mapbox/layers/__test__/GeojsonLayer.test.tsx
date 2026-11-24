import { act, render } from "@testing-library/react";
import type { Map as MapboxMap } from "mapbox-gl";
import { describe, expect, it, vi } from "vitest";
import MapContext from "@/components/map/mapbox/MapContext";
import GeojsonLayer from "@/components/map/mapbox/layers/GeojsonLayer";
import { EXTENT_OUTLINE_SYMBOLOGY } from "@/components/map/mapbox/constants";
import { addDataLayer } from "@/components/map/mapbox/layerOrder";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";

vi.mock("@/components/map/mapbox/layerOrder", () => ({
  addDataLayer: vi.fn(),
}));

describe("consistent extent outline across maps", () => {
  it("draws the detail page extent with the shared outline", () => {
    const handlers: Record<string, () => void> = {};
    const map = {
      getContainer: () => ({ id: "detail-map" }),
      getSource: vi.fn(),
      addSource: vi.fn(),
      getLayer: vi.fn(),
      on: (event: string, handler: () => void) => {
        handlers[event] = handler;
      },
      off: vi.fn(),
      once: vi.fn(),
    } as unknown as MapboxMap;
    const collection = Object.assign(new OGCCollection(), { id: "c1" });

    render(
      <MapContext.Provider value={{ map }}>
        <GeojsonLayer collection={collection} />
      </MapContext.Provider>
    );
    act(() => handlers.styledata());

    const lines = vi
      .mocked(addDataLayer)
      .mock.calls.map(([, layer]) => layer)
      .filter((layer) => layer.type === "line");
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
