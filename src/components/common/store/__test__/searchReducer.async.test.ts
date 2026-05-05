import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { processWFSDownload, processWFSEstimateSize } from "../searchReducer";
import {
  WFSDownloadRequest,
  DateRangeCondition,
  FormatCondition,
} from "../../../../pages/detail-page/context/DownloadDefinitions";
import { configureStore } from "@reduxjs/toolkit";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

describe("searchReducer async thunks", () => {
  it("processWFSDownload sends correct request body", async () => {
    let capturedBody: any;
    server.use(
      http.post(
        "/api/v1/ogc/processes/downloadWfs/execution",
        async ({ request }) => {
          capturedBody = await request.json();
          return new HttpResponse(null, { status: 200 });
        }
      )
    );

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

    expect(capturedBody).toEqual({
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
    });
  });

  it("processWFSEstimateSize sends correct request body", async () => {
    let capturedBody: any;
    server.use(
      http.post(
        "/api/v1/ogc/processes/estimateWfsDownload/execution",
        async ({ request }) => {
          capturedBody = await request.json();
          return new HttpResponse(null, { status: 200 });
        }
      )
    );

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

    expect(capturedBody).toEqual({
      inputs: {
        uuid: "test-uuid",
        layer_name: "test-layer",
        start_date: "2020-01-01",
        end_date: "2020-01-02",
        output_format: "CSV",
        multi_polygon: "non-specified",
      },
    });
  });
});
