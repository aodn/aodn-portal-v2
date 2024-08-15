import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import AdvanceFilters from "../AdvanceFilters";
import { Provider } from "react-redux";
import store from "../../store/store";

// Mock all child components
vi.mock("../DateRangeFilter", () => ({
  default: () => <div data-testid="mockDateTime">mockDateTime</div>,
}));
vi.mock("../DepthFilter", () => ({
  default: () => <div data-testid="mockDepth">mockDepth</div>,
}));
vi.mock("../CategoryFilter", () => ({
  default: () => <div data-testid="mockCategory">mockCategory</div>,
}));
vi.mock("../DataDeliveryModeFilter", () => ({
  default: () => (
    <div data-testid="mockDataDeliveryMode">mockDataDeliveryMode</div>
  ),
}));
vi.mock("../ImosOnlySwitch", () => ({
  default: () => <div data-testid="mockIMosOnly">mockIMosOnly</div>,
}));

const mockSetShowFilters = vi.fn();

describe("AdvanceFilters", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  describe("when showFilter is true", () => {
    it("should render dialog backdrop with a visible AdvanceFilter ", () => {
      render(
        <Provider store={store}>
          <AdvanceFilters
            showFilters={true}
            setShowFilters={mockSetShowFilters}
          />
        </Provider>
      );
      const dialogBackdrop = screen.getAllByRole("presentation")[1];
      const filter = screen.queryByText(/Filters/);
      expect(dialogBackdrop).toBeInTheDocument();
      expect(filter).toBeInTheDocument();
      expect(filter).toBeVisible();
    });

    it("should render all the child components", () => {
      render(
        <Provider store={store}>
          <AdvanceFilters
            showFilters={true}
            setShowFilters={mockSetShowFilters}
          />
        </Provider>
      );

      expect(screen.getByTestId("mockDateTime")).toBeInTheDocument();
      expect(screen.getByTestId("mockDepth")).toBeInTheDocument();
      expect(screen.getByTestId("mockCategory")).toBeInTheDocument();
      expect(screen.getByTestId("mockDataDeliveryMode")).toBeInTheDocument();
      expect(screen.getByTestId("mockIMosOnly")).toBeInTheDocument();
    });
  });

  describe("when showFilter is false", () => {
    it("should not render the AdvanceFilter", () => {
      render(
        <Provider store={store}>
          <AdvanceFilters
            showFilters={false}
            setShowFilters={mockSetShowFilters}
          />
        </Provider>
      );
      const filter = screen.queryByText(/Filters/);
      expect(filter).not.toBeInTheDocument();
    });
  });

  describe("when random click outside area of the filter", () => {
    it("should call setShowFilters one time to close the modal ", async () => {
      render(
        <Provider store={store}>
          <AdvanceFilters
            showFilters={true}
            setShowFilters={mockSetShowFilters}
          />
        </Provider>
      );
      const dialogBackdrop = screen.getAllByRole("presentation")[1];
      await userEvent.click(dialogBackdrop);
      expect(mockSetShowFilters).toBeCalledTimes(1);
    });
  });
});
