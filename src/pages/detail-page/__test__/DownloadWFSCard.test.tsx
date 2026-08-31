import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppLocalizationProvider } from "@/app/providers/AppLocalizationProvider";

beforeAll(() => {
  window.scrollTo = vi.fn();
});

// Same stub as DownloadCloudOptimisedCard.test.tsx so the two card tests query
// their dropdowns the same way
vi.mock("../features/download/DownloadSelect", () => ({
  default: ({ label, items, value, onSelectCallback }: any) => (
    <div>
      <label>{label}</label>
      <select
        data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}
        value={value || (items && items[0]?.value)}
        onChange={(e) => onSelectCallback?.(e.target.value)}
      >
        {items?.map((item: any) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

// Stubbed out to keep the card isolated from the subsetting tree, and to expose
// hideInfoMessage (which the size warning suppresses) as an assertable attribute
vi.mock("../features/download/DownloadSubsetting", () => ({
  default: ({ hideInfoMessage }: any) => (
    <div
      data-testid="download-subsetting"
      data-hide-info-message={String(!!hideInfoMessage)}
    />
  ),
}));

vi.mock("@/hooks/useWFSDownload", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return { ...actual, default: vi.fn() };
});

vi.mock("@/hooks/useEstimateSize", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return { ...actual, default: vi.fn() };
});

vi.mock("@/app/store/hooks", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return { ...actual, useAppDispatch: vi.fn() };
});

import DownloadWFSCard from "../features/download/DownloadWFSCard";
import useWFSDownload from "@/hooks/useWFSDownload";
import useEstimateSize from "@/hooks/useEstimateSize";
import { useAppDispatch } from "@/app/store/hooks";
import store from "@/app/store/store";
import {
  LARGE_DOWNLOAD_BYTES,
  EXTRA_LARGE_DOWNLOAD_BYTES,
} from "../features/download/constants";
import { DownloadSizeWarningLevel } from "../features/download/DownloadSizeWarning";

const theme = createTheme();
const TEST_UUID = "test-uuid";

const WARNING_TEST_ID = "download-size-warning";
const DOWNLOAD_BUTTON_TEST_ID = "download-button";

const mockLayers = [
  { name: "layer-one", title: "Layer One" },
  { name: "layer-two", title: "Layer Two" },
];

// Kept stable across renders: both are in the effect dependency arrays of the
// card, so fresh mocks each render would re-trigger fetch/estimate endlessly
const mockStartDownload = vi.fn();
const mockCancelDownload = vi.fn();
const mockEstimateSize = vi.fn();
const mockCancelEstimate = vi.fn();
const mockDispatch = vi.fn();
const mockOnWFSAvailabilityChange = vi.fn();
const mockGetAndSetDownloadConditions = vi.fn();
const mockRemoveDownloadCondition = vi.fn();

// Mutated per test to drive the download / estimate state the card reacts to
let downloadState: { isDownloading: boolean };
let estimateState: {
  isEstimating: boolean;
  estimatedSizeBytes: number | null;
  estimateFailed: boolean;
};

// Assertions target data-warning-level rather than the message copy, which is a
// first-pass wording still to be reviewed by the designer
const expectWarningLevel = (level: DownloadSizeWarningLevel) =>
  expect(screen.getByTestId(WARNING_TEST_ID)).toHaveAttribute(
    "data-warning-level",
    level
  );

const renderComponent = (uuid: string | undefined = TEST_UUID) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/details/${TEST_UUID}`]}>
        <ThemeProvider theme={theme}>
          <AppLocalizationProvider>
            <Routes>
              <Route
                path="/details/:uuid"
                element={
                  <DownloadWFSCard
                    uuid={uuid}
                    downloadConditions={[]}
                    getAndSetDownloadConditions={
                      mockGetAndSetDownloadConditions
                    }
                    removeDownloadCondition={mockRemoveDownloadCondition}
                    onWFSAvailabilityChange={mockOnWFSAvailabilityChange}
                  />
                }
              />
            </Routes>
          </AppLocalizationProvider>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );

describe("DownloadWFSCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    downloadState = { isDownloading: false };
    estimateState = {
      isEstimating: false,
      estimatedSizeBytes: null,
      estimateFailed: false,
    };

    mockDispatch.mockReturnValue({
      unwrap: () => Promise.resolve(mockLayers),
    });
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch as any);

    vi.mocked(useWFSDownload).mockImplementation(
      () =>
        ({
          downloadingStatus: "idle",
          downloadedBytes: 0,
          progressMessage: "",
          startDownload: mockStartDownload,
          cancelDownload: mockCancelDownload,
          isDownloading: downloadState.isDownloading,
        }) as any
    );

    vi.mocked(useEstimateSize).mockImplementation(
      () =>
        ({
          ...estimateState,
          estimateSize: mockEstimateSize,
          cancelEstimate: mockCancelEstimate,
        }) as any
    );
  });

  it("should render with format selection and data selection dropdowns", async () => {
    renderComponent();

    expect(screen.getByText("Format Selection")).toBeInTheDocument();
    expect(screen.getByText("Data Selection")).toBeInTheDocument();
    expect(screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnWFSAvailabilityChange).toHaveBeenCalledWith(true);
    });
  });

  it("should populate data selection from the fetched layers and preselect the first", async () => {
    renderComponent();

    const dataSelect = (await screen.findByTestId(
      "select-data-selection"
    )) as HTMLSelectElement;

    await waitFor(() => {
      expect(dataSelect.querySelectorAll("option")).toHaveLength(2);
    });

    const options = dataSelect.querySelectorAll("option");
    expect(options[0].textContent).toBe("Layer One");
    expect(options[1].textContent).toBe("Layer Two");
    expect(dataSelect.value).toBe("layer-one");
  });

  it("should report WFS as unavailable when no layers come back", async () => {
    mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve([]) });

    renderComponent();

    await waitFor(() => {
      expect(mockOnWFSAvailabilityChange).toHaveBeenCalledWith(false);
    });
  });

  it("should report WFS as unavailable when the layers fetch fails", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject(new Error("401 not whitelisted")),
    });

    renderComponent();

    await waitFor(() => {
      expect(mockOnWFSAvailabilityChange).toHaveBeenCalledWith(false);
    });
  });

  it("should show no warning and keep the download enabled for a small estimate", async () => {
    estimateState.estimatedSizeBytes = 1024;

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID)).toBeEnabled();
    });
    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should warn but keep the download enabled at the large threshold", async () => {
    estimateState.estimatedSizeBytes = LARGE_DOWNLOAD_BYTES;

    renderComponent();

    await waitFor(() => expectWarningLevel(DownloadSizeWarningLevel.LARGE));
    expect(screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID)).toBeEnabled();
  });

  it("should warn and disable the download at the extra large threshold", async () => {
    estimateState.estimatedSizeBytes = EXTRA_LARGE_DOWNLOAD_BYTES;

    renderComponent();

    await waitFor(() =>
      expectWarningLevel(DownloadSizeWarningLevel.EXTRA_LARGE)
    );
    expect(screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID)).toBeDisabled();
  });

  it("should warn but keep the download enabled when the estimate failed", async () => {
    estimateState.estimateFailed = true;

    renderComponent();

    await waitFor(() =>
      expectWarningLevel(DownloadSizeWarningLevel.ESTIMATE_FAILED)
    );
    expect(screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID)).toBeEnabled();
  });

  it("should hide the warning while a download is in progress", async () => {
    estimateState.estimatedSizeBytes = EXTRA_LARGE_DOWNLOAD_BYTES;
    downloadState.isDownloading = true;

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("download-subsetting")).toBeInTheDocument();
    });
    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should hide the subsetting info message while a size warning is showing", async () => {
    estimateState.estimatedSizeBytes = LARGE_DOWNLOAD_BYTES;

    renderComponent();

    await waitFor(() => expectWarningLevel(DownloadSizeWarningLevel.LARGE));
    expect(screen.getByTestId("download-subsetting")).toHaveAttribute(
      "data-hide-info-message",
      "true"
    );
  });

  it("should keep the subsetting info message when there is no size warning", async () => {
    estimateState.estimatedSizeBytes = 1024;

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("download-subsetting")).toHaveAttribute(
        "data-hide-info-message",
        "false"
      );
    });
  });
});
