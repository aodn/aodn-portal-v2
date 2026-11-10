import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Map } from "mapbox-gl";
import DateRange from "@/components/map/mapbox/controls/menu/DateRange";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "@/pages/detail-page/context/DownloadDefinitions";

vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => ({ isMobile: true }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("DateRange on mobile", () => {
  it("accepts exact calendar dates and prevents an inverted range", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
    const container = document.createElement("div");
    document.body.appendChild(container);
    const update = vi.fn(() => []);
    render(
      <DateRange
        map={{ getContainer: () => container } as unknown as Map}
        minDate="2025-06-01"
        maxDate="2025-06-30"
        downloadConditions={[]}
        getAndSetDownloadConditions={update}
      />
    );
    fireEvent.click(screen.getByTestId("daterange-show-hide-menu-button"));

    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Start date")).toHaveValue("01 Jun 2025");
    expect(screen.getByLabelText("End date")).toHaveValue("30 Jun 2025");

    fireEvent.click(screen.getByLabelText("Start date"));
    fireEvent.click(screen.getByRole("gridcell", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "OK" }));

    expect(update).toHaveBeenCalledWith(DownloadConditionType.DATE_RANGE, [
      expect.objectContaining<Partial<DateRangeCondition>>({
        start: "2025-06-02",
        end: "2025-06-30",
      }),
    ]);
    expect(screen.getByLabelText("Start date")).toHaveValue("02 Jun 2025");

    fireEvent.click(screen.getByLabelText("End date"));
    expect(screen.getByRole("gridcell", { name: "1" })).toBeDisabled();
    fireEvent.click(screen.getByRole("gridcell", { name: "29" }));
    fireEvent.click(screen.getByRole("button", { name: "OK" }));

    expect(update).toHaveBeenLastCalledWith(DownloadConditionType.DATE_RANGE, [
      expect.objectContaining<Partial<DateRangeCondition>>({
        start: "2025-06-02",
        end: "2025-06-29",
      }),
    ]);
    expect(screen.getByLabelText("End date")).toHaveValue("29 Jun 2025");
  }, 20000);
});
