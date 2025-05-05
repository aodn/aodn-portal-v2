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
import AppTheme from "../../../utils/AppTheme";
import { server } from "../../../__mocks__/server";
import store from "../../../components/common/store/store";
import {
  updateLayout,
  updateSort,
} from "../../../components/common/store/componentParamReducer";
import Layout from "../../../components/layout/layout";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/ResultListLayoutButton";
import { SortResultEnum } from "../../../components/common/buttons/ResultListSortButton";
import * as useRedirectSearchModule from "../../../hooks/useRedirectSearch";
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
import { BrowserRouter as Router } from "react-router-dom";
import { SEARCH_PAGE_REFERER } from "../constants";

// Mock the Map component to avoid map initialization
vi.mock("../../../components/map/mapbox/Map", () => {
  return {
    default: function DummyMap() {
      return <div data-testid="mockMap"></div>;
    },
  };
});

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

    // Mock scrollIntoView with a Vitest mock function
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

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

  // Initialize redux, make list view and relevant sort as default
  beforeEach(() => {
    store.dispatch(updateLayout(SearchResultLayoutEnum.LIST));
    store.dispatch(updateSort(SortResultEnum.RELEVANT));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("The map should be able to expand properly", () => {
    const user = userEvent.setup();
    store.dispatch(updateLayout(SearchResultLayoutEnum.LIST));
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    // Mock user input to trigger search
    const input = screen.getByTestId("input-with-suggester");
    user.type(input, "wave");
    user.type(input, "{enter}");

    return waitFor(() => screen.findByTestId("result-layout-button")).then(
      (select) => {
        expect(select).toBeInTheDocument();
        // Need to find combobox which is the element bound with mouse down event in MUI Select
        return waitFor(() => within(select).findByRole("combobox")).then(
          (combobox) => {
            // Open the dropdown
            // Use fireEvent.mouseDown instead of userEvent.click since MUI Select only responds to mouseDown
            fireEvent.mouseDown(combobox);

            // Wait for the dropdown to open and click the "Full Map View" option
            return waitFor(() => screen.findByText("Full Map View")).then(
              (option) => {
                fireEvent.click(option);

                // Verify search-page-result-list should not be there if full map view clicked
                const list = screen.queryByTestId("search-page-result-list");
                expect(list).not.toBeInTheDocument();
              }
            );
          }
        );
      }
    );
  });

  it("Can load correct record after click load more button", () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Layout>
              <SearchPage />
            </Layout>
          </Router>
        </ThemeProvider>
      </Provider>
    );

    return waitFor(() => screen.getAllByTestId("input-with-suggester")).then(
      (inputs) => {
        const input = inputs[0] as HTMLInputElement;
        // Pretend user enter wave and press two enter in search box
        user.type(input, "wave");
        user.type(input, "{enter}");

        return waitFor(() =>
          screen.findByTestId("search-page-result-list")
        ).then((list) => {
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
          user.click(loadMore);
          // Find the last record on second page
          record = document.getElementById(
            "result-card-ae70eb18-b1f0-4012-8d62-b03daf99f7f2"
          );
          expect(record).toBeDefined();
        });
      }
    );
  });

  // URL parameters to Redux state flow
  it("Should update Redux state based on URL parameters", () => {
    // Mock URL parameters for this test
    mockLocation.search = "?layout=GRID&sort=POPULARITY";

    // Spy on store.dispatch to verify actions
    const dispatchSpy = vi.spyOn(store, "dispatch");

    // Render the component
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

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

  // Redux state to UI flow
  it("Should update UI based on Redux state", () => {
    const user = userEvent.setup();
    // Mock the initial Redux state
    store.dispatch(updateSort(SortResultEnum.POPULARITY));
    store.dispatch(updateLayout(SearchResultLayoutEnum.GRID));

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    // Mock user input to trigger search
    const input = screen.getByTestId("input-with-suggester");
    user.type(input, "wave");
    user.type(input, "{enter}");

    // Wait for the search results to load to find the resultcard grid
    return waitFor(() => screen.findByTestId("resultcard-result-grid"), {
      timeout: 5000,
    }).then((gridList) => {
      // Verify that the grid view is displayed
      expect(gridList).toBeInTheDocument();

      // Verify that the layout button UI reflects the correct state
      expect(screen.getByTestId("result-layout-button-GRID")).toHaveTextContent(
        "Grid and Map"
      );
    });
  });

  // Button click to Redux and URL parameters flow
  it("Should call redirectSearch to update URL parameters when click view button to change layout", () => {
    const user = userEvent.setup();
    // Mock the implementation of useRedirectSearch
    vi.spyOn(useRedirectSearchModule, "default").mockImplementation(
      () => mockRedirectSearch
    );

    // Mock the initial Redux state
    store.dispatch(updateLayout(SearchResultLayoutEnum.GRID));

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    // Mock user input to trigger search
    const input = screen.getByTestId("input-with-suggester");
    user.type(input, "wave");
    user.type(input, "{enter}");

    return waitFor(() => screen.findByTestId("result-layout-button-GRID")).then(
      (select) => {
        expect(select).toBeInTheDocument();

        return waitFor(() => within(select).findByRole("combobox")).then(
          (combobox) => {
            // Open the dropdown
            fireEvent.mouseDown(combobox);

            // Wait for the dropdown to open and click the "List and Map" option
            return waitFor(() => screen.findByTestId("menuitem-LIST")).then(
              (option) => {
                fireEvent.click(option);

                const updatedLayout = store.getState().paramReducer.layout;
                // Verify that the layout was updated in Redux state
                expect(updatedLayout).toBe(SearchResultLayoutEnum.LIST);

                // Verify that redirectSearch was called with the correct parameters
                expect(mockRedirectSearch).toHaveBeenCalledWith(
                  SEARCH_PAGE_REFERER,
                  true,
                  false
                );
              }
            );
          }
        );
      }
    );
  });
});
