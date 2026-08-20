import { describe, it, expect, vi, afterEach } from "vitest";
import { AxiosResponse } from "axios";
import {
  processWFSDownload,
  processWFSEstimateSize,
  fetchGriddedTileProducts,
  ogcAxiosWithRetry,
} from "../searchReducer";
import {
  WFSDownloadRequest,
  DateRangeCondition,
  FormatCondition,
} from "@/pages/detail-page/context/DownloadDefinitions";
import { configureStore } from "@reduxjs/toolkit";

describe("searchReducer async thunks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("processWFSDownload sends correct request body", async () => {
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "post")
      .mockResolvedValue({ data: {} } as AxiosResponse);

    const mockRequest: WFSDownloadRequest = {
      uuid: "test-uuid",
      layerName: "test-layer",
      downloadConditions: [
        new DateRangeCondition("d1", "2020-01-01", "2020-01-02"),
        new FormatCondition("f1", "CSV"),
      ],
    };

    const store = configureStore({
      reducer: (state = {}) => state,
    });

    await store.dispatch(processWFSDownload(mockRequest));

    expect(spy).toHaveBeenCalledWith(
      "/ogc/processes/downloadWfs/execution",
      expect.objectContaining({
        inputs: {
          uuid: "test-uuid",
          start_date: "2020-01-01",
          end_date: "2020-01-02",
          multi_polygon: "non-specified",
          layer_name: "test-layer",
          output_format: "CSV",
        },
        outputs: {},
        subscriber: {
          successUri: "",
          inProgressUri: "",
          failedUri: "",
        },
      }),
      expect.objectContaining({
        adapter: "fetch",
        responseType: "stream",
      })
    );
  });

  it("processWFSEstimateSize sends correct request body", async () => {
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "post")
      .mockResolvedValue({ data: {} } as AxiosResponse);

    const mockRequest: WFSDownloadRequest = {
      uuid: "test-uuid",
      layerName: "test-layer",
      downloadConditions: [
        new DateRangeCondition("d1", "2020-01-01", "2020-01-02"),
        new FormatCondition("f1", "CSV"),
      ],
    };

    const store = configureStore({
      reducer: (state = {}) => state,
    });

    await store.dispatch(processWFSEstimateSize(mockRequest));

    expect(spy).toHaveBeenCalledWith(
      "/ogc/processes/estimateWfsDownload/execution",
      expect.objectContaining({
        inputs: {
          uuid: "test-uuid",
          layer_name: "test-layer",
          start_date: "2020-01-01",
          end_date: "2020-01-02",
          output_format: "CSV",
          multi_polygon: "non-specified",
        },
      }),
      expect.objectContaining({
        adapter: "fetch",
        responseType: "stream",
      })
    );
  });

  it("fetchGriddedTileProducts requests the uuid-scoped OGC products path", async () => {
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "get")
      .mockResolvedValue({ data: { products: [] } } as AxiosResponse);

    const store = configureStore({
      reducer: (state = {}) => state,
    });

    await store.dispatch(fetchGriddedTileProducts({ uuid: "test-uuid" }));

    expect(spy).toHaveBeenCalledTimes(1);
    const [path, config] = spy.mock.calls[0];
    expect(path).toBe("/ogc/ext/tiles/collections/test-uuid/products");
    // No query params — the listing takes none.
    expect(config).not.toHaveProperty("params");
    expect(config?.signal).toBeDefined();
    // The shared instance retries 10x; a DAS warmup 503 must not stay alive for
    // ~17 minutes per page view.
    expect(config?.["axios-retry"]).toEqual(
      expect.objectContaining({ retries: 2 })
    );
  });
});
