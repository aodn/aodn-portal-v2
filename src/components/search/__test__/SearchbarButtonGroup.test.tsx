import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchbarButtonGroup, {
  SearchbarButtonNames,
} from "../SearchbarButtonGroup";
import { Provider } from "react-redux";
import store from "../../common/store/store";

// Mock useRedirectSearch hook
const mockRedirectSearch = vi.fn();
vi.mock("../../../hooks/useRedirectSearch", () => ({
  default: () => mockRedirectSearch,
}));

describe("SearchbarButtonGroup Component", () => {
  const user = userEvent.setup();
  const mockHandleClickButton = vi.fn();

  const defaultProps = {
    pendingSearch: false,
    activeButton: SearchbarButtonNames.Filter,
    handleClickButton: mockHandleClickButton,
    shouldExpandAllButtons: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Popup Interactions", () => {
    it("should expand the button and show text when date button is clicked", async () => {
      render(
        <Provider store={store}>
          <SearchbarButtonGroup
            {...defaultProps}
            activeButton={SearchbarButtonNames.Date}
          />
        </Provider>
      );

      const dateButton = screen.getByTestId("date-range-button");
      await user.click(dateButton);

      expect(mockHandleClickButton).toHaveBeenCalledWith(
        SearchbarButtonNames.Date
      );
      expect(screen.getByText("Date")).toBeInTheDocument();
    });

    it("should expand the button and show text when location button is clicked", async () => {
      render(
        <Provider store={store}>
          <SearchbarButtonGroup
            {...defaultProps}
            activeButton={SearchbarButtonNames.Location}
          />
        </Provider>
      );

      const locationButton = screen.getByTestId("location-button");
      await user.click(locationButton);

      expect(mockHandleClickButton).toHaveBeenCalledWith(
        SearchbarButtonNames.Location
      );
      expect(screen.getByText("Location")).toBeInTheDocument();
    });

    it("should expand the button and show text when filter button is clicked", async () => {
      render(
        <Provider store={store}>
          <SearchbarButtonGroup
            {...defaultProps}
            activeButton={SearchbarButtonNames.Filter}
          />
        </Provider>
      );

      const filterButton = screen.getByTestId("filtersBtn");
      await user.click(filterButton);

      expect(mockHandleClickButton).toHaveBeenCalledWith(
        SearchbarButtonNames.Filter
      );
      expect(screen.getByText("Filter")).toBeInTheDocument();
    });

    it("should handle switching between different popups", async () => {
      render(
        <Provider store={store}>
          <SearchbarButtonGroup
            {...defaultProps}
            activeButton={SearchbarButtonNames.Date}
          />
        </Provider>
      );

      // Click date button first
      const dateButton = screen.getByTestId("date-range-button");
      await user.click(dateButton);
      expect(mockHandleClickButton).toHaveBeenCalledWith(
        SearchbarButtonNames.Date
      );

      // Then click location button
      const locationButton = screen.getByTestId("location-button");
      await user.click(locationButton);
      expect(mockHandleClickButton).toHaveBeenCalledWith(
        SearchbarButtonNames.Location
      );
    });
  });
});
