import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { portalTheme } from "@/styles";
import store, { getComponentState } from "@/app/store/store";
import {
  clearComponentParam,
  updateDatasetGroup,
  updateSearchText,
} from "@/app/store/componentParamReducer";
import useRedirectSearch from "@/hooks/useRedirectSearch";
import { SearchKeys } from "@/components/search/constants";
import News from "@/pages/landing-page/features/news/News";
import { FEATURED_DATASET_COUNTS } from "@/pages/landing-page/constants";

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
        .click(screen.getByRole("button", { name: new RegExp(`^${label} `) }));
      expect(redirectSearch).toHaveBeenCalledExactlyOnceWith(
        "Featured Datasets"
      );
    }
  );

  it("clears the group and old search before opening more datasets", async () => {
    store.dispatch(updateDatasetGroup(SearchKeys.AIMS));
    store.dispatch(updateSearchText("old search"));
    redirectSearch.mockImplementation(() => {
      const params = getComponentState(store.getState());
      expect(params.datasetGroup).toBeUndefined();
      expect(params.searchText).toBeFalsy();
    });
    renderNews();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "More datasets" }));
    expect(redirectSearch).toHaveBeenCalledExactlyOnceWith("Featured Datasets");
  });

  it("omits missing counts and their plus sign", () => {
    const original = FEATURED_DATASET_COUNTS[SearchKeys.AAD];
    try {
      delete FEATURED_DATASET_COUNTS[SearchKeys.AAD];
      renderNews();
      expect(screen.getByRole("button", { name: "AAD" })).toHaveTextContent(
        /^AAD$/
      );
    } finally {
      FEATURED_DATASET_COUNTS[SearchKeys.AAD] = original;
    }
  });

  it("shows zero counts with a plus sign", () => {
    const original = FEATURED_DATASET_COUNTS[SearchKeys.AAD];
    try {
      FEATURED_DATASET_COUNTS[SearchKeys.AAD] = 0;
      renderNews();
      expect(
        screen.getByRole("button", { name: "AAD 0+" })
      ).toBeInTheDocument();
    } finally {
      FEATURED_DATASET_COUNTS[SearchKeys.AAD] = original;
    }
  });
});
