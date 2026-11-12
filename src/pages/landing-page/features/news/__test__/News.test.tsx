import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { portalTheme } from "@/styles";
import store, { getComponentState } from "@/app/store/store";
import {
  clearComponentParam,
  updateSearchText,
} from "@/app/store/componentParamReducer";
import useRedirectSearch from "@/hooks/useRedirectSearch";
import { SearchKeys } from "@/components/search/constants";
import News from "@/pages/landing-page/features/news/News";

vi.mock("@/hooks/useRedirectSearch", () => ({ default: vi.fn() }));
const redirectSearch = vi.fn();
const renderNews = () =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={portalTheme}>
        <News />
      </ThemeProvider>
    </Provider>
  );

beforeEach(() => {
  store.dispatch(clearComponentParam());
  vi.mocked(useRedirectSearch).mockReturnValue(redirectSearch);
  redirectSearch.mockImplementation(() => {
    expect(getComponentState(store.getState()).searchText).toBeFalsy();
  });
});
afterEach(() => {
  cleanup();
  store.dispatch(clearComponentParam());
});

describe("News", () => {
  it.each([
    ["IMOS", SearchKeys.IMOS],
    ["AAD", SearchKeys.AAD],
    ["AIMS", SearchKeys.AIMS],
    ["CSIRO", SearchKeys.CSIRO],
    ["IMAS", SearchKeys.IMAS],
  ])(
    "filters by %s and clears old filters before redirecting",
    async (label, group) => {
      store.dispatch(updateSearchText("old search"));
      redirectSearch.mockImplementation(() => {
        const params = getComponentState(store.getState());
        expect(params.searchText).toBeFalsy();
        expect(params.datasetGroup).toBe(group);
      });
      renderNews();
      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: new RegExp(`^${label}$`) }));
      expect(redirectSearch).toHaveBeenCalledExactlyOnceWith(
        "Featured Datasets"
      );
    }
  );

  it("shows no dataset counts or more datasets button", () => {
    renderNews();
    expect(screen.getByRole("button", { name: "AAD" })).toHaveTextContent(
      /^AAD$/
    );
    expect(
      screen.queryByRole("button", { name: "More datasets" })
    ).not.toBeInTheDocument();
  });
});
