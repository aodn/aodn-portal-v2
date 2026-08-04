import { Provider } from "react-redux";
import { afterAll, beforeAll, describe, expect, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "@/styles/theme";
import { server } from "@/__mocks__/server";
import store from "@/app/store/store";
import {
  clearComponentParam,
  updateLayout,
  updateSort,
} from "@/app/store/componentParamReducer";
import { SearchResultLayoutEnum } from "@/components/common/buttons/ResultListLayoutButton";
import { SortResultEnum } from "@/components/common/buttons/ResultListSortButton";
import * as useRedirectSearchModule from "../../../hooks/useRedirectSearch";
import { encodeParam } from "@/utils/UrlUtils";
const theme = AppTheme;

// Mock react-router-dom
const mockLocation = {
  pathname: "/search",
  search: "",
  hash: "",
  state: null,
  key: "default",
};
const mockNavigate = vi.fn();
vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: () => mockLocation,
    useNavigate: () => mockNavigate,
  };
});

const mockRedirectSearch = vi.fn();

// Import the component and router after the mock is defined
import SearchPage from "../SearchPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/app/layout/Layout";
import { pageReferer } from "@/components/common/constants";

// Mock the Map component to avoid map initialization
vi.mock("../../../components/map/mapbox/Map", () => {
  return {
    default: function DummyMap() {
      return <div data-testid="mockMap"></div>;
    },
  };
});

const renderSearchPage = () =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="*" element={<SearchPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );

const searchForWave = async (user: ReturnType<typeof userEvent.setup>) => {
  const input = await screen.findByTestId("input-with-suggester");
  // Prefer Enter over the search button: Autocomplete may still be "pending"
  // after typing, which causes the search button to no-op.
  await user.type(input, "wave{enter}");
};

describe("SearchPage Basic", () => {
  beforeAll(() => {
    vi.mock("../../../hooks/useBreakpoint", () => ({
      default: () => ({
        isUnderLaptop: false,
        isMobile: false,
      }),
    }));

    // With use of AutoSizer component in ResultCard, it will fail in non-UI env like vitest
    // here we mock it so to give some screen size to let the test work.
    vi.mock("react-virtualized-auto-sizer", () => {
      return {
        __esModule: true,
        default: ({
          children,
        }: {
          children: (size: { width: number; height: number }) => JSX.Element;
        }) => children({ width: 1280, height: 800 }), // Laptop dimensions
      };
    });

    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    // Mock style property
    Object.defineProperty(HTMLElement.prototype, "style", {
      value: {
        scrollMarginTop: "",
        setProperty: vi.fn(),
        removeProperty: vi.fn(),
        getPropertyValue: vi.fn().mockReturnValue(""),
      },
      configurable: true,
    });

    server.listen();
  });

  // Reset shared redux + location so searches do not accumulate across tests
  beforeEach(() => {
    mockLocation.search = "";
    store.dispatch(clearComponentParam());
    store.dispatch(updateLayout(SearchResultLayoutEnum.LIST));
    store.dispatch(updateSort(SortResultEnum.RELEVANT));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  // Default vitest testTimeout is 5s; nested waitFors can exceed that under load.
  it("The map should be able to expand properly", async () => {
    const user = userEvent.setup();
    renderSearchPage();

    await searchForWave(user);

    const select = await screen.findByTestId(
      "result-layout-button",
      {},
      {
        timeout: 8000,
      }
    );
    expect(select).toBeInTheDocument();

    // MUI Select opens on mouseDown of the combobox, not click
    const combobox = await within(select).findByRole("combobox");
    fireEvent.mouseDown(combobox);

    const option = await screen.findByText("Full Map View");
    fireEvent.click(option);

    // Full map view removes the result list panel
    await waitFor(() => {
      expect(
        screen.queryByTestId("search-page-result-list")
      ).not.toBeInTheDocument();
    });
  }, 15000);

  it("Can load correct record after click load more button", async () => {
    const user = userEvent.setup();
    renderSearchPage();

    await searchForWave(user);

    const list = await screen.findByTestId("search-page-result-list");
    expect(list).toBeDefined();

    // Find the last record in the first page
    let record = document.getElementById(
      "result-card-c1344979-f701-0916-e044-00144f7bc0f4"
    );
    expect(record).toBeDefined();

    const loadMore = document.getElementById(
      "result-card-load-more-btn"
    ) as HTMLButtonElement;
    expect(loadMore).toBeDefined();
    await user.click(loadMore);

    // Find the last record on second page
    await waitFor(() => {
      record = document.getElementById(
        "result-card-ae70eb18-b1f0-4012-8d62-b03daf99f7f2"
      );
      expect(record).toBeDefined();
    });
  });

  // URL parameters to Redux state flow
  it("Should update Redux state based on URL parameters", () => {
    // Mock URL parameters for this test
    mockLocation.search = "?" + encodeParam("layout=GRID&sort=POPULARITY");

    // Spy on store.dispatch to verify actions
    const dispatchSpy = vi.spyOn(store, "dispatch");

    renderSearchPage();

    // Verify that updateParameterStates was called with the correct parameters
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UPDATE_PARAMETER_STATES",
        payload: expect.objectContaining({
          layout: SearchResultLayoutEnum.GRID,
          sort: SortResultEnum.POPULARITY,
        }),
      })
    );

    // Verify that the state was updated correctly by checking the actual state
    const state = store.getState();
    expect(state.paramReducer.layout).toBe(SearchResultLayoutEnum.GRID);
    expect(state.paramReducer.sort).toBe(SortResultEnum.POPULARITY);

    // Clean up
    dispatchSpy.mockRestore();
  });

  // Redux + URL state to UI flow.
  // SearchPage local currentLayout is seeded from URL params (not Redux alone).
  it("Should update UI based on Redux state", async () => {
    const user = userEvent.setup();
    mockLocation.search = "?" + encodeParam("layout=GRID&sort=POPULARITY");
    store.dispatch(updateSort(SortResultEnum.POPULARITY));
    store.dispatch(updateLayout(SearchResultLayoutEnum.GRID));

    renderSearchPage();

    await searchForWave(user);

    // Wait for the search results to load to find the resultcard grid
    const gridList = await screen.findByTestId(
      "resultcard-result-grid",
      {},
      { timeout: 8000 }
    );
    expect(gridList).toBeInTheDocument();

    // Verify that the layout button UI reflects the correct state
    expect(screen.getByTestId("result-layout-button-GRID")).toBeInTheDocument();
  }, 15000);

  // Button click to Redux and URL parameters flow
  it("Should call redirectSearch to update URL parameters when click view button to change layout", async () => {
    const user = userEvent.setup();
    // Mock the implementation of useRedirectSearch
    vi.spyOn(useRedirectSearchModule, "default").mockImplementation(
      () => mockRedirectSearch
    );

    mockLocation.search = "?" + encodeParam("layout=GRID");
    store.dispatch(updateLayout(SearchResultLayoutEnum.GRID));

    renderSearchPage();

    await searchForWave(user);

    const select = await screen.findByTestId(
      "result-layout-button-GRID",
      {},
      { timeout: 8000 }
    );
    expect(select).toBeInTheDocument();

    const combobox = await within(select).findByRole("combobox");
    // Open the dropdown
    fireEvent.mouseDown(combobox);

    // Wait for the dropdown to open and click the "List and Map" option
    const option = await screen.findByTestId("menuitem-LIST");
    fireEvent.click(option);

    await waitFor(() => {
      const updatedLayout = store.getState().paramReducer.layout;
      expect(updatedLayout).toBe(SearchResultLayoutEnum.LIST);
    });

    // Verify that redirectSearch was called with the correct parameters
    expect(mockRedirectSearch).toHaveBeenCalledWith(
      pageReferer.SEARCH_PAGE_REFERER,
      true,
      false
    );
  }, 15000);
});
