import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import AdvanceFilters from "../AdvanceFilters";

vi.mock("../RemovableDateTimeFilter.tsx", () => ({
  default: () => <div>mockDateTime</div>,
}));
vi.mock("../DepthFilter.tsx", () => ({
  default: () => <div>mockDepth</div>,
}));
vi.mock("../CategoryVocabFilter.tsx", () => ({
  default: () => <div>mockCategory</div>,
}));
vi.mock("../DataDeliveryModeFilter.tsx", () => ({
  default: () => <div>mockDataDeliveryMode</div>,
}));
vi.mock("../ImosOnlySwitch.tsx", () => ({
  default: () => <div>mockIMosOnly</div>,
}));

const mockSetShowFilters = vi.fn();

describe("AdvanceFilters", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  describe("when showFilter is true", () => {
    it("should render dialog backdrop with a visible AdvanceFilter ", () => {
      render(
        <AdvanceFilters
          showFilters={true}
          setShowFilters={mockSetShowFilters}
        />
      );
      const dialogBackdrop = screen.getAllByRole("presentation")[1];
      const filter = screen.queryByText(/Filters/);
      expect(dialogBackdrop).toBeInTheDocument();
      expect(filter).toBeInTheDocument();
      expect(filter).toBeVisible();
    });

    it("should render all the child components", () => {
      render(
        <AdvanceFilters
          showFilters={true}
          setShowFilters={mockSetShowFilters}
        />
      );
      const mockDateTime = screen.queryByText("mockDateTime");
      expect(mockDateTime).toBeInTheDocument();

      const mockDepth = screen.queryByText("mockDepth");
      expect(mockDepth).toBeInTheDocument();

      const mockCategory = screen.queryByText("mockCategory");
      expect(mockCategory).toBeInTheDocument();

      const mockDataDeliveryMode = screen.queryByText("mockDataDeliveryMode");
      expect(mockDataDeliveryMode).toBeInTheDocument();

      const mockIMosOnly = screen.queryByText("mockIMosOnly");
      expect(mockIMosOnly).toBeInTheDocument();
    });
  });

  describe("when showFilter is false", () => {
    it("should not render the AdvanceFilter", () => {
      render(
        <AdvanceFilters
          showFilters={false}
          setShowFilters={mockSetShowFilters}
        />
      );
      const filter = screen.queryByText(/Filters/);
      expect(filter).not.toBeInTheDocument();
    });
  });

  describe("when random click outside area of the filter", () => {
    it("should call setShowFilters one time to close the modal ", async () => {
      render(
        <AdvanceFilters
          showFilters={true}
          setShowFilters={mockSetShowFilters}
        />
      );
      const dialogBackdrop = screen.getAllByRole("presentation")[1];
      await userEvent.click(dialogBackdrop);
      expect(mockSetShowFilters).toBeCalledTimes(1);
    });
  });
});
