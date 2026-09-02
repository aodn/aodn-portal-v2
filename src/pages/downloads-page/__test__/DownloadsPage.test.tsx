import { fireEvent, render, screen, within } from "@testing-library/react";
import { rgbToHex } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { portalTheme } from "@/styles";
import DownloadsPage from "../DownloadsPage";

const mockUseDownloadStatus = vi.hoisted(() => vi.fn());
const mockUseBreakpoint = vi.hoisted(() => vi.fn());

vi.mock("../useDownloadStatus", () => ({
  default: mockUseDownloadStatus,
}));

vi.mock("@/hooks/useBreakpoint", () => ({
  default: mockUseBreakpoint,
}));

describe("DownloadsPage", () => {
  const retryDownload = vi.fn();
  const removeDownload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBreakpoint.mockReturnValue({ isUnderLaptop: false });
    mockUseDownloadStatus.mockReturnValue({
      downloads: [
        {
          jobID: "job-1",
          status: "running",
          message: "Download job is running",
          collection: "Test Ocean Data Collection",
          dataSelection: "imos-data/dataset.zarr",
          format: "netcdf",
          metadataUrl: "https://example.com/details/collection-id",
          started: "2026-08-25T01:20:05Z",
          lookupState: "available",
        },
      ],
      retryDownload,
      removeDownload,
    });
  });

  it("renders the optional download description and metadata link", () => {
    renderPage();

    expect(screen.getByText("Test Ocean Data Collection")).toBeInTheDocument();
    expect(screen.getByText("imos-data/dataset.zarr")).toBeInTheDocument();
    expect(screen.getByText("NETCDF")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Open metadata for Test Ocean Data Collection",
      })
    ).toHaveAttribute("href", "https://example.com/details/collection-id");
  });

  const renderPage = () =>
    render(
      <ThemeProvider theme={createTheme()}>
        <DownloadsPage />
      </ThemeProvider>
    );

  it("renders a simple table without a spinner while running", () => {
    renderPage();

    expect(
      screen.getByRole("table", { name: "Download status" })
    ).toBeInTheDocument();
    expect(screen.getByText("job-1")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders download cards on mobile and tablet widths", () => {
    mockUseBreakpoint.mockReturnValue({ isUnderLaptop: true });
    renderPage();

    expect(
      screen.queryByRole("table", { name: "Download status" })
    ).not.toBeInTheDocument();

    const list = screen.getByRole("list", { name: "Download status" });
    const card = within(list).getByRole("listitem");

    expect(card).toHaveTextContent("job-1");
    expect(card).toHaveTextContent("In progress");
    expect(card).toHaveTextContent("Test Ocean Data Collection");
    expect(card).toHaveTextContent("imos-data/dataset.zarr");
    expect(card).toHaveTextContent("NETCDF");
    expect(within(card).getByRole("button", { name: "Remove" })).toBeVisible();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it.each([
    ["successful", "Completed", portalTheme.palette.success.main],
    ["running", "In progress", portalTheme.palette.info.main],
    ["accepted", "Queued", portalTheme.palette.warning.main],
    ["failed", "Failed", portalTheme.palette.error.main],
  ])("renders %s as a styled %s pill", (status, label, expectedColor) => {
    mockUseDownloadStatus.mockReturnValue({
      downloads: [
        {
          jobID: "job-1",
          status,
          lookupState: "available",
        },
      ],
      retryDownload,
      removeDownload,
    });
    renderPage();

    const pill = screen.getByTestId("download-status-pill");
    const dot = screen.getByTestId("download-status-dot");
    expect(pill).toHaveTextContent(label);
    expect(rgbToHex(getComputedStyle(dot).backgroundColor)).toBe(
      expectedColor.toLowerCase()
    );
    expect(getComputedStyle(pill).borderRadius).toBe("999px");
    expect(getComputedStyle(pill).fontWeight).toBe("600");
  });

  it("uses the compact table styling from the download tasks design", () => {
    renderPage();

    const jobHeader = screen.getByRole("columnheader", { name: "Job ID" });
    const jobID = screen.getByText("job-1");

    expect(rgbToHex(getComputedStyle(jobHeader).backgroundColor)).toBe(
      portalTheme.palette.primary6.toLowerCase()
    );
    expect(getComputedStyle(jobHeader).textTransform).toBe("uppercase");
    expect(rgbToHex(getComputedStyle(jobID).color)).toBe(
      portalTheme.palette.primary1.toLowerCase()
    );
  });

  it("calculates duration from started and finished for a completed job", () => {
    mockUseDownloadStatus.mockReturnValue({
      downloads: [
        {
          jobID: "job-1",
          status: "successful",
          started: "2026-08-25T01:20:05Z",
          finished: "2026-08-25T01:21:10Z",
          lookupState: "available",
        },
      ],
      retryDownload,
      removeDownload,
    });
    renderPage();

    expect(screen.getByText("1m 5s")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("offers retry only for polling errors and can remove the row", () => {
    mockUseDownloadStatus.mockReturnValue({
      downloads: [
        {
          jobID: "job-1",
          status: "running",
          pollingError: "Unable to retrieve download status. Please try again.",
          lookupState: "error",
        },
      ],
      retryDownload,
      removeDownload,
    });
    renderPage();

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(retryDownload).toHaveBeenCalledWith("job-1");
    expect(removeDownload).toHaveBeenCalledWith("job-1");
  });
});
