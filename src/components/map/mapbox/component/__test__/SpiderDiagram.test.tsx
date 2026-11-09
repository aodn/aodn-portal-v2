import { act, render } from "@testing-library/react";
import { FeatureCollection, Point } from "geojson";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MapContext from "@/components/map/mapbox/MapContext";
import SpiderDiagram from "@/components/map/mapbox/component/SpiderDiagram";

vi.mock("@/components/map/mapbox/layerOrder", () => ({
  addDataLayer: vi.fn(),
}));
vi.mock("@/components/map/mapbox/component/MapPopup", () => ({
  default: () => null,
}));
vi.mock("@/components/map/mapbox/component/SpatialExtents", () => ({
  default: () => null,
}));
vi.mock("@/components/common/test/helper", () => ({
  TestHelper: () => null,
}));

const CLUSTER_LAYER = "test-clusters";
const CLUSTER_SOURCE = "test-source";
const CLUSTER_COORDINATE: [number, number] = [137.7, -33.17];
const SPIDER_ID = `${CLUSTER_COORDINATE[0]},${CLUSTER_COORDINATE[1]}`;
const SPIDER_LAYER_IDS = [
  `spider-lines-layer-${SPIDER_ID}`,
  `spider-lines-line-${SPIDER_ID}`,
];
const SPIDER_SOURCE_IDS = [
  `spider-pins-source-${SPIDER_ID}`,
  `spider-lines-source-${SPIDER_ID}`,
];

const createCollection = (): FeatureCollection<Point> => ({
  type: "FeatureCollection",
  features: [],
});

const createLeaf = (uuid: string) => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: CLUSTER_COORDINATE },
  properties: { uuid },
});

type Handler = (ev?: unknown) => void;

const createMap = () => {
  const handlers = new Map<string, Set<Handler>>();
  const key = (event: string, layer?: string) =>
    layer ? `${event}:${layer}` : event;

  // Supports both map.on(event, handler) and map.on(event, layer, handler).
  const on = (event: string, layerOrHandler: string | Handler, h?: Handler) => {
    const k =
      typeof layerOrHandler === "string"
        ? key(event, layerOrHandler)
        : key(event);
    const handler = typeof layerOrHandler === "string" ? h! : layerOrHandler;
    const set = handlers.get(k) ?? new Set<Handler>();
    set.add(handler);
    handlers.set(k, set);
  };

  const off = (
    event: string,
    layerOrHandler: string | Handler,
    h?: Handler
  ) => {
    const k =
      typeof layerOrHandler === "string"
        ? key(event, layerOrHandler)
        : key(event);
    const handler = typeof layerOrHandler === "string" ? h! : layerOrHandler;
    handlers.get(k)?.delete(handler);
  };

  const clusterSource = {
    getClusterLeaves: (
      _id: number,
      _limit: number,
      _offset: number,
      cb: (err: unknown, leaves: unknown[]) => void
    ) => cb(null, [createLeaf("uuid-1"), createLeaf("uuid-2")]),
    getClusterExpansionZoom: (
      _id: number,
      cb: (err: unknown, zoom: number) => void
    ) => cb(null, 9),
  };

  const map = {
    getContainer: () => ({ id: "test-map" }),
    getZoom: () => 8,
    getLayer: () => undefined,
    getSource: (id: string) =>
      id === CLUSTER_SOURCE ? clusterSource : undefined,
    addSource: vi.fn(),
    removeLayer: vi.fn(),
    removeSource: vi.fn(),
    queryRenderedFeatures: () => [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: CLUSTER_COORDINATE },
        properties: { cluster_id: 1, point_count: 2 },
      },
    ],
    on,
    off,
    clickCluster: () =>
      handlers
        .get(key("click", CLUSTER_LAYER))
        ?.forEach((handler) => handler({ point: { x: 0, y: 0 } })),
  };

  return map;
};

describe("SpiderDiagram", () => {
  let map: ReturnType<typeof createMap>;

  beforeEach(() => {
    map = createMap();
  });

  const renderSpider = (featureCollection: FeatureCollection<Point>) => (
    <MapContext.Provider value={{ map: map as never, setLoading: vi.fn() }}>
      <SpiderDiagram
        clusterLayer={CLUSTER_LAYER}
        clusterSourceId={CLUSTER_SOURCE}
        unclusterPointLayer="test-uncluster"
        featureCollection={featureCollection}
      />
    </MapContext.Provider>
  );

  // Click a cluster so the spider opens.
  const openSpider = () => {
    act(() => map.clickCluster());
    SPIDER_SOURCE_IDS.forEach((id) =>
      expect(map.addSource).toHaveBeenCalledWith(id, expect.anything())
    );
  };

  const expectSpiderRemoved = () => {
    SPIDER_LAYER_IDS.forEach((id) =>
      expect(map.removeLayer).toHaveBeenCalledWith(id)
    );
    SPIDER_SOURCE_IDS.forEach((id) =>
      expect(map.removeSource).toHaveBeenCalledWith(id)
    );
  };

  it("removes the spider when the layer unmounts", () => {
    const view = render(renderSpider(createCollection()));
    openSpider();

    view.unmount();

    expectSpiderRemoved();
  });

  it("keeps the spider when the feature collection is the same", () => {
    const collection = createCollection();
    const view = render(renderSpider(collection));
    openSpider();

    view.rerender(renderSpider(collection));

    expect(map.removeLayer).not.toHaveBeenCalled();
  });

  it("removes the spider when the feature collection changes", () => {
    const view = render(renderSpider(createCollection()));
    openSpider();

    view.rerender(renderSpider(createCollection()));

    expectSpiderRemoved();
  });
});
