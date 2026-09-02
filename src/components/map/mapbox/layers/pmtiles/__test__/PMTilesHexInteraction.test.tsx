import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Map, MapMouseEvent } from "mapbox-gl";
import type { Geometry } from "geojson";
import dayjs from "@/utils/DayjsUtils";
import { playwrightTestIds } from "@/components/common/constants";
import { MapDefaultConfig } from "@/components/map/mapbox/constants";
import { isMapDrawModeActive } from "@/utils/MapUtils";
import {
  COUNTS_PROPERTY,
  DAYS_KEY,
  TOTAL_KEY,
  buildCountFilterRange,
} from "../Common";
import {
  PMTILE_LAYERS,
  attachPmtilesHexInteraction,
  pmtilesHitLayerId,
  type PmtilesHexHoverCtx,
} from "../PMTilesLayer";

const popupMocks = vi.hoisted(() => {
  const instances: Array<{
    setHTML: ReturnType<typeof vi.fn>;
    setLngLat: ReturnType<typeof vi.fn>;
    addTo: ReturnType<typeof vi.fn>;
    isOpen: ReturnType<typeof vi.fn>;
    getElement: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  }> = [];
  const Popup = vi.fn(() => {
    const el = document.createElement("div");
    const instance = {
      setHTML: vi.fn().mockReturnThis(),
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      isOpen: vi.fn().mockReturnValue(false),
      getElement: vi.fn().mockReturnValue(el),
      remove: vi.fn(),
    };
    instances.push(instance);
    return instance;
  });
  return { Popup, instances };
});

vi.mock("mapbox-gl", () => ({
  Popup: popupMocks.Popup,
}));

vi.mock("@/utils/MapUtils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils/MapUtils")>();
  return {
    ...actual,
    isMapDrawModeActive: vi.fn(() => false),
  };
});

const HEX_LAYER = PMTILE_LAYERS.find((layer) => layer.id === "pmtiles-hex-z4")!;
const HEX_GEOMETRY: Geometry = {
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ],
  ],
};

const countsTree = {
  "2024": {
    [TOTAL_KEY]: 12,
    "01": { [TOTAL_KEY]: 12, [DAYS_KEY]: { "01": 12 } },
  },
};

const filterStart = dayjs.tz("2024-01-01");
const filterEnd = dayjs.tz("2024-12-31");

const makeCtx = (
  overrides: Partial<PmtilesHexHoverCtx> = {}
): { current: PmtilesHexHoverCtx } => ({
  current: {
    filterStartDate: filterStart,
    filterEndDate: filterEnd,
    countFilterRange: buildCountFilterRange(filterStart, filterEnd),
    hasTime: true,
    densityReady: true,
    visible: true,
    ...overrides,
  },
});

type TestHexFeature = Partial<NonNullable<MapMouseEvent["features"]>[number]>;

const makeFeature = (
  id: string,
  tree: Record<string, unknown> = countsTree
): TestHexFeature => ({
  id,
  type: "Feature",
  geometry: HEX_GEOMETRY,
  properties: {
    h: id,
    [COUNTS_PROPERTY]: JSON.stringify(tree),
  },
});

const makeEvent = (feature?: TestHexFeature): Partial<MapMouseEvent> => ({
  lngLat: { lng: 147, lat: -42 } as MapMouseEvent["lngLat"],
  point: { x: 10, y: 20 } as MapMouseEvent["point"],
  features: feature ? ([feature] as MapMouseEvent["features"]) : [],
});

describe("PMTilesLayer - click popup", () => {
  let listeners: Record<string, Array<(...args: unknown[]) => void>>;
  let classList: {
    add: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let setData: ReturnType<typeof vi.fn>;
  let queryRenderedFeatures: ReturnType<typeof vi.fn>;
  let map: Map;
  let popupRef: { current: { remove: ReturnType<typeof vi.fn> } | null };
  let removePopup: ReturnType<typeof vi.fn>;

  const listenerKey = (event: string, layerId?: string) =>
    layerId ? `${event}:${layerId}` : event;

  const emit = (event: string, layerId?: string, payload?: unknown) => {
    const handlers = listeners[listenerKey(event, layerId)] ?? [];
    handlers.forEach((handler) => handler(payload));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    popupMocks.instances.length = 0;
    vi.mocked(isMapDrawModeActive).mockReturnValue(false);

    listeners = {};
    classList = { add: vi.fn(), remove: vi.fn() };
    setData = vi.fn();
    queryRenderedFeatures = vi.fn().mockReturnValue([]);
    popupRef = { current: null };
    removePopup = vi.fn(() => {
      popupRef.current?.remove();
      popupRef.current = null;
    });

    map = {
      getZoom: vi.fn().mockReturnValue(5),
      getCanvas: () => ({ classList }),
      getLayer: vi.fn((id: string) =>
        PMTILE_LAYERS.some(
          (layer) => layer.id === id || pmtilesHitLayerId(layer.id) === id
        )
          ? {}
          : undefined
      ),
      queryRenderedFeatures,
      getSource: vi.fn((id: string) =>
        id === "pmtiles-hover-source-id" ? { setData } : undefined
      ),
      on: vi.fn(
        (event: string, layerOrHandler: unknown, maybeHandler?: unknown) => {
          const [layerId, handler] =
            typeof layerOrHandler === "function"
              ? [undefined, layerOrHandler]
              : [layerOrHandler as string, maybeHandler];
          const key = listenerKey(event, layerId);
          (listeners[key] ??= []).push(handler as (...args: unknown[]) => void);
        }
      ),
      off: vi.fn(
        (event: string, layerOrHandler: unknown, maybeHandler?: unknown) => {
          const [layerId, handler] =
            typeof layerOrHandler === "function"
              ? [undefined, layerOrHandler]
              : [layerOrHandler as string, maybeHandler];
          const key = listenerKey(event, layerId);
          listeners[key] = (listeners[key] ?? []).filter((h) => h !== handler);
        }
      ),
    } as unknown as Map;
  });

  const attach = (ctx = makeCtx()) =>
    attachPmtilesHexInteraction(
      map,
      ctx,
      popupRef as { current: null },
      removePopup
    );

  it("registers map click, touchend, and mousemove on every hex band", () => {
    attach();
    const layerIds = PMTILE_LAYERS.map((layer) => layer.id);
    for (const id of layerIds) {
      expect(listeners[`mousemove:${id}`]).toHaveLength(1);
      expect(listeners[`click:${id}`]).toBeUndefined();
      expect(listeners[`mouseleave:${id}`]).toHaveLength(1);
    }
    expect(listeners.click).toHaveLength(1);
    expect(listeners.touchend).toHaveLength(1);
    expect(listeners.zoomend).toHaveLength(1);
    expect(listeners.zoom).toBeUndefined();
  });

  it("hover outlines the hex and sets the pointer, but does not open a popup", () => {
    attach();
    emit("mousemove", HEX_LAYER.id, makeEvent(makeFeature("hex-1")));

    expect(classList.add).toHaveBeenCalledWith("map-cursor-pointer");
    expect(setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "FeatureCollection",
        features: [expect.objectContaining({ geometry: HEX_GEOMETRY })],
      })
    );
    expect(popupMocks.Popup).not.toHaveBeenCalled();
    expect(removePopup).not.toHaveBeenCalled();
  });

  it("click opens the count popup with the default close button", () => {
    attach();
    emit("click", undefined, makeEvent(makeFeature("hex-1")));

    expect(popupMocks.Popup).toHaveBeenCalledWith(
      MapDefaultConfig.DEFAULT_POPUP
    );
    const popup = popupMocks.instances[0];
    expect(popup.setHTML).toHaveBeenCalledWith(
      expect.stringContaining("Data Record Count: 12")
    );
    expect(popup.setLngLat).toHaveBeenCalledWith({ lng: 147, lat: -42 });
    expect(popup.addTo).toHaveBeenCalledWith(map);
    expect(popup.getElement()).toMatchObject({
      dataset: { testid: playwrightTestIds.DETAIL_MAP_POPUP },
    });
  });

  it("queries a padded hit layer when the click event has no features", () => {
    attach();
    const feature = makeFeature("hex-1");
    queryRenderedFeatures.mockReturnValue([feature]);
    emit("click", undefined, makeEvent());

    expect(queryRenderedFeatures).toHaveBeenCalledWith(
      [
        [-14, -4],
        [34, 44],
      ],
      { layers: [pmtilesHitLayerId(HEX_LAYER.id)] }
    );
    expect(popupMocks.Popup).toHaveBeenCalled();
    expect(popupMocks.instances[0].setHTML).toHaveBeenCalledWith(
      expect.stringContaining("Data Record Count: 12")
    );
  });

  it("touchend opens the popup for a single-finger tap", () => {
    attach();
    queryRenderedFeatures.mockReturnValue([makeFeature("hex-1")]);
    emit("touchend", undefined, {
      ...makeEvent(),
      points: [{ x: 10, y: 20 }],
    });

    expect(popupMocks.Popup).toHaveBeenCalled();
  });

  it("mouseleave after click restores the selected outline and leaves the popup open", () => {
    attach();
    emit("click", undefined, makeEvent(makeFeature("hex-1")));
    setData.mockClear();
    classList.remove.mockClear();

    emit("mouseleave", HEX_LAYER.id);

    expect(classList.remove).toHaveBeenCalledWith("map-cursor-pointer");
    expect(setData).toHaveBeenCalledWith(
      expect.objectContaining({
        features: [expect.objectContaining({ geometry: HEX_GEOMETRY })],
      })
    );
    expect(removePopup).not.toHaveBeenCalled();
  });

  it("zoomend in the same hex band leaves the popup open", () => {
    attach();
    emit("click", undefined, makeEvent(makeFeature("hex-1")));
    vi.mocked(map.getZoom).mockReturnValue(5.4);
    emit("zoomend");

    expect(removePopup).not.toHaveBeenCalled();
  });

  it("zoomend into another hex band clears the open popup and outline", () => {
    attach();
    emit("click", undefined, makeEvent(makeFeature("hex-1")));
    vi.mocked(map.getZoom).mockReturnValue(7);
    emit("zoomend");

    expect(removePopup).toHaveBeenCalled();
    expect(setData).toHaveBeenCalledWith({
      type: "FeatureCollection",
      features: [],
    });
  });

  it("does not open a popup when density is not ready", () => {
    attach(makeCtx({ densityReady: false }));
    emit("click", undefined, makeEvent(makeFeature("hex-1")));
    expect(popupMocks.Popup).not.toHaveBeenCalled();
    expect(removePopup).toHaveBeenCalled();
  });

  it("does not open a popup for a hex with no in-range records", () => {
    attach();
    emit(
      "click",
      undefined,
      makeEvent(
        makeFeature("hex-empty", {
          "2010": {
            [TOTAL_KEY]: 9,
            "01": { [TOTAL_KEY]: 9, [DAYS_KEY]: { "01": 9 } },
          },
        })
      )
    );
    expect(popupMocks.Popup).not.toHaveBeenCalled();
    expect(removePopup).toHaveBeenCalled();
  });

  it("skips popup and outline while Mapbox Draw is active", () => {
    vi.mocked(isMapDrawModeActive).mockReturnValue(true);
    attach();
    emit("click", undefined, makeEvent(makeFeature("hex-1")));
    emit("mousemove", HEX_LAYER.id, makeEvent(makeFeature("hex-1")));
    expect(popupMocks.Popup).not.toHaveBeenCalled();
    expect(removePopup).toHaveBeenCalled();
  });

  it("unbinds map listeners on cleanup", () => {
    const detach = attach();
    detach();
    expect(listeners.click).toHaveLength(0);
    expect(listeners.touchend).toHaveLength(0);
    expect(listeners[`mousemove:${HEX_LAYER.id}`]).toHaveLength(0);
    expect(listeners.zoomend).toHaveLength(0);
  });
});
