import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

describe("useDownloadDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockDispatch.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          message: { message: "Job submitted" },
          status: { message: "200" },
          jobID: "123e4567-e89b-12d3-a456-426614174000",
        }),
    });
  });

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
  });
});
