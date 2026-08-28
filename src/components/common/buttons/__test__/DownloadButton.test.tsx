import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import DownloadButton from "../DownloadButton";

describe("DownloadButton", () => {
  const mockOnDownload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is enabled by default when disabled prop is not provided", () => {
    render(<DownloadButton onDownload={mockOnDownload} />);

    expect(screen.getByTestId("download-button")).toBeEnabled();
  });

  it("renders a disabled button when disabled is true", () => {
    render(<DownloadButton onDownload={mockOnDownload} disabled />);

    expect(screen.getByTestId("download-button")).toBeDisabled();
  });

  it("does not call onDownload when clicked while disabled", () => {
    // pointerEventsCheck is skipped because the disabled button intentionally
    // keeps `pointer-events: auto` so its tooltip stays hoverable
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<DownloadButton onDownload={mockOnDownload} disabled />);

    user.click(screen.getByTestId("download-button"));

    return waitFor(() => {
      expect(mockOnDownload).not.toHaveBeenCalled();
    });
  });

  it("calls onDownload when clicked while not disabled", () => {
    render(<DownloadButton onDownload={mockOnDownload} disabled={false} />);

    userEvent.click(screen.getByTestId("download-button"));

    return waitFor(() => {
      expect(mockOnDownload).toHaveBeenCalledTimes(1);
    });
  });

  it("shows the subset tooltip when disabled", () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<DownloadButton onDownload={mockOnDownload} disabled />);

    user.hover(screen.getByText("Download"));

    return waitFor(() =>
      screen.findByText(
        "This download is too large — please subset your selection to enable it"
      )
    );
  });

  it("shows the disabled tooltip even when a size estimate is available", () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(
      <DownloadButton
        onDownload={mockOnDownload}
        disabled
        estimatedSizeBytes={1024}
      />
    );

    user.hover(screen.getByText("Download"));

    return waitFor(() =>
      screen.findByText(
        "This download is too large — please subset your selection to enable it"
      )
    ).then(() => {
      expect(screen.queryByText(/Download data is approximately/)).toBeNull();
    });
  });
});
