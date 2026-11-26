import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/__mocks__/server";
import store from "@/app/store/store";
import {
  removeAllItems,
  setExpandedItem,
  setTemporaryItem,
} from "@/app/store/bookmarkListReducer";
import { ILink, OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import BookmarkListMenu from "../BookmarkListMenu";

vi.mock("@/components/map/mapbox/Map", () => ({ default: () => null }));

const requested: string[] = [];

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  requested.length = 0;
  act(() => {
    store.dispatch(removeAllItems());
  });
});
afterAll(() => server.close());

// Clicking a result card adds it as the expanded temporary item
const showDataset = (id: string) => {
  const dataset = Object.assign(new OGCCollection(), {
    id,
    title: "WFS dataset",
    links: [{ rel: "wfs", title: "layer", href: "", type: "" } as ILink],
  });
  store.dispatch(setTemporaryItem(dataset));
  store.dispatch(setExpandedItem(dataset));
  return dataset;
};

const openMenu = () =>
  userEvent.click(screen.getByRole("button", { name: "bookmark-list-button" }));

beforeEach(() =>
  server.use(
    http.get(
      "/api/v1/ogc/collections/:uuid/items/wfs_layers",
      ({ params, request }) => {
        const allowList = new URL(request.url).searchParams.get(
          "enableGeoServerWhiteList"
        );
        requested.push(`${params.uuid} ${allowList}`);
        return HttpResponse.json([{ name: "imos:layer", title: "Layer" }]);
      }
    )
  )
);

// MenuControl renders the menu in its own React root, so render it here
// without the app's redux and admin screen providers too
describe("BookmarkListMenu", () => {
  it("shows the card of a clicked dataset and checks its WFS download", async () => {
    const dataset = showDataset("bookmark-list-menu-wfs");

    render(<BookmarkListMenu />);
    await openMenu();

    const download = await screen.findByRole("button", { name: "Downloads" });
    await waitFor(() => expect(download).toBeEnabled());
    expect(requested).toEqual([`${dataset.id} true`]);
  });

  it("checks with the allow list setting of the admin screen", async () => {
    const dataset = showDataset("bookmark-list-menu-allow-list-off");

    render(
      <BookmarkListMenu adminScreen={{ enableGeoServerWhiteList: false }} />
    );
    await openMenu();

    const download = await screen.findByRole("button", { name: "Downloads" });
    await waitFor(() => expect(download).toBeEnabled());
    expect(requested).toEqual([`${dataset.id} false`]);
  });
});
