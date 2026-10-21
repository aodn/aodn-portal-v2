import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  it,
  vi,
} from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";
import type { MapEvent } from "mapbox-gl";
import SearchPage from "@/pages/search-page/SearchPage";
import store from "@/app/store/store";
import { clearComponentParam } from "@/app/store/componentParamReducer";
import { MapDefaultConfig } from "@/components/map/mapbox/constants";
import { MapEventEnum } from "@/components/map/mapbox/constants";
import { server } from "@/__mocks__/server";
import { portalTheme } from "@/styles";

const mocks = vi.hoisted(() => ({
  onMapZoomOrMove: undefined as
    | ((event: MapEvent | undefined, force?: boolean) => void)
    | undefined,
  mapSearches: 0,
}));

vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => ({ isUnderLaptop: false, isMobile: false }),
}));
vi.mock("@/hooks/useRedirectSearch", () => ({
  default: () => vi.fn(),
}));
vi.mock("@/pages/search-page/layout/ResultSection", () => ({
  default: () => <div>Results</div>,
}));
vi.mock("@/pages/search-page/layout/MapSection", () => ({
  default: ({
    onMapZoomOrMove,
  }: {
    onMapZoomOrMove: (event: MapEvent | undefined, force?: boolean) => void;
  }) => {
    mocks.onMapZoomOrMove = onMapZoomOrMove;
    return <div data-testid="search-map" />;
  },
}));

const { WEST_LON, EAST_LON, NORTH_LAT, SOUTH_LAT } =
  MapDefaultConfig.BBOX_ENDPOINTS;

const defaultExtentEvent = {
  type: MapEventEnum.MOVE_END,
  target: {
    getZoom: () => MapDefaultConfig.ZOOM,
    getBounds: () => ({
      getSouthWest: () => ({ lng: WEST_LON, lat: SOUTH_LAT }),
      getNorthEast: () => ({ lng: EAST_LON, lat: NORTH_LAT }),
    }),
  },
} as unknown as MapEvent;

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  mocks.onMapZoomOrMove = undefined;
  mocks.mapSearches = 0;
  store.dispatch(clearComponentParam());
  server.use(
    http.get("*/api/v1/ogc/collections", ({ request }) => {
      const properties = new URL(request.url).searchParams.get("properties");
      if (properties === "id,centroid") mocks.mapSearches += 1;
      return HttpResponse.json({
        collections: [],
        links: [],
        total: 0,
        search_after: [],
      });
    })
  );
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

it("reloads the map search when zoom reset forces the same extent", async () => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={portalTheme}>
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );

  expect(await screen.findByTestId("search-map")).toBeInTheDocument();
  await waitFor(() => expect(mocks.mapSearches).toBeGreaterThan(0));
  const searchesAfterLoad = mocks.mapSearches;

  mocks.onMapZoomOrMove?.(defaultExtentEvent);
  await new Promise((resolve) => setTimeout(resolve, 30));
  expect(mocks.mapSearches).toBe(searchesAfterLoad);

  mocks.onMapZoomOrMove?.(defaultExtentEvent, true);
  await waitFor(() => expect(mocks.mapSearches).toBe(searchesAfterLoad + 1));
});
