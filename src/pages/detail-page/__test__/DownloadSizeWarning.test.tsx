import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DownloadSizeWarning, {
  hasDownloadSizeWarning,
  LARGE_DOWNLOAD_BYTES,
  VERY_LARGE_DOWNLOAD_BYTES,
} from "../features/download/DownloadSizeWarning";

const WARNING_TEST_ID = "download-size-warning";

// Assertions target the data-warning-level attribute rather than the message
// copy, which is a first-pass wording still to be reviewed by the designer
const expectWarningLevel = (level: string) =>
  expect(screen.getByTestId(WARNING_TEST_ID)).toHaveAttribute(
    "data-warning-level",
    level
  );

describe("DownloadSizeWarning", () => {
  it("should render nothing before any estimate has arrived", () => {
    render(<DownloadSizeWarning />);

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should render nothing while an estimate is in flight", () => {
    render(<DownloadSizeWarning isEstimating estimatedSizeBytes={null} />);

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should render nothing when the estimate is under the large threshold", () => {
    render(
      <DownloadSizeWarning estimatedSizeBytes={LARGE_DOWNLOAD_BYTES - 1} />
    );

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should warn at the large threshold", () => {
    render(<DownloadSizeWarning estimatedSizeBytes={LARGE_DOWNLOAD_BYTES} />);

    expectWarningLevel("large");
  });

  it("should warn at the very large threshold", () => {
    render(
      <DownloadSizeWarning estimatedSizeBytes={VERY_LARGE_DOWNLOAD_BYTES} />
    );

    expectWarningLevel("very-large");
  });

  it("should warn when the estimate failed", () => {
    render(<DownloadSizeWarning estimateFailed />);

    expectWarningLevel("estimate-failed");
  });

  it("should clear a previous warning once a re-estimate starts", () => {
    const { rerender } = render(
      <DownloadSizeWarning estimatedSizeBytes={VERY_LARGE_DOWNLOAD_BYTES} />
    );

    expectWarningLevel("very-large");

    // The card resets the size and flips to estimating on every re-estimate
    rerender(<DownloadSizeWarning isEstimating estimatedSizeBytes={null} />);

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should stop warning when a re-estimate comes back smaller", () => {
    const { rerender } = render(
      <DownloadSizeWarning estimatedSizeBytes={VERY_LARGE_DOWNLOAD_BYTES} />
    );

    expectWarningLevel("very-large");

    rerender(
      <DownloadSizeWarning estimatedSizeBytes={LARGE_DOWNLOAD_BYTES - 1} />
    );

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });
});

describe("hasDownloadSizeWarning", () => {
  it("should report a warning for large, very large, and failed estimates", () => {
    expect(
      hasDownloadSizeWarning({ estimatedSizeBytes: LARGE_DOWNLOAD_BYTES })
    ).toBe(true);
    expect(
      hasDownloadSizeWarning({ estimatedSizeBytes: VERY_LARGE_DOWNLOAD_BYTES })
    ).toBe(true);
    expect(hasDownloadSizeWarning({ estimateFailed: true })).toBe(true);
  });

  it("should report no warning while estimating or when the estimate is small", () => {
    expect(hasDownloadSizeWarning({})).toBe(false);
    expect(
      hasDownloadSizeWarning({ estimatedSizeBytes: LARGE_DOWNLOAD_BYTES - 1 })
    ).toBe(false);
    expect(
      hasDownloadSizeWarning({
        isEstimating: true,
        estimatedSizeBytes: VERY_LARGE_DOWNLOAD_BYTES,
      })
    ).toBe(false);
  });
});
