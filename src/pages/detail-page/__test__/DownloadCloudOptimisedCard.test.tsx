import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";

beforeAll(() => {
  window.scrollTo = vi.fn();
});

vi.mock(
  "../subpages/side-cards/download-card/components/DownloadSelect",
  () => ({
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
  })
);

import DownloadCloudOptimisedCard from "../subpages/side-cards/download-card/components/DownloadCloudOptimisedCard";
import {
  DatasetType,
  OGCCollection,
} from "../../../components/common/store/OGCCollectionDefinitions";
import store from "../../../components/common/store/store";

const theme = createTheme();

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
    getDatasetType: () => datasetType,
  } as unknown as OGCCollection;
};

describe("DownloadCloudOptimisedCard", () => {
  const mockGetAndSetDownloadConditions = vi.fn();
  const mockRemoveDownloadCondition = vi.fn();
  const mockSetSelectedCoKey = vi.fn();

  const findDataSelect = (container: HTMLElement): HTMLSelectElement | null => {
    const selectElements = container.querySelectorAll("select");
    for (const select of Array.from(selectElements)) {
      const parent = select.closest("div");
      if (parent?.textContent?.includes("Data Selection")) {
        return select as HTMLSelectElement;
      }
    }
    return null;
  };

  const renderComponent = (
    collection: OGCCollection = createMockCollection(DatasetType.ZARR),
    downloadConditions: any[] = [],
    selectedCoKey?: string
  ) => {
    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DownloadCloudOptimisedCard
            collection={collection}
            downloadConditions={downloadConditions}
            getAndSetDownloadConditions={mockGetAndSetDownloadConditions}
            removeDownloadCondition={mockRemoveDownloadCondition}
            selectedCoKey={selectedCoKey}
            setSelectedCoKey={mockSetSelectedCoKey}
          />
        </ThemeProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with format selection and data selection dropdowns", () => {
    renderComponent();

    expect(screen.getByText("Format Selection")).toBeInTheDocument();
    expect(screen.getByText("Data Selection")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should display correct data selection options with labels without extensions", async () => {
    const { container } = renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Data Selection")).toBeInTheDocument();
    });

    const dataSelect = findDataSelect(container);
    expect(dataSelect).not.toBeNull();

    if (dataSelect) {
      const options = dataSelect.querySelectorAll("option");
      expect(options).toHaveLength(2);
      expect(options[0].textContent).toBe("test-zarr");
      expect(options[1].textContent).toBe("test-parquet");
      expect(options[0].value).toBe("test-zarr.zarr");
      expect(options[1].value).toBe("test-parquet.parquet");
    }
  });

  it("should change data selection value when user selects different option", async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Data Selection")).toBeInTheDocument();
    });

    const dataSelect = findDataSelect(container);
    expect(dataSelect).not.toBeNull();

    if (dataSelect) {
      // the default value should be the first option
      expect(dataSelect.value).toBe("test-zarr.zarr");

      // change selection
      await user.selectOptions(dataSelect, "test-parquet.parquet");

      // the expected value should changed to the selected option
      await waitFor(() => {
        expect(dataSelect.value).toBe("test-parquet.parquet");
      });

      expect(mockSetSelectedCoKey).toHaveBeenCalledWith("test-parquet.parquet");
    }
  });

  it("should sync selectedCoKey from map to data selection on mount", async () => {
    const { container } = renderComponent(
      createMockCollection(DatasetType.ZARR),
      [],
      "test-parquet.parquet"
    );

    await waitFor(() => {
      expect(screen.getByText("Data Selection")).toBeInTheDocument();
    });

    const dataSelect = findDataSelect(container);
    expect(dataSelect).not.toBeNull();

    if (dataSelect) {
      await waitFor(() => {
        expect(dataSelect.value).toBe("test-parquet.parquet");
      });

      expect(mockGetAndSetDownloadConditions).toHaveBeenCalled();
    }
  });

  it("should call setSelectedCoKey when user changes data selection", async () => {
    const user = userEvent.setup();
    const { container } = renderComponent(
      createMockCollection(DatasetType.ZARR),
      [],
      "test-zarr.zarr"
    );

    await waitFor(() => {
      expect(screen.getByText("Data Selection")).toBeInTheDocument();
    });

    const dataSelect = findDataSelect(container);
    expect(dataSelect).not.toBeNull();

    if (dataSelect) {
      vi.clearAllMocks();

      await user.selectOptions(dataSelect, "test-parquet.parquet");

      await waitFor(() => {
        expect(mockSetSelectedCoKey).toHaveBeenCalledWith(
          "test-parquet.parquet"
        );
      });

      expect(dataSelect.value).toBe("test-parquet.parquet");
    }
  });
});
