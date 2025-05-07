import { render, screen, waitFor } from "@testing-library/react";
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
    isPopupOpen: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Popup Interactions", () => {
    it("should expand the button and show text when date button is clicked", () => {
      render(
        <Provider store={store}>
          <SearchbarButtonGroup
            {...defaultProps}
            activeButton={SearchbarButtonNames.Date}
          />
        </Provider>
      );

      const dateButton = screen.getByTestId("date-range-button");
      user.click(dateButton);

      return waitFor(() =>
        expect(mockHandleClickButton).toHaveBeenCalledWith(
          SearchbarButtonNames.Date
        )
      ).then(() => expect(screen.getByText("Date")).toBeInTheDocument());
    });

    it("should expand the button and show text when location button is clicked", () => {
      render(
        <Provider store={store}>
          <SearchbarButtonGroup
            {...defaultProps}
            activeButton={SearchbarButtonNames.Location}
          />
        </Provider>
      );

      const locationButton = screen.getByTestId("location-button");
      user.click(locationButton);

      return waitFor(() =>
        expect(mockHandleClickButton).toHaveBeenCalledWith(
          SearchbarButtonNames.Location
        )
      ).then(() => expect(screen.getByText("Location")).toBeInTheDocument());
    });

    it("should expand the button and show text when filter button is clicked", () => {
      render(
        <Provider store={store}>
          <SearchbarButtonGroup
            {...defaultProps}
            activeButton={SearchbarButtonNames.Filter}
          />
        </Provider>
      );

      const filterButton = screen.getByTestId("filtersBtn");
      user.click(filterButton);

      return waitFor(() =>
        expect(mockHandleClickButton).toHaveBeenCalledWith(
          SearchbarButtonNames.Filter
        )
      ).then(() => expect(screen.getByText("Filter")).toBeInTheDocument());
    });

    it("should handle switching between different popups", () => {
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
      user.click(dateButton);

      return waitFor(() =>
        expect(mockHandleClickButton).toHaveBeenCalledWith(
          SearchbarButtonNames.Date
        )
      ).then(() => {
        // Then click location button
        const locationButton = screen.getByTestId("location-button");
        user.click(locationButton);

        return waitFor(() =>
          expect(mockHandleClickButton).toHaveBeenCalledWith(
            SearchbarButtonNames.Location
          )
        );
      });
    });
  });
});
