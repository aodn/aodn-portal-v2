import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import DownloadSizeWarning, {
  hasDownloadSizeWarning,
  isDownloadBlocked,
} from "../features/download/DownloadSizeWarning";
import {
  LARGE_DOWNLOAD_BYTES,
  EXTRA_LARGE_DOWNLOAD_BYTES,
} from "../features/download/constants";

const WARNING_TEST_ID = "download-size-warning";
const DATA_ACCESS_LINK_TEST_ID = "download-size-warning-data-access-link";
const TEST_UUID = "test-uuid";

// Assertions target the data-warning-level attribute rather than the message
// copy, which is a first-pass wording still to be reviewed by the designer
const expectWarningLevel = (level: string) =>
  expect(screen.getByTestId(WARNING_TEST_ID)).toHaveAttribute(
    "data-warning-level",
    level
  );

type WarningProps = Parameters<typeof DownloadSizeWarning>[0];

// Navigating to the Data Access tab only changes the query string, so the
// route stays the same — this exposes the current location for assertions
const LocationProbe = () => {
  const { pathname, search } = useLocation();
  return <div data-testid="location">{`${pathname}${search}`}</div>;
};

const warningTree = (props: WarningProps) => (
  <MemoryRouter initialEntries={[`/details/${TEST_UUID}`]}>
    <LocationProbe />
    <Routes>
      <Route
        path="/details/:uuid"
        element={<DownloadSizeWarning {...props} />}
      />
    </Routes>
  </MemoryRouter>
);

const renderWarning = (props: WarningProps = {}) => {
  const { rerender } = render(warningTree(props));
  return {
    // Re-render the whole tree so the router state is kept between estimates
    rerenderWith: (next: WarningProps) => rerender(warningTree(next)),
  };
};

describe("DownloadSizeWarning", () => {
  it("should render nothing before any estimate has arrived", () => {
    renderWarning();

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should render nothing while an estimate is in flight", () => {
    renderWarning({ isEstimating: true, estimatedSizeBytes: null });

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should render nothing when the estimate is under the large threshold", () => {
    renderWarning({ estimatedSizeBytes: LARGE_DOWNLOAD_BYTES - 1 });

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should warn at the large threshold", () => {
    renderWarning({ estimatedSizeBytes: LARGE_DOWNLOAD_BYTES });

    expectWarningLevel("large");
    expect(
      screen.queryByTestId(DATA_ACCESS_LINK_TEST_ID)
    ).not.toBeInTheDocument();
  });

  it("should warn at the extra large threshold", () => {
    renderWarning({ estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES });

    expectWarningLevel("extra-large");
  });

  it("should warn when the estimate failed", () => {
    renderWarning({ estimateFailed: true });

    expectWarningLevel("estimate-failed");
    expect(
      screen.queryByTestId(DATA_ACCESS_LINK_TEST_ID)
    ).not.toBeInTheDocument();
  });

  it("should offer a data access link only for a extra large download", () => {
    renderWarning({ estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES });

    expect(screen.getByTestId(DATA_ACCESS_LINK_TEST_ID)).toBeInTheDocument();
  });

  it("should navigate to the data access tab when the link is clicked", () => {
    renderWarning({ estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES });

    expect(screen.getByTestId("location")).toHaveTextContent(
      `/details/${TEST_UUID}`
    );

    userEvent.click(screen.getByTestId(DATA_ACCESS_LINK_TEST_ID));

    return waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent(
        `/details/${TEST_UUID}?tab=data-access`
      );
    });
  });

  it("should clear a previous warning once a re-estimate starts", () => {
    const { rerenderWith } = renderWarning({
      estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES,
    });
    expectWarningLevel("extra-large");

    // The card resets the size and flips to estimating on every re-estimate
    rerenderWith({ isEstimating: true, estimatedSizeBytes: null });

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });

  it("should downgrade a blocking warning to advisory when a re-estimate comes back smaller", () => {
    const { rerenderWith } = renderWarning({
      estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES,
    });
    expectWarningLevel("extra-large");

    rerenderWith({ estimatedSizeBytes: LARGE_DOWNLOAD_BYTES });

    expectWarningLevel("large");
    expect(
      screen.queryByTestId(DATA_ACCESS_LINK_TEST_ID)
    ).not.toBeInTheDocument();
  });

  it("should stop warning entirely when a re-estimate comes back small", () => {
    const { rerenderWith } = renderWarning({
      estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES,
    });
    expectWarningLevel("extra-large");

    rerenderWith({ estimatedSizeBytes: LARGE_DOWNLOAD_BYTES - 1 });

    expect(screen.queryByTestId(WARNING_TEST_ID)).not.toBeInTheDocument();
  });
});

describe("hasDownloadSizeWarning", () => {
  it("should report a warning for large, extra large, and failed estimates", () => {
    expect(
      hasDownloadSizeWarning({ estimatedSizeBytes: LARGE_DOWNLOAD_BYTES })
    ).toBe(true);
    expect(
      hasDownloadSizeWarning({ estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES })
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
        estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES,
      })
    ).toBe(false);
  });
});

describe("isDownloadBlocked", () => {
  it("should block only at or above the extra large threshold", () => {
    expect(
      isDownloadBlocked({ estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES })
    ).toBe(true);
    expect(
      isDownloadBlocked({ estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES - 1 })
    ).toBe(false);
  });

  it("should not block a large or failed estimate", () => {
    expect(
      isDownloadBlocked({ estimatedSizeBytes: LARGE_DOWNLOAD_BYTES })
    ).toBe(false);
    expect(isDownloadBlocked({ estimateFailed: true })).toBe(false);
    expect(isDownloadBlocked({})).toBe(false);
  });

  it("should unblock once a re-estimate comes back under the threshold", () => {
    const blocked = { estimatedSizeBytes: EXTRA_LARGE_DOWNLOAD_BYTES };
    const subsetted = { estimatedSizeBytes: LARGE_DOWNLOAD_BYTES };

    expect(isDownloadBlocked(blocked)).toBe(true);
    expect(isDownloadBlocked(subsetted)).toBe(false);
    expect(hasDownloadSizeWarning(subsetted)).toBe(true);
  });
});
