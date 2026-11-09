import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { beforeEach, describe, expect, it, vi } from "vitest";
import store from "@/app/store/store";
import { clearComponentParam } from "@/app/store/componentParamReducer";
import { pageDefault } from "@/components/common/constants";
import Searchbar from "@/components/search/Searchbar";
import AppTheme from "@/styles/theme";

const redirectSearch = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/useRedirectSearch", () => ({
  default: () => redirectSearch,
}));

vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => ({ isMobile: false, isTablet: false, isUnderLaptop: false }),
}));

vi.mock("@/components/filter/DateRangeFilter", () => ({
  default: () => <div>Date filter</div>,
}));

vi.mock("@/components/filter/LocationFilter", () => ({
  default: () => <div>Location filter</div>,
}));

vi.mock("@/components/filter/Filters", () => ({
  default: () => <div>Parameter filters</div>,
}));

const renderSearchbar = () =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <BrowserRouter>
          <Searchbar />
          <button>Outside searchbar</button>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );

describe("Searchbar popup dismissal", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", pageDefault.search);
    HTMLElement.prototype.scrollIntoView = vi.fn();
    window.scrollTo = vi.fn();
    store.dispatch(clearComponentParam());
    redirectSearch.mockClear();
  });

  it("keeps the popup unmounted when searching without an open filter", async () => {
    const user = userEvent.setup();
    renderSearchbar();

    await user.click(screen.getByTestId("search-button"));
    expect(screen.queryByTestId("searchbar-popup")).not.toBeInTheDocument();
    expect(redirectSearch).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId("search-button"));
    expect(screen.queryByTestId("searchbar-popup")).not.toBeInTheDocument();
    expect(redirectSearch).toHaveBeenCalledTimes(2);
  });

  describe.each([
    ["Date", "date-range-button"],
    ["Location", "location-button"],
    ["Filter", "filtersBtn"],
  ])("%s popup", (_name, buttonId) => {
    it.each(["Search", "same control", "outside click"])(
      "unmounts the popup and its shadow after closing via %s",
      async (closeMethod) => {
        const user = userEvent.setup();
        renderSearchbar();

        await user.click(screen.getByTestId(buttonId));
        expect(await screen.findByTestId("searchbar-popup")).toBeVisible();

        if (closeMethod === "outside click") {
          await user.click(
            screen.getByRole("button", { name: "Outside searchbar" })
          );
        } else {
          await user.click(
            screen.getByTestId(
              closeMethod === "Search" ? "search-button" : buttonId
            )
          );
        }

        await waitFor(() =>
          expect(
            screen.queryByTestId("searchbar-popup")
          ).not.toBeInTheDocument()
        );
        expect(redirectSearch).toHaveBeenCalledTimes(
          closeMethod === "Search" ? 1 : 0
        );
      }
    );
  });
});
