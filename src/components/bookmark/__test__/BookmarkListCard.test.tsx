import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/__mocks__/server";
import { ILink, OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import AdminScreenContext from "@/components/admin/AdminScreenContext";
import { detailPageDefault, pageReferer } from "@/components/common/constants";
import BookmarkListCard from "../BookmarkListCard";

vi.mock("@/components/map/mapbox/Map", () => ({ default: () => null }));

// Results are remembered, so each collection needs its own id
let idCount = 0;
const createCollection = (rel: string, title: string): OGCCollection =>
  Object.assign(new OGCCollection(), {
    id: `bookmark-list-card-${idCount++}`,
    links: [{ rel, title, href: "", type: "" } as ILink],
  });

const requested: string[] = [];
const mockWfsLayers = (status: number) =>
  server.use(
    http.get(
      "/api/v1/ogc/collections/:uuid/items/wfs_layers",
      ({ params, request }) => {
        const allowList = new URL(request.url).searchParams.get(
          "enableGeoServerWhiteList"
        );
        requested.push(`${params.uuid} ${allowList}`);
        return HttpResponse.json([{ name: "imos:layer", title: "Layer" }], {
          status,
        });
      }
    )
  );

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));
const getDownload = () => screen.getByRole("button", { name: "Downloads" });

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  requested.length = 0;
});
afterAll(() => server.close());

describe("BookmarkListCard Download", () => {
  it.each([
    ["cloud optimised", "summary", "a.parquet", true],
    ["original netcdfs", "file-list", "original_netcdfs", true],
    ["no download type", "wms", "layer", false],
  ])("needs no check for %s", async (_, rel, title, enabled) => {
    mockWfsLayers(200);
    render(<BookmarkListCard dataset={createCollection(rel, title)} />);
    await settle();

    expect(getDownload()).toHaveProperty("disabled", !enabled);
    expect(requested).toEqual([]);
  });

  it("checks WFS on mount, and opens the detail page once available", async () => {
    const dataset = createCollection("wfs", "layer");
    const tabNavigation = vi.fn();
    mockWfsLayers(200);

    render(
      <BookmarkListCard dataset={dataset} tabNavigation={tabNavigation} />
    );
    expect(getDownload()).toBeDisabled();
    await waitFor(() => expect(getDownload()).toBeEnabled());
    await userEvent.click(getDownload());

    expect(requested).toEqual([`${dataset.id} true`]);
    expect(tabNavigation).toHaveBeenCalledWith(
      dataset.id,
      detailPageDefault.SUMMARY,
      pageReferer.SEARCH_PAGE_REFERER,
      undefined,
      undefined
    );
  });

  it("stays disabled when the WFS check says no", async () => {
    mockWfsLayers(401);
    render(<BookmarkListCard dataset={createCollection("wfs", "layer")} />);

    await waitFor(() => expect(requested).toHaveLength(1));
    await settle();
    expect(getDownload()).toBeDisabled();
  });

  it("uses the allow list setting of the admin screen", async () => {
    const dataset = createCollection("wfs", "layer");
    mockWfsLayers(200);

    render(
      <AdminScreenContext.Provider value={{ enableGeoServerWhiteList: false }}>
        <BookmarkListCard dataset={dataset} />
      </AdminScreenContext.Provider>
    );

    await waitFor(() => expect(getDownload()).toBeEnabled());
    expect(requested).toEqual([`${dataset.id} false`]);
  });
});
