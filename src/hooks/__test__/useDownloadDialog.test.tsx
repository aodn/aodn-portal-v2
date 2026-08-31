import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TRACKED_DOWNLOAD_IDS_KEY } from "@/utils/DownloadStorageUtils";
import { useDownloadDialog } from "../useDownloadDialog";

const { mockDispatch, mockProcessDatasetDownload } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockProcessDatasetDownload: vi.fn((request) => ({
    type: "download/downloadDataset",
    payload: request,
  })),
}));

vi.mock("@/app/store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock("@/app/store/searchReducer", () => ({
  processDatasetDownload: mockProcessDatasetDownload,
}));

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useParams: () => ({ uuid: "collection-id" }),
}));

vi.mock("@/pages/detail-page/context/detail-page-context", () => ({
  useDetailPageContext: () => ({
    downloadConditions: [],
    collection: {
      title: "Test Ocean Data Collection",
      getCitation: () => ({ suggestedCitation: "Citation" }),
    },
  }),
}));

vi.mock("@/utils/DownloadConditionUtils", () => ({
  getDateConditionFrom: () => ({
    start: "2026-01-01",
    end: "2026-01-31",
  }),
  getFormatFrom: () => "netcdf",
  getKeyFrom: () => "imos-data/dataset.zarr",
  getMultiPolygonFrom: () => "non-specified",
}));

vi.mock("@/analytics/customEventTracker", () => ({
  trackCustomEvent: vi.fn(),
}));

const JOB_ID = "123e4567-e89b-12d3-a456-426614174000";

// Reply to the next execute call with this payload.
const respondWith = (payload: Record<string, unknown>) =>
  mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve(payload) });

const executionResponse = (extra: Record<string, unknown>) => ({
  message: { message: "Job submitted" },
  status: { message: "200" },
  jobID: JOB_ID,
  ...extra,
});

const submit = (result: { current: ReturnType<typeof useDownloadDialog> }) => {
  act(() => result.current.setEmail("user@example.com"));
  act(() => result.current.handleStepperButtonClick());
  act(() => result.current.handleStepperButtonClick());
};

describe("useDownloadDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    respondWith(executionResponse({}));
  });

  afterEach(() => vi.restoreAllMocks());

  it("sends the available estimated size with the download request", async () => {
    const { result } = renderHook(() =>
      useDownloadDialog(true, vi.fn(), 987654)
    );

    act(() => result.current.setEmail("user@example.com"));
    act(() => result.current.handleStepperButtonClick());
    expect(result.current.activeStep).toBe(1);

    act(() => result.current.handleStepperButtonClick());

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
    expect(mockProcessDatasetDownload).toHaveBeenCalledWith(
      expect.objectContaining({
        inputs: expect.objectContaining({
          collection_title: "Test Ocean Data Collection",
          key: "imos-data/dataset.zarr",
          output_format: "netcdf",
          full_metadata_link: "http://localhost:3000/details/collection-id",
          estimated_size_bytes: 987654,
        }),
      })
    );
    await waitFor(() => expect(result.current.createdJobID).toBe(JOB_ID));
  });

  it("does not expose an untracked job when browser storage is unavailable", async () => {
    const originalSetItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key: string,
      value: string
    ) {
      if (key === TRACKED_DOWNLOAD_IDS_KEY) {
        throw new DOMException("Storage unavailable", "SecurityError");
      }
      originalSetItem.call(this, key, value);
    });
    const { result } = renderHook(() =>
      useDownloadDialog(true, vi.fn(), 987654)
    );

    act(() => result.current.setEmail("user@example.com"));
    act(() => result.current.handleStepperButtonClick());
    act(() => result.current.handleStepperButtonClick());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.createdJobID).toBeUndefined();
  });
});

describe("useDownloadDialog queued downloads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => vi.restoreAllMocks());

  it("reports a download that ogcapi sent straight to AWS as not queued", async () => {
    respondWith(executionResponse({ queued: false }));
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.isQueued).toBe(false);
    expect(result.current.queuePosition).toBeNull();
    expect(result.current.getProcessStatusText()).toBe(
      "Download email will be sent shortly."
    );
  });

  it("reports a held download as queued and keeps its position", async () => {
    respondWith(executionResponse({ queued: true, queuePosition: 3 }));
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);

    await waitFor(() => expect(result.current.isQueued).toBe(true));
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.queuePosition).toBe(3);
    expect(result.current.getProcessStatusText()).toBe("Download queued");
  });

  it("counts positions excluding the download itself and never promises a time", async () => {
    respondWith(executionResponse({ queued: true, queuePosition: 3 }));
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);
    await waitFor(() => expect(result.current.isQueued).toBe(true));

    const text = result.current.getQueuedInfoText();
    // queuePosition 3 includes this download, so 2 sit ahead of it.
    expect(text).toContain("2 of your own downloads ahead of it");
    expect(text).toContain("we will email you then");
    expect(text).not.toMatch(/minute|hour|estimat/i);
  });

  it("says a download at position 1 is next to start", async () => {
    respondWith(executionResponse({ queued: true, queuePosition: 1 }));
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);
    await waitFor(() => expect(result.current.isQueued).toBe(true));

    expect(result.current.getQueuedInfoText()).toContain("next to start");
  });

  it("treats a response without the queue fields as not queued", async () => {
    respondWith(executionResponse({}));
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.isQueued).toBe(false);
  });

  it("does not mark a rejected request as queued", async () => {
    respondWith({
      message: { message: "Error while getting dataset" },
      status: { message: "400" },
    });
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);

    await waitFor(() => expect(result.current.processingStatus).toBe("400"));
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isQueued).toBe(false);
  });
});
