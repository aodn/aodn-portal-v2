import { Provider } from "react-redux";
import { afterAll, beforeAll, describe, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

const theme = AppTheme;

// Create mock functions for React Router hooks
const mockLocation = {
  pathname: "/search",
  search: "",
  hash: "",
  state: null,
  key: "default",
};

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: () => mockLocation,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useRedirectSearch hook
const mockRedirectSearch = vi.fn();
vi.mock("../../hooks/useRedirectSearch", () => ({
  default: () => mockRedirectSearch,
}));

vi.mock(
  "../../../components/common/store/searchReducer",
  async (importOriginal) => {
    const actual =
      (await importOriginal()) as typeof import("../../../components/common/store/searchReducer");
    return {
      ...actual,
      fetchResultWithStore: vi.fn(() => ({
        type: "search/fetchResultWithStore",
      })),
      fetchResultNoStore: vi.fn(() => {
        return {
          type: "search/fetchResultNoStore",
          payload: Promise.resolve({ collections: [] }),
          unwrap: () => Promise.resolve({}),
        };
      }),
      fetchResultByUuidNoStore: vi.fn(() => ({
        unwrap: () => Promise.resolve({}),
      })),
    };
  }
);

// Import the component and router after the mock is defined
import SearchPage from "../SearchPage";
import { BrowserRouter as Router } from "react-router-dom";

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
    server.listen();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("The map should be able to expand properly", () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    waitFor(() => screen.findByTestId("result-layout-button")).then(() => {
      // Find and open the Select component
      const selectElement = screen.queryByTestId(
        "result-layout-button"
      ) as HTMLButtonElement;
      user.click(selectElement);

      // Find and click the "Full Map View" option
      const fullMapViewOption = screen.queryByText(
        "Full Map View"
      ) as HTMLButtonElement;
      user.click(fullMapViewOption);

      // Should not be there if full map view clicked
      const list = screen.queryByTestId("search-page-result-list");
      expect(list).not.toBeInTheDocument();
    });
  });

  it("The list should be able to show in list / grid view", () => {
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

    // Pretend user enter wave and press one enter in search box
    waitFor(() => {
      const input = screen.findByTestId(
        "input-with-suggester"
      ) as unknown as HTMLInputElement;
      return input;
    }).then((input) => {
      // const input = screen.getByTestId("input-with-suggester") as any;

      user.type(input, "wave");
      user.type(input, "{enter}");
      // expect(input.value).toEqual("wave");

      waitFor(() => {
        const list = screen.findByTestId("search-page-result-list");
        return list;
      }).then((list) => {
        expect(list).toBeDefined();

        // Find and open the Select component
        const selectElement = screen.getByText("View");
        user.click(selectElement);

        // Find and click the "Grid and Map" option
        const gridAndMapOption = screen.getByText("Grid and Map");
        expect(gridAndMapOption).toBeDefined();
        user.click(gridAndMapOption);

        const gridView = screen.getByTestId("resultcard-result-grid");
        expect(gridView).toBeInTheDocument();

        const gridList = screen.getAllByTestId("result-card-grid");
        expect(gridList.length).not.equal(0);

        // Open the Select component again
        user.click(selectElement);

        // Find and click the "List and Map" option
        const listAndMapOption = screen.getByText("List and Map");
        expect(listAndMapOption).toBeInTheDocument();
        user.click(listAndMapOption);

        const listList = screen.getAllByTestId("result-card-list");
        expect(listList.length).not.equal(0);
        // Clear after test
        userEvent.clear(input);
      });
    });
  }, 60000);

  it("Change sort order load correct record", () => {
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
    // Pretend user enter wave and press two enter in search box
    waitFor(() => {
      const input = screen.findByTestId(
        "input-with-suggester"
      ) as unknown as HTMLInputElement;
      return input;
    }).then((input) => {
      user.type(input, "imos");
      user.type(input, "{enter}");

      waitFor(() => {
        const list = screen.getByTestId("search-page-result-list");
        return list;
      }).then((list) => {
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

        // Clear after test
        user.clear(input);
      });
    });
  }, 60000);

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
    // Mock the initial Redux state
    store.dispatch(updateSort(SortResultEnum.POPULARITY));
    store.dispatch(updateLayout(SearchResultLayoutEnum.FULL_LIST));

    // Render the component with the mocked state
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <SearchPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    waitFor(() => screen.findByTestId("result-layout-button")).then(() => {
      // Verify that the UI reflects the initial state
      expect(screen.getByTestId("result-layout-button")).toHaveTextContent(
        "Full List View"
      );
      expect(screen.getByTestId("result-sort-button")).toHaveTextContent(
        "Popularity"
      );
    });
  });

  // Button click to URL parameters flow
  it("Should call redirectSearch to update URL parameters when click view button to change layout", () => {
    const user = userEvent.setup();
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

    waitFor(() => screen.findByTestId("result-layout-button")).then(() => {
      // Find and open the Select component
      const selectElement = screen.getByTestId("result-layout-button");
      user.click(selectElement);

      // Find and click the "List and Map" option
      const listAndMapOption = screen.getByText("Grid and Map");
      expect(listAndMapOption).toBeInTheDocument();
      user.click(listAndMapOption);

      // Verify that redirectSearch was called with the correct parameters
      expect(mockRedirectSearch).toHaveBeenCalledOnce();
    });
  });
});
