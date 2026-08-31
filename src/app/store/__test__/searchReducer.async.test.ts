import { describe, it, expect, vi, afterEach } from "vitest";
import {
  processWFSDownload,
  processWFSEstimateSize,
  fetchGriddedTileProducts,
  processDatasetDownload,
  ogcAxiosWithRetry,
} from "../searchReducer";
import {
  WFSDownloadRequest,
  DatasetDownloadRequest,
  DateRangeCondition,
  FormatCondition,
} from "@/pages/detail-page/context/DownloadDefinitions";
import { configureStore } from "@reduxjs/toolkit";

describe("searchReducer async thunks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("processDatasetDownload preserves the request and returns jobID", async () => {
    const request: DatasetDownloadRequest = {
      inputs: {
        uuid: "collection-id",
        key: "dataset.zarr",
        recipient: "user@example.com",
        start_date: "2026-01-01",
        end_date: "2026-01-31",
        multi_polygon: "non-specified",
        output_format: "netcdf",
        collection_title: "Collection title",
        full_metadata_link: "https://example.com/details/collection-id",
        suggested_citation: "Citation",
        estimated_size_bytes: 987654,
      },
      outputs: {},
      subscriber: {
        successUri: "place_holder",
        inProgressUri: "place_holder",
        failedUri: "place_holder",
      },
    };
    const response = {
      message: { message: "Job submitted" },
      status: { message: "200" },
      jobID: "123e4567-e89b-12d3-a456-426614174000",
    };
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "post")
      .mockResolvedValue({ data: response } as any);
    const store = configureStore({ reducer: (state = {}) => state });

    const result = await store.dispatch(processDatasetDownload(request) as any);

    expect(spy).toHaveBeenCalledWith(
      "/ogc/processes/download/execution",
      request
    );
    expect(result.payload).toEqual(response);
  });

  it("processWFSDownload sends correct request body", async () => {
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "post")
      .mockResolvedValue({ data: {} } as any);

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

    await store.dispatch(processWFSDownload(mockRequest) as any);

    expect(spy).toHaveBeenCalledWith(
      "/ogc/processes/downloadWfs/execution",
      expect.objectContaining({
        inputs: {
          uuid: "test-uuid",
          start_date: "2020-01-01T00:00:00Z",
          end_date: "2020-01-02T23:59:59Z",
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
      .mockResolvedValue({ data: {} } as any);

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

    await store.dispatch(processWFSEstimateSize(mockRequest) as any);

    expect(spy).toHaveBeenCalledWith(
      "/ogc/processes/estimateWfsDownload/execution",
      expect.objectContaining({
        inputs: {
          uuid: "test-uuid",
          layer_name: "test-layer",
          start_date: "2020-01-01T00:00:00Z",
          end_date: "2020-01-02T23:59:59Z",
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
      .mockResolvedValue({ data: { products: [] } } as any);

    const store = configureStore({
      reducer: (state = {}) => state,
    });

    await store.dispatch(
      fetchGriddedTileProducts({ uuid: "test-uuid" }) as any
    );

    expect(spy).toHaveBeenCalledTimes(1);
    const [path, config] = spy.mock.calls[0];
    expect(path).toBe("/ogc/ext/tiles/collections/test-uuid/products");
    // No query params — the listing takes none.
    expect(config).not.toHaveProperty("params");
    expect(config?.signal).toBeDefined();
    // The shared instance retries 10x; a DAS warmup 503 must not stay alive for
    // ~17 minutes per page view.
    expect((config as any)["axios-retry"]).toEqual(
      expect.objectContaining({ retries: 2 })
    );
  });
});
