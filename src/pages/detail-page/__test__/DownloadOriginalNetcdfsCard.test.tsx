import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";

vi.mock("@/pages/detail-page/features/download/DownloadSelect", () => ({
  default: ({ label, items, value }: any) => (
    <select
      data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}
      value={value}
      onChange={() => {}}
    >
      {items?.map((item: any) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  ),
}));

// The subsetting panel reads the page context, not needed here
vi.mock("@/pages/detail-page/features/download/DownloadSubsetting", () => ({
  default: () => <div data-testid="download-subsetting" />,
}));

vi.mock(
  "@/pages/detail-page/features/download/download-dialog/DownloadDialog",
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div data-testid="download-dialog" /> : null,
  })
);

import DownloadOriginalNetcdfsCard from "@/pages/detail-page/features/download/DownloadOriginalNetcdfsCard";
import {
  DownloadConditionType,
  FormatCondition,
  KeyCondition,
} from "@/pages/detail-page/context/DownloadDefinitions";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";

const createCollection = (): OGCCollection => {
  const collection = new OGCCollection();
  collection.links = [
    {
      href: "http://localhost:8080/api/v1/ogc/original_netcdfs",
      rel: "file-list",
      type: "application/x-netcdf",
      title: "original_netcdfs",
    },
  ];
  return collection;
};

describe("DownloadOriginalNetcdfsCard", () => {
  const mockGetAndSetDownloadConditions = vi.fn();

  const renderCard = () =>
    render(
      <ThemeProvider theme={createTheme()}>
        <DownloadOriginalNetcdfsCard
          collection={createCollection()}
          downloadConditions={[]}
          getAndSetDownloadConditions={mockGetAndSetDownloadConditions}
          removeDownloadCondition={vi.fn()}
        />
      </ThemeProvider>
    );

  const getOptions = (testId: string) =>
    Array.from(screen.getByTestId(testId).querySelectorAll("option"));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows one data option named List of NetCDF and CSV as the only format", () => {
    renderCard();

    const dataOptions = getOptions("select-data-selection");
    expect(dataOptions).toHaveLength(1);
    expect(dataOptions[0].value).toBe("original_netcdfs");
    expect(dataOptions[0].textContent).toBe("List of NetCDF");

    const formatOptions = getOptions("select-format-selection");
    expect(formatOptions).toHaveLength(1);
    expect(formatOptions[0].value).toBe("csv");
  });

  it("sets the key and csv format conditions on mount", () => {
    renderCard();

    expect(mockGetAndSetDownloadConditions).toHaveBeenCalledWith(
      DownloadConditionType.KEY,
      [new KeyCondition("key", "original_netcdfs")]
    );
    expect(mockGetAndSetDownloadConditions).toHaveBeenCalledWith(
      DownloadConditionType.FORMAT,
      [new FormatCondition("format", "csv")]
    );
  });

  it("opens the download dialog when download is clicked", () => {
    renderCard();
    expect(screen.queryByTestId("download-dialog")).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId("download-button"));

    return waitFor(() => screen.findByTestId("download-dialog"));
  });
});
