import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchbarButtonGroup, {
  SearchbarButtonNames,
} from "../SearchbarButtonGroup";
import { Provider } from "react-redux";
import store from "@/app/store/store";

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
    const renderGroup = (activeButton: SearchbarButtonNames) =>
      render(
        <Provider store={store}>
          <SearchbarButtonGroup {...defaultProps} activeButton={activeButton} />
        </Provider>
      );

    it("should expand the button and show text when date button is clicked", async () => {
      renderGroup(SearchbarButtonNames.Date);

      await user.click(screen.getByTestId("date-range-button"));

      await waitFor(() =>
        expect(mockHandleClickButton).toHaveBeenCalledWith(
          SearchbarButtonNames.Date
        )
      );
      expect(screen.getByText("Date")).toBeInTheDocument();
    });

    it("should expand the button and show text when location button is clicked", async () => {
      renderGroup(SearchbarButtonNames.Location);

      await user.click(screen.getByTestId("location-button"));

      await waitFor(() =>
        expect(mockHandleClickButton).toHaveBeenCalledWith(
          SearchbarButtonNames.Location
        )
      );
      expect(screen.getByText("Location")).toBeInTheDocument();
    });

    it("should expand the button and show text when filter button is clicked", async () => {
      renderGroup(SearchbarButtonNames.Filter);

      await user.click(screen.getByTestId("filtersBtn"));

      await waitFor(() =>
        expect(mockHandleClickButton).toHaveBeenCalledWith(
          SearchbarButtonNames.Filter
        )
      );
      expect(screen.getByText("Filter")).toBeInTheDocument();
    });

    it("should handle switching between different popups", async () => {
      renderGroup(SearchbarButtonNames.Date);

      await user.click(screen.getByTestId("date-range-button"));
      await waitFor(() =>
        expect(mockHandleClickButton).toHaveBeenCalledWith(
          SearchbarButtonNames.Date
        )
      );

      await user.click(screen.getByTestId("location-button"));
      await waitFor(() =>
        expect(mockHandleClickButton).toHaveBeenCalledWith(
          SearchbarButtonNames.Location
        )
      );
    });
  });
});
