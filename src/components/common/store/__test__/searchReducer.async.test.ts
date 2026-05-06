import { describe, it, expect, vi, afterEach } from "vitest";
import {
  processWFSDownload,
  processWFSEstimateSize,
  ogcAxiosWithRetry,
} from "../searchReducer";
import {
  WFSDownloadRequest,
  DateRangeCondition,
  FormatCondition,
} from "../../../../pages/detail-page/context/DownloadDefinitions";
import { configureStore } from "@reduxjs/toolkit";

describe("searchReducer async thunks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
});
