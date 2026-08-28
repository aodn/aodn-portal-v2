import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppLocalizationProvider } from "@/app/providers/AppLocalizationProvider";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

beforeAll(() => {
  window.scrollTo = vi.fn();
});

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

vi.mock("@/hooks/useEstimateSize", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return { ...actual, default: vi.fn() };
});

import DownloadCloudOptimisedCard from "../features/download/DownloadCloudOptimisedCard";
import {
  DatasetType,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";
import store from "@/app/store/store";
import useEstimateSize from "@/hooks/useEstimateSize";
import {
  LARGE_DOWNLOAD_BYTES,
  EXTRA_LARGE_DOWNLOAD_BYTES,
} from "../features/download/constants";
import { DownloadSizeWarningLevel } from "../features/download/DownloadSizeWarning";

const theme = createTheme();

const WARNING_TEST_ID = "download-size-warning";
const DOWNLOAD_BUTTON_TEST_ID = "download-button";
const SUBSETTING_INFO_TEXT =
  "To download data directly please use the selections below, or utilise the map tools to make your selection.";

// Assertions target data-warning-level rather than the message copy, which is a
// first-pass wording still to be reviewed by the designer
const expectWarningLevel = (level: DownloadSizeWarningLevel) =>
  expect(screen.getByTestId(WARNING_TEST_ID)).toHaveAttribute(
    "data-warning-level",
    level
  );

const createMockCollection = (datasetType: DatasetType): OGCCollection => {
  return {
    id: "test-collection-id",
    title: "Test Collection",
    description: "Test Description",
    links: [
      {
        rel: "summary",
        href: "http://example.com/test-zarr.zarr",
        title: "test-zarr.zarr",
        type: "application/x-zarr",
      },
      {
        rel: "summary",
        href: "http://example.com/test-parquet.parquet",
        title: "test-parquet.parquet",
        type: "application/x-parquet",
      },
    ],
    getDatasetType: () => [datasetType],
    getAllCOKeys: () => ["test-zarr.zarr", "test-parquet.parquet"],
    getDatasetTypeByKey: (key: string) =>
      key.endsWith(".parquet")
        ? DatasetType.PARQUET
        : key.endsWith(".zarr")
          ? DatasetType.ZARR
          : undefined,
    getExtent: () => ({
      getOverallTemporal: () => ["2020-01-01", "2024-12-31"],
    }),
  } as unknown as OGCCollection;
};

describe("DownloadCloudOptimisedCard", () => {
  const mockGetAndSetDownloadConditions = vi.fn();
  const mockRemoveDownloadCondition = vi.fn();
  const mockSetSelectedCoKey = vi.fn();

  // Kept stable across renders: both sit in the card's estimate effect
  // dependency array, so fresh mocks each render would re-estimate endlessly
  const mockEstimateSize = vi.fn();
  const mockCancelEstimate = vi.fn();

  // Mutated per test to drive the estimate state the card reacts to
  let estimateState: {
    isEstimating: boolean;
    estimatedSizeBytes: number | null;
    estimateFailed: boolean;
  };

  const getDataSelect = () => {
    return screen.getByTestId("select-data-selection") as HTMLSelectElement;
  };

  const renderComponent = (
    collection: OGCCollection = createMockCollection(DatasetType.ZARR),
    downloadConditions: any[] = [],
    selectedCoKey?: string,
    setSelectedCoKey = mockSetSelectedCoKey
  ) => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/details/test-uuid"]}>
          <ThemeProvider theme={theme}>
            <AppLocalizationProvider>
              <DownloadCloudOptimisedCard
                collection={collection}
                downloadConditions={downloadConditions}
                getAndSetDownloadConditions={mockGetAndSetDownloadConditions}
                removeDownloadCondition={mockRemoveDownloadCondition}
                selectedCoKey={selectedCoKey}
                setSelectedCoKey={setSelectedCoKey}
              />
            </AppLocalizationProvider>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    estimateState = {
      isEstimating: false,
      estimatedSizeBytes: null,
      estimateFailed: false,
    };

    vi.mocked(useEstimateSize).mockImplementation(
      () =>
        ({
          ...estimateState,
          estimateSize: mockEstimateSize,
          cancelEstimate: mockCancelEstimate,
        }) as any
    );
  });

  it("should render with format selection and data selection dropdowns", () => {
    renderComponent();

    expect(screen.getByText("Format Selection")).toBeInTheDocument();
    expect(screen.getByText("Data Selection")).toBeInTheDocument();
    expect(screen.getByTestId("download-button")).toBeInTheDocument();
  });

  it("should display correct data selection options with labels without extensions", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Data Selection")).toBeInTheDocument();
    });

    const dataSelect = getDataSelect();
    const options = dataSelect.querySelectorAll("option");

    expect(options).toHaveLength(2);
    expect(options[0].textContent).toBe("test-zarr");
    expect(options[1].textContent).toBe("test-parquet");
    expect(options[0].value).toBe("test-zarr.zarr");
    expect(options[1].value).toBe("test-parquet.parquet");
  });

  it("should change data selection value when user selects different option", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Data Selection")).toBeInTheDocument();
    });

    const dataSelect = getDataSelect();
    expect(dataSelect.value).toBe("test-zarr.zarr");

    await user.selectOptions(dataSelect, "test-parquet.parquet");

    await waitFor(() => {
      expect(getDataSelect().value).toBe("test-parquet.parquet");
    });
  });

  it("should sync selectedCoKey from context to dropdown on mount", async () => {
    renderComponent(
      createMockCollection(DatasetType.ZARR),
      [],
      "test-parquet.parquet"
    );

    await waitFor(() => {
      expect(getDataSelect().value).toBe("test-parquet.parquet");
    });
  });

  it("should sync different selectedCoKey values on separate mounts", async () => {
    const { unmount: unmount1 } = renderComponent(
      createMockCollection(DatasetType.ZARR),
      [],
      "test-zarr.zarr"
    );

    await waitFor(() => {
      expect(getDataSelect().value).toBe("test-zarr.zarr");
    });

    unmount1();

    const { unmount: unmount2 } = renderComponent(
      createMockCollection(DatasetType.ZARR),
      [],
      "test-parquet.parquet"
    );

    await waitFor(() => {
      expect(getDataSelect().value).toBe("test-parquet.parquet");
    });

    unmount2();
  });

  it("should call setSelectedCoKey when user changes selection", async () => {
    const user = userEvent.setup();
    renderComponent(
      createMockCollection(DatasetType.ZARR),
      [],
      "test-zarr.zarr"
    );

    await waitFor(() => {
      expect(screen.getByText("Data Selection")).toBeInTheDocument();
    });

    vi.clearAllMocks();

    const dataSelect = getDataSelect();
    await user.selectOptions(dataSelect, "test-parquet.parquet");

    await waitFor(() => {
      expect(mockSetSelectedCoKey).toHaveBeenCalledWith("test-parquet.parquet");
    });
  });

  it("should not update dropdown when selectedCoKey doesn't match any option", async () => {
    renderComponent(
      createMockCollection(DatasetType.ZARR),
      [],
      "non-existent-key.zarr"
    );

    await waitFor(() => {
      expect(screen.getByText("Data Selection")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getDataSelect().value).toBe("test-zarr.zarr");
    });
  });

  it("should work without setSelectedCoKey callback", async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/details/test-uuid"]}>
          <ThemeProvider theme={theme}>
            <AppLocalizationProvider>
              <DownloadCloudOptimisedCard
                collection={createMockCollection(DatasetType.ZARR)}
                downloadConditions={[]}
                getAndSetDownloadConditions={mockGetAndSetDownloadConditions}
                removeDownloadCondition={mockRemoveDownloadCondition}
              />
            </AppLocalizationProvider>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Data Selection")).toBeInTheDocument();
    });

    const dataSelect = getDataSelect();

    await expect(async () => {
      await user.selectOptions(dataSelect, "test-parquet.parquet");
    }).not.toThrow();

    await waitFor(() => {
      expect(getDataSelect().value).toBe("test-parquet.parquet");
    });
  });

  describe("download size warning", () => {
    it("should show no warning and keep the download enabled for a small estimate", async () => {
      estimateState.estimatedSizeBytes = 1024;

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID)).toBeEnabled();
      });
      expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
    });

    it("should show no warning while an estimate is in flight", async () => {
      estimateState.isEstimating = true;

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

    it("should hide the subsetting info message while a size warning is showing", async () => {
      estimateState.estimatedSizeBytes = LARGE_DOWNLOAD_BYTES;

      renderComponent();

      await waitFor(() => expectWarningLevel(DownloadSizeWarningLevel.LARGE));
      expect(screen.queryByText(SUBSETTING_INFO_TEXT)).not.toBeInTheDocument();
    });

    it("should keep the subsetting info message when there is no size warning", async () => {
      estimateState.estimatedSizeBytes = 1024;

      renderComponent();

      expect(await screen.findByText(SUBSETTING_INFO_TEXT)).toBeInTheDocument();
    });

    it("should open the download dialog when the estimate is not blocking", () => {
      estimateState.estimatedSizeBytes = LARGE_DOWNLOAD_BYTES;

      renderComponent();

      userEvent.click(screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID));

      return waitFor(() => screen.findByTestId("download-dialog"));
    });

    it("should not open the download dialog when the download is blocked", () => {
      estimateState.estimatedSizeBytes = EXTRA_LARGE_DOWNLOAD_BYTES;

      // pointerEventsCheck is skipped because the disabled button intentionally
      // keeps `pointer-events: auto` so its tooltip stays hoverable
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      renderComponent();

      user.click(screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID));

      return waitFor(() => {
        expect(screen.queryByTestId("download-dialog")).not.toBeInTheDocument();
      });
    });
  });
});
