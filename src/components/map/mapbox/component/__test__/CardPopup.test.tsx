import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw";
import type { Map as MapboxMap } from "mapbox-gl";
import { server } from "@/__mocks__/server";
import store from "@/app/store/store";
import AdminScreenContext from "@/components/admin/AdminScreenContext";
import MapContext from "@/components/map/mapbox/MapContext";
import { MapEventEnum } from "@/components/map/mapbox/constants";
import CardPopup from "../CardPopup";

vi.mock("@/components/map/mapbox/Map", () => ({ default: () => null }));
vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => ({ isUnderLaptop: true, isTablet: false, isMobile: true }),
}));

const LAYER_ID = "points";

// Each test has its own ids, so the requests are easy to tell apart
let idCount = 0;
const newId = () => `card-popup-${idCount++}`;

// Serve the collection with one link, and its WFS layers
const requested: string[] = [];
const mockApi = (rel: string, title: string, wfsStatus: number = 200) =>
  server.use(
    http.get("/api/v1/ogc/collections/:uuid", ({ params }) =>
      HttpResponse.json({
        id: params.uuid,
        title: `Title ${params.uuid}`,
        links: [{ rel, title, href: "", type: "" }],
      })
    ),
    http.get(
      "/api/v1/ogc/collections/:uuid/items/wfs_layers",
      ({ params, request }) => {
        const allowList = new URL(request.url).searchParams.get(
          "enableGeoServerWhiteList"
        );
        requested.push(`${params.uuid} ${allowList}`);
        return HttpResponse.json([{ name: "imos:layer", title: "Layer" }], {
          status: wfsStatus,
        });
      }
    )
  );

// Render the popup, and return a function to click a dataset on the map
const renderPopup = (enableGeoServerWhiteList?: boolean) => {
  const handlers = new Map<string, (event: unknown) => void>();
  let clickedId: string;
  const map = {
    on: (type: string, handler: (event: unknown) => void) =>
      handlers.set(type, handler),
    off: vi.fn(),
    getStyle: () => ({ layers: [{ id: LAYER_ID }] }),
    project: () => ({ x: 0, y: 0 }),
    queryRenderedFeatures: () => [{ properties: { uuid: clickedId } }],
  } as unknown as MapboxMap;

  render(
    <Provider store={store}>
      <AdminScreenContext.Provider value={{ enableGeoServerWhiteList }}>
        <MapContext.Provider value={{ map }}>
          <CardPopup layerId={LAYER_ID} />
        </MapContext.Provider>
      </AdminScreenContext.Provider>
    </Provider>
  );

  return async (id: string) => {
    clickedId = id;
    act(() =>
      handlers.get(MapEventEnum.CLICK)?.({
        target: map,
        lngLat: { lng: 0, lat: 0 },
      })
    );
    await screen.findByText(`Title ${id}`);
  };
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));
// Not by role: the popup is not visible until a dataset is clicked
const getDownload = () => screen.getByLabelText("Downloads");

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  requested.length = 0;
});
afterAll(() => server.close());

describe("CardPopup Download", () => {
  it("checks nothing before a dataset is clicked", async () => {
    mockApi("wfs", "layer");
    renderPopup();
    await settle();

    expect(getDownload()).toBeDisabled();
    expect(requested).toEqual([]);
  });

  it.each([
    ["cloud optimised", "summary", "a.parquet", true],
    ["original netcdfs", "file-list", "original_netcdfs", true],
    ["no download type", "wms", "layer", false],
  ])("needs no check for %s", async (_, rel, title, enabled) => {
    mockApi(rel, title);
    const clickDataset = renderPopup();
    await clickDataset(newId());
    await settle();

    expect(getDownload()).toHaveProperty("disabled", !enabled);
    expect(requested).toEqual([]);
  });

  it("enables Download when the WFS check of the clicked dataset says yes", async () => {
    const id = newId();
    mockApi("wfs", "layer");
    const clickDataset = renderPopup();
    await clickDataset(id);

    await waitFor(() => expect(getDownload()).toBeEnabled());
    expect(requested).toEqual([`${id} true`]);
  });

  it("stays disabled when the WFS check says no", async () => {
    mockApi("wfs", "layer", 404);
    const clickDataset = renderPopup();
    await clickDataset(newId());

    await waitFor(() => expect(requested).toHaveLength(1));
    await settle();
    expect(getDownload()).toBeDisabled();
  });

  it("uses the allow list setting of the admin screen", async () => {
    const id = newId();
    mockApi("wfs", "layer");
    const clickDataset = renderPopup(false);
    await clickDataset(id);

    await waitFor(() => expect(getDownload()).toBeEnabled());
    expect(requested).toEqual([`${id} false`]);
  });
});
