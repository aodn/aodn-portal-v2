import { describe, it, expect, vi, beforeEach } from "vitest";

// Global mock dispatch
const mockDispatch = vi.fn();

vi.mock("../../../components/common/store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn((selector) =>
    selector({
      paramReducer: {
        layout: "LIST",
        sort: "RELEVANT",
        bbox: undefined,
        zoom: undefined,
      },
      searchReducer: { result: { total: 0 } },
      bookmarkList: { items: [], temporaryItem: undefined },
    })
  ),
}));

vi.mock("../../../components/common/store/store", () => ({
  default: {
    getState: vi.fn().mockReturnValue({
      paramReducer: {
        layout: "LIST",
        sort: "RELEVANT",
        bbox: undefined,
        zoom: undefined,
      },
      searchReducer: { result: { total: 0 } },
      bookmarkList: { items: [], temporaryItem: undefined },
    }),
    subscribe: vi.fn(),
  },
  getComponentState: vi.fn((state) => state.paramReducer),
  getSearchQueryResult: vi.fn((state) => state.searchReducer),
}));

vi.mock("../../../components/common/store/componentParamReducer", () => ({
  formatToUrlParam: vi.fn(() => "param=1"),
  unFlattenToParameterState: vi.fn(() => ({
    layout: "LIST",
    sort: "RELEVANT",
  })),
  updateFilterBBox: vi.fn(),
  updateLayout: vi.fn(),
  updateSort: vi.fn(),
  updateSortBy: vi.fn(),
  updateZoom: vi.fn(),
}));

vi.mock("../../../components/common/store/searchReducer", () => ({
  createSearchParamFrom: vi.fn((param, overrides) => ({
    ...param,
    ...overrides,
  })),
  DEFAULT_SEARCH_MAP_SIZE: 100,
  DEFAULT_SEARCH_PAGE_SIZE: 10,
  fetchResultByUuidNoStore: vi.fn(() => ({
    unwrap: vi.fn().mockResolvedValue({ id: "test" }),
  })),
  fetchResultNoStore: vi.fn(),
  fetchResultWithStore: vi.fn(() => ({ abort: vi.fn() })),
  jsonToOGCCollections: vi.fn(() => ({ collections: [] })),
}));

vi.mock("../../../components/common/store/bookmarkListReducer", () => ({
  on: vi.fn(),
  off: vi.fn(),
  setExpandedItem: vi.fn(),
  setTemporaryItem: vi.fn(),
}));

vi.mock("@turf/turf", () => ({
  bboxPolygon: vi.fn().mockReturnValue({ type: "Polygon", coordinates: [] }),
  booleanEqual: vi.fn().mockReturnValue(true),
}));

vi.mock("mapbox-gl", () => ({
  LngLatBounds: class {
    getNorthEast() {
      return { lng: 0, lat: 0 };
    }
    getSouthWest() {
      return { lng: 0, lat: 0 };
    }
  },
  MapEvent: {},
}));

vi.mock("../../../hooks/useBreakpoint", () => ({
  default: () => ({ isUnderLaptop: false, isMobile: false }),
}));

// Mock subcomponents to avoid rendering issues
vi.mock("../sections/ResultSection", () => ({
  default: () => <div>ResultSection</div>,
}));

vi.mock("../sections/MapSection", () => ({
  default: () => <div>MapSection</div>,
}));

vi.mock("../../../components/layout/layout", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SearchPage from "../SearchPage";
import { pageReferer } from "../../../components/common/constants";
import { Provider } from "react-redux";
import store from "../../../components/common/store/store";
import useRedirectSearch from "../../../hooks/useRedirectSearch";

describe("SearchPage with useRedirectSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Create some mock data so to proceed with function call then() --> finally() etc
    mockDispatch.mockImplementation(() => {
      return {
        abort: vi.fn(),
        unwrap: vi.fn().mockReturnValue(
          Promise.resolve([
            {
              properties: {
                centroid: [
                  [
                    {
                      source: "112.00000",
                      parsedValue: 112,
                    },
                    {
                      source: "-37.00000",
                      parsedValue: -37,
                    },
                  ],
                ],
              },
              id: "0015db7e-e684-7548-e053-08114f8cd4ad",
              links: [],
              itemType: "Collection",
            },
            {
              properties: {
                centroid: [
                  [
                    {
                      source: "147.25000",
                      parsedValue: 147.25,
                    },
                    {
                      source: "-18.50000",
                      parsedValue: -18.5,
                    },
                  ],
                ],
              },
              id: "003a7540-ce5d-431d-9c25-824a3b4aa200",
              links: [],
              itemType: "Collection",
            },
          ])
        ),
      };
    });
  });

  it("verifies repeat calls to useRedirectSearch trigger handleNavigation and searches", () => {
    // Any search param works as we do not doing search in this test
    const TestApp = () => (
      <MemoryRouter initialEntries={["/search?param=1"]}>
        <Provider store={store}>
          <Routes>
            <Route path="/search" element={<SearchPageWrapper />} />
          </Routes>
        </Provider>
      </MemoryRouter>
    );

    const SearchPageWrapper = () => {
      const redirectSearch = useRedirectSearch();
      return (
        <>
          <SearchPage />
          <button
            data-testid="local-test-button"
            onClick={() =>
              redirectSearch(pageReferer.SEARCH_PAGE_REFERER, true, true)
            }
          >
            Redirect
          </button>
        </>
      );
    };

    render(<TestApp />);

    // Initial mount triggers handleNavigation -> doListSearch -> 2 dispatches (withStore + noStore)
    expect(mockDispatch).toHaveBeenCalledTimes(2);

    // First click
    const button = screen.getByTestId("local-test-button");
    fireEvent.click(button);

    // Another handleNavigation -> another 2 dispatches
    return waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(4), {
      timeout: 2000,
    }).then(() => {
      // Second click (repeat)
      fireEvent.click(button);

      // Yet another 2 dispatches
      return waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(6));
    });
  });
});
