import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MapContext from "../../MapContext";
import SpatialExtents from "../SpatialExtents";

const pendingByUuid = new Map<string, (value: string) => void>();

vi.mock("@/app/store/hooks", () => ({
  useAppDispatch: () => (action: { payload: { filter: string } }) => ({
    unwrap: () =>
      new Promise<string>((resolve) => {
        const uuid = /IN\('([^']+)'\)/.exec(action.payload.filter)?.[1];
        if (uuid) pendingByUuid.set(uuid, resolve);
      }),
  }),
}));

vi.mock("@/app/store/searchReducer", () => ({
  fetchResultNoStore: (params: { filter: string }) => ({ payload: params }),
  jsonToOGCCollections: (json: string) => ({
    collections: [{ getGeometry: () => JSON.parse(json) }],
  }),
}));

const LAYER_ID = "dataset-points";

const geometry = (label: string) =>
  JSON.stringify({
    type: "GeometryCollection",
    geometries: [],
    label,
  });

const createMap = () => {
  const layers = new Map<string, { id: string }>();
  const sources = new Map<string, unknown>();
  layers.set(LAYER_ID, { id: LAYER_ID });

  const map = {
    getStyle: () => ({
      layers: [...layers.keys()].map((id) => ({ id })),
    }),
    getLayer: (id: string) => layers.get(id),
    getSource: (id: string) => sources.get(id),
    addSource: vi.fn((id: string, spec: unknown) => {
      sources.set(id, spec);
    }),
    removeSource: vi.fn((id: string) => {
      sources.delete(id);
    }),
    addLayer: vi.fn((layer: { id: string }) => {
      layers.set(layer.id, layer);
    }),
    removeLayer: vi.fn((id: string) => {
      layers.delete(id);
    }),
    on: vi.fn(),
    off: vi.fn(),
  };

  return { map, sources };
};

const sourceId = (uuid: string) => `${LAYER_ID}-${uuid}-source`;

const resolveFetch = async (uuid: string) => {
  const resolve = pendingByUuid.get(uuid);
  if (!resolve) throw new Error(`No pending fetch for ${uuid}`);
  await act(async () => {
    resolve(geometry(uuid));
    await new Promise((done) => setTimeout(done, 0));
  });
};

describe("SpatialExtents layer replacement", () => {
  let map: ReturnType<typeof createMap>["map"];

  beforeEach(() => {
    pendingByUuid.clear();
    ({ map } = createMap());
  });

  const renderExtents = (selectedUuids: string[]) =>
    render(
      <MapContext.Provider value={{ map: map as never }}>
        <SpatialExtents layerId={LAYER_ID} selectedUuids={selectedUuids} />
      </MapContext.Provider>
    );

  it("drops a geometry response that arrives after the selection changed", async () => {
    const view = renderExtents(["uuid-a"]);

    view.rerender(
      <MapContext.Provider value={{ map: map as never }}>
        <SpatialExtents layerId={LAYER_ID} selectedUuids={["uuid-b"]} />
      </MapContext.Provider>
    );

    await resolveFetch("uuid-a");

    expect(map.addSource).not.toHaveBeenCalled();
    expect(map.getSource(sourceId("uuid-a"))).toBeUndefined();

    await resolveFetch("uuid-b");

    expect(map.addSource).toHaveBeenCalledTimes(1);
    expect(map.getSource(sourceId("uuid-b"))).toBeDefined();
    expect(map.getSource(sourceId("uuid-a"))).toBeUndefined();
  });

  it("removes extents that were added before the selection changed", async () => {
    const view = renderExtents(["uuid-a"]);
    await resolveFetch("uuid-a");

    expect(map.getSource(sourceId("uuid-a"))).toBeDefined();
    expect(map.getLayer(`${sourceId("uuid-a")}-polygons`)).toBeDefined();

    view.rerender(
      <MapContext.Provider value={{ map: map as never }}>
        <SpatialExtents layerId={LAYER_ID} selectedUuids={["uuid-b"]} />
      </MapContext.Provider>
    );

    expect(map.getSource(sourceId("uuid-a"))).toBeUndefined();
    expect(map.getLayer(`${sourceId("uuid-a")}-polygons`)).toBeUndefined();
    expect(map.getLayer(LAYER_ID)).toBeDefined();
  });
});
