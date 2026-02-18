import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../../../../common/store/searchReducer";
import GeoServerLayer from "../GeoServerLayer";
import MapContext from "../../MapContext";
import { OGCCollection } from "../../../../common/store/OGCCollectionDefinitions";
import AdminScreenContext from "../../../../admin/AdminScreenContext";
import {
  MapFieldResponse,
  MapLayerResponse,
} from "../../../../common/store/GeoserverDefinitions";
import { MapEventEnum } from "../../constants";
import utc from "dayjs/plugin/utc";
import { extend } from "dayjs";

extend(utc);

// 1. Use vi.hoisted to ensure this object exists before ANY imports
const mocks = vi.hoisted(() => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

// 2. Mock axios - Vitest hoists this, but allows 'mockAxiosInstance' because of its name
vi.mock("axios", async () => {
  const actual: any = await vi.importActual("axios");
  return {
    default: {
      ...actual,
      create: vi.fn(() => mocks.axiosInstance),
      isAxiosError: actual.isAxiosError,
    },
    create: vi.fn(() => mocks.axiosInstance),
    isAxiosError: actual.isAxiosError,
  };
});

// Mock mapbox-gl
vi.mock("mapbox-gl", () => ({
  Popup: vi.fn(() => ({
    setLngLat: vi.fn().mockReturnThis(),
    setDOMContent: vi.fn().mockReturnThis(),
    addTo: vi.fn().mockReturnThis(),
    remove: vi.fn(),
  })),
}));

describe("GeoServerLayer", () => {
  let mockMap: any;
  let store: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockMap = {
      getContainer: () => ({ id: "test-map" }),
      getSource: vi.fn(),
      addSource: vi.fn(),
      getLayer: vi.fn(),
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      once: (a: MapEventEnum, b: any) => a === MapEventEnum.IDLE && b(),
      isStyleLoaded: vi.fn().mockReturnValue(true),
      getCanvas: () => ({ width: 800, height: 600 }),
      getBounds: () => ({ toArray: () => [[0, 0, 0, 0]] }),
      getLayoutProperty: vi.fn(),
      setLayoutProperty: vi.fn(),
    };

    store = configureStore({
      reducer: { search: searchReducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    });
  });

  const renderComponent = (props: any = {}) => {
    const collection = Object.assign(new OGCCollection(), {
      id: "test-uuid",
    });
    collection.getWMSLinks = vi
      .fn()
      .mockReturnValue([
        { title: "WMS Layer", href: "https://test.com?layers=test_layer" },
      ]);

    return render(
      <Provider store={store}>
        <AdminScreenContext.Provider
          value={{ enableGeoServerWhiteList: false } as any}
        >
          <MapContext.Provider
            value={{ map: mockMap, setLoading: vi.fn() } as any}
          >
            <GeoServerLayer
              visible={true}
              collection={collection}
              onWMSAvailabilityChange={vi.fn()}
              onWFSAvailabilityChange={vi.fn()}
              onWmsLayerChange={vi.fn()}
              setTimeSliderSupport={vi.fn()}
              setDrawRectSupportSupport={vi.fn()}
              setDiscreteTimeSliderValues={vi.fn()}
              {...props}
            />
          </MapContext.Provider>
        </AdminScreenContext.Provider>
      </Provider>
    );
  };

  it("should fetch layers and fields and add mapbox layer", async () => {
    mocks.axiosInstance.get.mockImplementation((url: string) => {
      if (url.includes("wms_layers")) {
        return Promise.resolve({
          data: [{ name: "test_layer", title: "Test Layer" }],
        });
      }
      if (url.includes("wms_fields")) {
        return Promise.resolve({ data: [{ type: "dateTime" }] });
      }
      return Promise.resolve({ data: [] });
    });

    const onWFSAvailabilityChange = vi.fn();
    const onWMSAvailabilityChange = vi.fn();
    const onWmsLayerChange = vi.fn();

    renderComponent({
      onWMSAvailabilityChange,
      onWFSAvailabilityChange,
      onWmsLayerChange,
    });

    await waitFor(() => {
      expect(mocks.axiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining("wms_layers"),
        expect.anything()
      );
      expect(onWFSAvailabilityChange).toHaveBeenCalledWith(true);
      expect(onWMSAvailabilityChange).toHaveBeenCalledWith(true);
      expect(onWmsLayerChange).toHaveBeenCalledWith("test_layer");
    });

    await waitFor(() => {
      expect(mockMap.addLayer).toHaveBeenCalledWith({
        id: "test-map-geo-server-layer-tile",
        type: "raster",
        source: "test-map-geo-server-layer-source",
        paint: {
          "raster-opacity": 0.6,
        },
        layout: {
          visibility: "none",
        },
      });
    });
  });

  it("should handle 404 on fields by falling back", () => {
    mocks.axiosInstance.get.mockImplementation((url: string) => {
      if (url.includes("wms_layers")) {
        return Promise.resolve({
          data: [
            {
              name: "fallback",
              title: "Fallback",
              queryable: "0",
            } as MapLayerResponse,
          ],
        });
      }
      if (url.includes("wms_fields")) {
        return Promise.reject({
          response: { status: 404, data: { message: "Not found" } },
          isAxiosError: true,
        });
      }
      return Promise.resolve({ data: [] });
    });

    const onWFSAvailabilityChange = vi.fn();
    const onWMSAvailabilityChange = vi.fn();
    const onWmsLayerChange = vi.fn();

    renderComponent({
      onWMSAvailabilityChange,
      onWFSAvailabilityChange,
      onWmsLayerChange,
    });

    return waitFor(() => {
      expect(onWFSAvailabilityChange).toHaveBeenCalledWith(false);
      expect(onWMSAvailabilityChange).toHaveBeenCalledWith(true);
      expect(onWmsLayerChange).toHaveBeenCalledWith("fallback");
    });
  });

  it("should handle metadata with single time point slider", async () => {
    const ncWmsLayerInfo = {
      units: "kelvin",
      bbox: [-180, -77.48999786376953, 180, -27.510000228881836],
      palettes: [
        "rainbow",
        "occam",
        "redblue",
        "ncview",
        "sst_36",
        "greyscale",
        "occam_pastel-30",
        "alg2",
        "ferret",
        "alg",
      ],
      defaultPalette: "rainbow",
      scaleRange: [268, 310],
      datesWithData: {
        "1992": {
          "2": [23, 24, 25, 26, 29, 30, 31, 21],
          "5": [1, 3, 4, 5, 6],
        },
      },
      numColorBands: 253,
      supportedStyles: ["boxfill", "contour"],
      moreInfo: "",
      timeAxisUnits: "unknown",
      nearestTimeIso: "2025-06-06T11:10:00.000Z",
      logScaling: false,
    };
    const data = [
      {
        name: "single",
        title: "Single",
        queryable: "0",
        ncWmsLayerInfo: ncWmsLayerInfo,
      } as MapLayerResponse,
    ];

    mocks.axiosInstance.get.mockImplementation((url: string) => {
      if (url.includes("wms_layers")) {
        return Promise.resolve({
          data: data,
        });
      }
      if (url.includes("wms_fields")) {
        return Promise.resolve({
          data: [{ type: "dateTime" } as MapFieldResponse],
        });
      }
      return Promise.resolve({ data: [] });
    });

    const onWFSAvailabilityChange = vi.fn();
    const onWMSAvailabilityChange = vi.fn();
    const onWmsLayerChange = vi.fn();
    const setTimeSliderSupport = vi.fn();
    const setDiscreteTimeSliderValues = vi.fn();

    renderComponent({
      onWMSAvailabilityChange,
      onWFSAvailabilityChange,
      onWmsLayerChange,
      setTimeSliderSupport,
      setDiscreteTimeSliderValues,
    });

    await waitFor(() => {
      expect(onWFSAvailabilityChange).toHaveBeenCalledWith(true);
      expect(onWMSAvailabilityChange).toHaveBeenCalledWith(true);
      expect(onWmsLayerChange).toHaveBeenCalledWith("test_layer");
      expect(setTimeSliderSupport).toHaveBeenCalledWith(true);
      expect(setDiscreteTimeSliderValues).toHaveBeenCalled();
    });
  });
});
