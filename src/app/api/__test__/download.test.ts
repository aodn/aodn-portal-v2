import { describe, it, expect, vi, afterEach } from "vitest";
import { postWfsDownload, postWfsEstimate } from "../download";
import { ogcAxiosWithRetry } from "../httpClient";
import {
  WFSDownloadRequest,
  DateRangeCondition,
  FormatCondition,
} from "@/pages/detail-page/context/DownloadDefinitions";

describe("download api request bodies", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockRequest: WFSDownloadRequest = {
    uuid: "test-uuid",
    layerName: "test-layer",
    downloadConditions: [
      new DateRangeCondition("d1", "2020-01-01", "2020-01-02"),
      new FormatCondition("f1", "CSV"),
    ],
  };

  it("postWfsDownload sends correct request body", async () => {
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "post")
      .mockResolvedValue({ data: {} } as any);

    await postWfsDownload(mockRequest);

    expect(spy).toHaveBeenCalledTimes(1);
    const [url, body] = spy.mock.calls[0];
    expect(url).toBe("/ogc/processes/downloadWfs/execution");
    expect(body).toMatchObject({
      inputs: {
        uuid: "test-uuid",
        layer_name: "test-layer",
        start_date: "2020-01-01",
        end_date: "2020-01-02",
        output_format: "CSV",
      },
    });
  });

  it("postWfsEstimate sends correct request body", async () => {
    const spy = vi
      .spyOn(ogcAxiosWithRetry, "post")
      .mockResolvedValue({ data: {} } as any);

    await postWfsEstimate(mockRequest);

    expect(spy).toHaveBeenCalledTimes(1);
    const [url, body] = spy.mock.calls[0];
    expect(url).toBe("/ogc/processes/estimateWfsDownload/execution");
    expect(body).toMatchObject({
      inputs: {
        uuid: "test-uuid",
        layer_name: "test-layer",
        start_date: "2020-01-01",
        end_date: "2020-01-02",
        output_format: "CSV",
      },
    });
  });
});
