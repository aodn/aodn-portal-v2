import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DownloadStatusInfo } from "@/app/store/DownloadStatusDefinitions";
import { TRACKED_DOWNLOAD_IDS_KEY } from "@/utils/DownloadStorageUtils";
import useDownloadStatus, {
  POLLING_INTERVAL_MS,
  RETRY_DELAYS_MS,
  STATUS_ERROR_MESSAGE,
} from "../useDownloadStatus";

const mockFetchDownloadStatus = vi.hoisted(() => vi.fn());

vi.mock("../api", () => ({
  fetchDownloadStatus: mockFetchDownloadStatus,
}));

const JOB_ID = "123e4567-e89b-12d3-a456-426614174000";

const statusResponse = (
  status: DownloadStatusInfo["status"],
  overrides: Partial<DownloadStatusInfo> = {}
): DownloadStatusInfo => ({
  processID: "download-dataset",
  type: "process",
  jobID: JOB_ID,
  status,
  message: `Download job is ${status}`,
  ...overrides,
});

const flushPromises = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const axiosError = (status?: number) =>
  Object.assign(new Error("Request failed"), {
    isAxiosError: true,
    response: status ? { status } : undefined,
  });

describe("useDownloadStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.setItem(TRACKED_DOWNLOAD_IDS_KEY, JSON.stringify([JOB_ID]));
    mockFetchDownloadStatus.mockReset();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    localStorage.clear();
  });

  it("polls sequentially from accepted to running to successful", async () => {
    expect(POLLING_INTERVAL_MS).toBe(5 * 60_000);

    mockFetchDownloadStatus
      .mockResolvedValueOnce(statusResponse("accepted"))
      .mockResolvedValueOnce(statusResponse("running"))
      .mockResolvedValueOnce(
        statusResponse("successful", {
          collection: "Test Ocean Data Collection",
          dataSelection: "imos-data/dataset.zarr",
          format: "netcdf",
          metadataUrl: "https://example.com/details/collection-id",
          started: "2026-08-24T01:00:10.000+00:00",
          finished: "2026-08-24T01:01:00.000+00:00",
          updated: "2026-08-24T01:01:01.000+00:00",
        })
      );

    const { result } = renderHook(() => useDownloadStatus());
    await flushPromises();
    expect(result.current.downloads[0].status).toBe("accepted");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLLING_INTERVAL_MS);
    });
    expect(result.current.downloads[0].status).toBe("running");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLLING_INTERVAL_MS);
    });
    expect(result.current.downloads[0]).toEqual(
      expect.objectContaining({
        status: "successful",
        collection: "Test Ocean Data Collection",
        dataSelection: "imos-data/dataset.zarr",
        format: "netcdf",
        metadataUrl: "https://example.com/details/collection-id",
        started: "2026-08-24T01:00:10.000+00:00",
        finished: "2026-08-24T01:01:00.000+00:00",
        updated: "2026-08-24T01:01:01.000+00:00",
        lookupState: "available",
      })
    );
    expect(mockFetchDownloadStatus).toHaveBeenCalledTimes(3);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("stops immediately for a failed terminal status with optional dates absent", async () => {
    mockFetchDownloadStatus.mockResolvedValue(statusResponse("failed"));

    const { result } = renderHook(() => useDownloadStatus());
    await flushPromises();

    expect(result.current.downloads[0]).toEqual(
      expect.objectContaining({
        status: "failed",
        created: undefined,
        started: undefined,
        finished: undefined,
      })
    );
    expect(mockFetchDownloadStatus).toHaveBeenCalledTimes(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });
    expect(mockFetchDownloadStatus).toHaveBeenCalledTimes(1);
  });

  it("treats a 404 as unavailable without retrying", async () => {
    mockFetchDownloadStatus.mockRejectedValue(axiosError(404));

    const { result } = renderHook(() => useDownloadStatus());
    await flushPromises();

    expect(result.current.downloads[0]).toEqual(
      expect.objectContaining({
        lookupState: "unavailable",
        pollingError: "Download job unavailable.",
      })
    );
    expect(mockFetchDownloadStatus).toHaveBeenCalledTimes(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });
    expect(mockFetchDownloadStatus).toHaveBeenCalledTimes(1);
  });

  it("uses limited backoff for server errors and supports manual retry", async () => {
    mockFetchDownloadStatus.mockRejectedValue(axiosError(500));

    const { result } = renderHook(() => useDownloadStatus());
    await flushPromises();

    for (const delay of RETRY_DELAYS_MS) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(delay);
      });
    }

    expect(mockFetchDownloadStatus).toHaveBeenCalledTimes(4);
    expect(result.current.downloads[0]).toEqual(
      expect.objectContaining({
        lookupState: "error",
        pollingError: STATUS_ERROR_MESSAGE,
      })
    );

    mockFetchDownloadStatus.mockReset();
    mockFetchDownloadStatus.mockResolvedValue(statusResponse("successful"));
    act(() => result.current.retryDownload(JOB_ID));
    await flushPromises();

    expect(result.current.downloads[0].status).toBe("successful");
    expect(result.current.downloads[0].pollingError).toBeUndefined();
  });

  it("does not turn a running job into failed after a network error", async () => {
    mockFetchDownloadStatus
      .mockResolvedValueOnce(statusResponse("running"))
      .mockRejectedValueOnce(axiosError());

    const { result } = renderHook(() => useDownloadStatus());
    await flushPromises();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLLING_INTERVAL_MS);
    });

    expect(result.current.downloads[0].status).toBe("running");
    expect(result.current.downloads[0].lookupState).toBe("checking");
  });

  it("aborts an active request and clears polling when unmounted", () => {
    let requestSignal: AbortSignal | undefined;
    mockFetchDownloadStatus.mockImplementation(
      (_jobID: string, signal: AbortSignal) => {
        requestSignal = signal;
        return new Promise(() => {});
      }
    );

    const { unmount } = renderHook(() => useDownloadStatus());
    expect(requestSignal?.aborted).toBe(false);

    unmount();

    expect(requestSignal?.aborted).toBe(true);
  });

  it("clears a scheduled poll when unmounted", async () => {
    mockFetchDownloadStatus.mockResolvedValue(statusResponse("running"));

    const { unmount } = renderHook(() => useDownloadStatus());
    await flushPromises();

    expect(mockFetchDownloadStatus).toHaveBeenCalledTimes(1);
    const timerCountBeforeUnmount = vi.getTimerCount();
    expect(timerCountBeforeUnmount).toBeGreaterThan(0);

    unmount();

    expect(vi.getTimerCount()).toBeLessThan(timerCountBeforeUnmount);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLLING_INTERVAL_MS);
    });
    expect(mockFetchDownloadStatus).toHaveBeenCalledTimes(1);
  });

  it("removes a job locally and aborts its active request", () => {
    let requestSignal: AbortSignal | undefined;
    mockFetchDownloadStatus.mockImplementation(
      (_jobID: string, signal: AbortSignal) => {
        requestSignal = signal;
        return new Promise(() => {});
      }
    );

    const { result } = renderHook(() => useDownloadStatus());
    act(() => result.current.removeDownload(JOB_ID));

    expect(result.current.downloads).toEqual([]);
    expect(requestSignal?.aborted).toBe(true);
    expect(localStorage.getItem(TRACKED_DOWNLOAD_IDS_KEY)).toBe("[]");
  });
});
