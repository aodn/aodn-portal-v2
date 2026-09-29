import {
  vi,
  expect,
  it,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import { http, HttpResponse, delay } from "msw";
import SearchPage from "@/pages/search-page/SearchPage";
import store, { getSearchQueryResult } from "@/app/store/store";
import { useAppSelector } from "@/app/store/hooks";
import { SortResultEnum } from "@/components/common/buttons/ResultListSortButton";
import { pageDefault } from "@/components/common/constants";
import { clearComponentParam } from "@/app/store/componentParamReducer";
import { SearchResultLayoutEnum } from "@/components/common/buttons/ResultListLayoutButton";
import { server } from "@/__mocks__/server";
import { portalTheme } from "@/styles";

const mocks = vi.hoisted(() => ({
  isMobile: true,
  mapImported: vi.fn(),
  mapMounted: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => ({ isUnderLaptop: mocks.isMobile, isMobile: mocks.isMobile }),
}));
vi.mock("@/hooks/useRedirectSearch", () => ({
  default: () => mocks.redirect,
}));
vi.mock("@/pages/search-page/layout/MapSection", async () => {
  const { useEffect } = await import("react");
  mocks.mapImported();
  const MockMapSection = ({ showFullList }: { showFullList: boolean }) => {
    useEffect(() => {
      mocks.mapMounted();
    }, []);
    return showFullList ? null : <div data-testid="search-map" />;
  };
  return { default: MockMapSection };
});
vi.mock("@/pages/search-page/layout/ResultSection", () => ({
  default: ({
    onChangeLayout,
    onChangeSorting,
  }: {
    onChangeLayout: (layout: SearchResultLayoutEnum) => void;
    onChangeSorting: (sort: SortResultEnum) => void;
  }) => (
    <div>
      Results
      <button onClick={() => onChangeSorting(SortResultEnum.TITLE)}>
        Sort by title
      </button>
      <button onClick={() => onChangeLayout(SearchResultLayoutEnum.FULL_MAP)}>
        Show map
      </button>
      <button onClick={() => onChangeLayout(SearchResultLayoutEnum.FULL_LIST)}>
        Show list
      </button>
    </div>
  ),
}));

const SearchState = () => {
  const result = useAppSelector(getSearchQueryResult);
  const location = useLocation();
  return (
    <output data-testid="search-state">
      {result.result.collections[0]?.title} {location.search}
    </output>
  );
};

const renderPage = (url = "/search") =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={portalTheme}>
        <MemoryRouter initialEntries={[url]}>
          <SearchPage />
          <SearchState />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  mocks.isMobile = true;
  store.dispatch(clearComponentParam());
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

it("shows mobile results without importing the map until it is selected", async () => {
  renderPage();
  expect(screen.getByText("Results")).toBeVisible();
  expect(mocks.mapImported).not.toHaveBeenCalled();
  expect(screen.queryByTestId("search-map")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Show map"));
  expect(await screen.findByTestId("search-map")).toBeInTheDocument();
  expect(mocks.mapImported).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByText("Show list"));
  expect(screen.queryByTestId("search-map")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Show map"));
  expect(await screen.findByTestId("search-map")).toBeInTheDocument();
  expect(mocks.mapImported).toHaveBeenCalledOnce();
  expect(mocks.mapMounted).toHaveBeenCalledOnce();
});

it("honours a direct full-map link on mobile before Redux synchronises", async () => {
  renderPage("/search?layout=FULL_MAP");
  expect(await screen.findByTestId("search-map")).toBeInTheDocument();
});

it("honours a direct full-list link on desktop before Redux synchronises", () => {
  mocks.isMobile = false;
  renderPage("/search?layout=FULL_LIST");
  expect(screen.queryByTestId("search-map")).not.toBeInTheDocument();
});

it("loads the map alongside the results for the default desktop layout", async () => {
  mocks.isMobile = false;
  renderPage();
  expect(screen.getByText("Results")).toBeVisible();
  expect(await screen.findByTestId("search-map")).toBeInTheDocument();
});

it("keeps a slow mobile sort request alive until results and URL update", async () => {
  const originalUrl = window.location.href;
  window.history.replaceState({}, "", pageDefault.search);
  server.use(
    http.get("*/api/v1/ogc/collections", async ({ request }) => {
      const sorted = new URL(request.url).searchParams.has("sortby");
      if (sorted) await delay(500);
      return HttpResponse.json({
        collections: [{ id: "test", title: sorted ? "Sorted" : "Original" }],
        links: [],
        total: 1,
        search_after: [],
      });
    })
  );
  try {
    renderPage(`${pageDefault.search}?layout=FULL_LIST`);
    await screen.findByText("Original", { exact: false });
    fireEvent.click(screen.getByText("Sort by title"));
    await screen.findByText(/Sorted.*sort=TITLE/);
  } finally {
    window.history.replaceState({}, "", originalUrl);
  }
});
