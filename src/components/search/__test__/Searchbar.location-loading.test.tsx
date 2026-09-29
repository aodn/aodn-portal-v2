import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { beforeAll, describe, expect, it, vi } from "vitest";
import store from "@/app/store/store";
import AppTheme from "@/styles/theme";
import Searchbar from "../Searchbar";

const locationImport = vi.hoisted(() => {
  let resolve!: () => void;
  const pending = new Promise<void>((done) => {
    resolve = done;
  });
  return { pending, resolve: () => resolve() };
});

vi.mock("../../filter/LocationFilter", async () => {
  await locationImport.pending;
  return { default: () => <div>Location filter loaded</div> };
});

vi.mock("../../filter/DateRangeFilter", () => ({
  default: () => <div>Date filter loaded</div>,
}));

vi.mock("../../filter/Filters", () => ({
  default: () => <div>Parameter filter loaded</div>,
}));

vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => ({ isMobile: false, isTablet: false, isUnderLaptop: false }),
}));

const renderSearchbar = () =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <BrowserRouter>
          <Searchbar />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );

describe("Location filter loading", () => {
  beforeAll(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("shows loading, supports closing and switching, then shows the filter", async () => {
    renderSearchbar();
    await userEvent.click(screen.getByTestId("location-button"));

    const popup = await screen.findByTestId("searchbar-popup");
    const loadingStatus = within(popup).getByRole("status", {
      name: "Loading filter",
    });
    expect(loadingStatus).toBeVisible();
    expect(
      within(loadingStatus).getByRole("progressbar", { hidden: true })
    ).toBeVisible();

    await userEvent.click(screen.getByTestId("location-button"));
    await waitFor(() => expect(popup).not.toBeVisible());

    await userEvent.click(screen.getByTestId("date-range-button"));
    expect(await within(popup).findByText("Date filter loaded")).toBeVisible();

    await act(async () => {
      locationImport.resolve();
    });
    expect(within(popup).getByText("Date filter loaded")).toBeVisible();
    expect(within(popup).queryByText("Location filter loaded")).toBeNull();

    await userEvent.click(screen.getByTestId("location-button"));
    expect(
      await within(popup).findByText("Location filter loaded")
    ).toBeVisible();
    expect(
      within(popup).queryByRole("status", {
        name: "Loading filter",
      })
    ).not.toBeInTheDocument();
  });
});
