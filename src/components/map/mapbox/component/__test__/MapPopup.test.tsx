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
import MapPopup from "../MapPopup";

// Attach the popup content to the page, as mapbox does
vi.mock("mapbox-gl", async () => ({
  ...(await vi.importActual<typeof import("mapbox-gl")>("mapbox-gl")),
  Popup: class {
    content?: HTMLElement;
    closeHandlers = new Set<() => void>();
    on = (_: string, handler: () => void) => this.closeHandlers.add(handler);
    off = (_: string, handler: () => void) =>
      this.closeHandlers.delete(handler);
    setLngLat = () => this;
    setDOMContent = (content: HTMLElement) => {
      this.content = content;
      return this;
    };
    addTo = () => {
      if (this.content) document.body.append(this.content);
      return this;
    };
    remove = () => {
      if (!this.content?.isConnected) return;
      this.content.remove();
      this.closeHandlers.forEach((handler) => handler());
    };
  },
}));
vi.mock("@/components/map/mapbox/Map", () => ({ default: () => null }));
vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => ({ isUnderLaptop: false }),
}));

const LAYER_ID = "points";

// Results are remembered, so each test needs its own ids
let idCount = 0;
const newId = () => `map-popup-${idCount++}`;

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

// Render the popup, and return functions to hover a dataset and move the map
const renderPopup = (enableGeoServerWhiteList?: boolean) => {
  const handlers = new Map<string, (event: unknown) => void>();
  const map = {
    on: (type: string, ...args: unknown[]) =>
      handlers.set(type, args.at(-1) as (event: unknown) => void),
    off: vi.fn(),
    getCanvas: () => document.createElement("canvas"),
  } as unknown as MapboxMap;

  render(
    <Provider store={store}>
      <AdminScreenContext.Provider value={{ enableGeoServerWhiteList }}>
        <MapContext.Provider value={{ map }}>
          <MapPopup layerId={LAYER_ID} />
        </MapContext.Provider>
      </AdminScreenContext.Provider>
    </Provider>
  );

  return {
    hoverDataset: async (id: string) => {
      act(() =>
        handlers.get("mouseenter")?.({
          target: map,
          features: [
            { properties: { uuid: id }, geometry: { coordinates: [0, 0] } },
          ],
        })
      );
      await screen.findByText(`Title ${id}`);
    },
    moveMap: () => act(() => handlers.get("moveend")?.(undefined)),
  };
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));
const getDownload = () => screen.getByRole("button", { name: "Downloads" });

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  requested.length = 0;
});
afterAll(() => server.close());

// The hover tip renders in its own React root, without redux or admin context
describe("MapPopup hover tip Download", () => {
  it.each([
    ["cloud optimised", "summary", "a.parquet", true],
    ["original netcdfs", "file-list", "original_netcdfs", true],
    ["no download type", "wms", "layer", false],
  ])("needs no check for %s", async (_, rel, title, enabled) => {
    mockApi(rel, title);
    const { hoverDataset } = renderPopup();
    await hoverDataset(newId());
    await settle();

    expect(getDownload()).toHaveProperty("disabled", !enabled);
    expect(requested).toEqual([]);
  });

  it("checks WFS when shown, and only once for the same dataset", async () => {
    const id = newId();
    mockApi("wfs", "layer");
    const { hoverDataset, moveMap } = renderPopup();
    await hoverDataset(id);
    await waitFor(() => expect(getDownload()).toBeEnabled());

    moveMap();
    await waitFor(() =>
      expect(screen.queryByText(`Title ${id}`)).not.toBeInTheDocument()
    );
    await hoverDataset(id);

    expect(getDownload()).toBeEnabled();
    expect(requested).toEqual([`${id} true`]);
  });

  it("stays disabled when the WFS check says no", async () => {
    mockApi("wfs", "layer", 404);
    const { hoverDataset } = renderPopup();
    await hoverDataset(newId());

    await waitFor(() => expect(requested).toHaveLength(1));
    await settle();
    expect(getDownload()).toBeDisabled();
  });

  it("passes the allow list setting of the admin screen", async () => {
    const id = newId();
    mockApi("wfs", "layer");
    const { hoverDataset } = renderPopup(false);
    await hoverDataset(id);

    await waitFor(() => expect(getDownload()).toBeEnabled());
    expect(requested).toEqual([`${id} false`]);
  });
});
