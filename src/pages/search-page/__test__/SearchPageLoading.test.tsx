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
import { MemoryRouter } from "react-router-dom";
import SearchPage from "@/pages/search-page/SearchPage";
import store from "@/app/store/store";
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
  }: {
    onChangeLayout: (layout: SearchResultLayoutEnum) => void;
  }) => (
    <div>
      Results
      <button onClick={() => onChangeLayout(SearchResultLayoutEnum.FULL_MAP)}>
        Show map
      </button>
      <button onClick={() => onChangeLayout(SearchResultLayoutEnum.FULL_LIST)}>
        Show list
      </button>
    </div>
  ),
}));

const renderPage = (url = "/search") =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={portalTheme}>
        <MemoryRouter initialEntries={[url]}>
          <SearchPage />
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
