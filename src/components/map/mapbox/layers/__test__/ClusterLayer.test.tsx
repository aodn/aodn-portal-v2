import { render } from "@testing-library/react";
import { FeatureCollection, Point } from "geojson";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MapContext from "../../MapContext";
import { MapEventEnum } from "../../constants";
import ClusterLayer from "../ClusterLayer";

vi.mock("../../layerOrder", () => ({
  addDataLayer: vi.fn(),
}));

vi.mock("../../component/MapPopup", () => ({ default: () => null }));
vi.mock("../../component/CardPopup", () => ({ default: () => null }));
vi.mock("../../component/SpatialExtents", () => ({ default: () => null }));
vi.mock("../../component/SpiderDiagram", () => ({ default: () => null }));
vi.mock("../../../../common/test/helper", () => ({
  TestHelper: () => null,
}));

const SOURCE_ID = "cluster-layer-test-map-source";

const emptyCollection = (): FeatureCollection<Point> => ({
  type: "FeatureCollection",
  features: [],
});

type Source = { setData: ReturnType<typeof vi.fn> };

const createMap = () => {
  const listeners = new Map<string, Set<() => void>>();
  const sources = new Map<string, Source>();

  const on = (event: string, handler: () => void) => {
    const handlers = listeners.get(event) ?? new Set<() => void>();
    handlers.add(handler);
    listeners.set(event, handlers);
  };

  const off = (event: string, handler: () => void) => {
    listeners.get(event)?.delete(handler);
  };

  const map = {
    getContainer: () => ({ id: "test-map" }),
    getBounds: () => null,
    getCenter: () => ({ lng: 0, lat: 0 }),
    setMaxZoom: vi.fn(),
    isStyleLoaded: () => true,
    getLayer: () => undefined,
    getSource: (id: string) => sources.get(id),
    addSource: (id: string) => {
      sources.set(id, { setData: vi.fn() });
    },
    removeSource: (id: string) => {
      sources.delete(id);
    },
    on,
    off,
    once: (event: string, handler: () => void) => {
      const wrapped = () => {
        off(event, wrapped);
        handler();
      };
      on(event, wrapped);
    },
    emit: (event: string) => {
      listeners.get(event)?.forEach((handler) => handler());
    },
  };

  return { map, sources };
};

describe("ClusterLayer source updates", () => {
  let map: ReturnType<typeof createMap>["map"];
  let sources: Map<string, Source>;

  beforeEach(() => {
    vi.clearAllMocks();
    ({ map, sources } = createMap());
  });

  const renderLayer = (featureCollection: FeatureCollection<Point>) =>
    render(
      <MapContext.Provider value={{ map: map as never }}>
        <ClusterLayer featureCollection={featureCollection} />
      </MapContext.Provider>
    );

  it("skips setData when the same collection is already on the current source", () => {
    const collection = emptyCollection();
    const view = renderLayer(collection);

    map.emit(MapEventEnum.IDLE);
    expect(sources.get(SOURCE_ID)?.setData).not.toHaveBeenCalled();

    map.emit(MapEventEnum.STYLEDATA);
    const source = sources.get(SOURCE_ID);
    expect(source?.setData).toHaveBeenCalledTimes(1);

    map.emit(MapEventEnum.STYLEDATA);
    expect(source?.setData).toHaveBeenCalledTimes(1);

    view.rerender(
      <MapContext.Provider value={{ map: map as never }}>
        <ClusterLayer featureCollection={emptyCollection()} />
      </MapContext.Provider>
    );
    expect(source?.setData).toHaveBeenCalledTimes(2);

    map.emit(MapEventEnum.STYLEDATA);
    expect(source?.setData).toHaveBeenCalledTimes(2);
  });

  it("calls setData again after the source is recreated for the same collection", () => {
    const collection = emptyCollection();
    renderLayer(collection);

    map.emit(MapEventEnum.IDLE);
    map.emit(MapEventEnum.STYLEDATA);
    const firstSource = sources.get(SOURCE_ID);
    expect(firstSource?.setData).toHaveBeenCalledTimes(1);

    map.removeSource(SOURCE_ID);
    map.emit(MapEventEnum.STYLEDATA);

    const recreated = sources.get(SOURCE_ID);
    expect(recreated).not.toBe(firstSource);
    expect(recreated?.setData).toHaveBeenCalledTimes(1);
    expect(firstSource?.setData).toHaveBeenCalledTimes(1);
  });
});
