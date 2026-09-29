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
      id: "collection-id",
      title: "Test Ocean Data Collection",
      getCitation: () => ({
        suggestedCitation:
          "IMOS [year-of-data-download], [Title], [data-access-URL], accessed [date-of-access]",
      }),
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

// Reject the next execute call, as errorHandling()/rejectWithValue() does for
// a genuine HTTP error status (statusCode), not the 200-with-embedded-status
// shape the OGC endpoint otherwise uses for domain errors. errorHandling()
// puts the server message in details.
const rejectWith = (statusCode: number, details?: string) =>
  mockDispatch.mockReturnValue({
    unwrap: () => Promise.reject({ statusCode, details }),
  });

const executionResponse = (extra: Record<string, unknown> = {}) => ({
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
          suggested_citation: expect.stringMatching(
            /^IMOS \d{4}, Test Ocean Data Collection, http:\/\/localhost:3000\/details\/collection-id\?tab=summary, accessed \d{2}-[A-Za-z]{3}-\d{4}$/
          ),
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

describe("useDownloadDialog per-user download limit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => vi.restoreAllMocks());

  it("reports a distinct message when the submit endpoint returns 429", async () => {
    rejectWith(429);
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);

    await waitFor(() => expect(result.current.processingStatus).toBe("429"));
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.createdJobID).toBeUndefined();
    expect(result.current.getProcessStatusText()).toBe(
      "You already have 10 downloads in progress. Please wait for one to finish before starting another."
    );
    // 429 keeps its old behaviour: no toast, retry allowed.
    expect(result.current.errorToastMessage).toBe("");
    expect(result.current.isDownloadBlocked).toBe(false);
  });

  it("still reports plain success when the request is accepted", async () => {
    respondWith(executionResponse());
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.getProcessStatusText()).toBe(
      "Download email will be sent shortly."
    );
  });
});

describe("useDownloadDialog download size limit", () => {
  const SERVER_MESSAGE =
    "The selected data is too large to download (estimated 250.3 GB, limit 180 GB). Please reduce the date range or area and try again.";

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => vi.restoreAllMocks());

  it("shows the server message and blocks the download on 422", async () => {
    rejectWith(422, SERVER_MESSAGE);
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);

    await waitFor(() => expect(result.current.processingStatus).toBe("422"));
    expect(result.current.errorToastMessage).toBe(SERVER_MESSAGE);
    expect(result.current.isDownloadBlocked).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.createdJobID).toBeUndefined();
    expect(result.current.getProcessStatusText()).toBe(
      "Selected data is too large to download"
    );
  });

  it("uses a default message when the 422 reply has none", async () => {
    rejectWith(422);
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);

    await waitFor(() => expect(result.current.processingStatus).toBe("422"));
    expect(result.current.errorToastMessage).toBe(
      "The selected data is too large to download. Please reduce the date range or area and try again."
    );
  });

  it("hides the toast when it is closed", async () => {
    rejectWith(422, SERVER_MESSAGE);
    const { result } = renderHook(() => useDownloadDialog(true, vi.fn()));

    submit(result);

    await waitFor(() =>
      expect(result.current.errorToastMessage).toBe(SERVER_MESSAGE)
    );
    act(() => result.current.handleCloseErrorToast());
    expect(result.current.errorToastMessage).toBe("");
    // Closing the toast does not unblock the download.
    expect(result.current.isDownloadBlocked).toBe(true);
  });
});
