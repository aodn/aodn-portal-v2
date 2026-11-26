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

// MenuControl renders the menu in its own React root, so render it here
// without the app's redux Provider too
describe("BookmarkListMenu", () => {
  it("shows the card of a clicked dataset and checks its WFS download", async () => {
    server.use(
      http.get(
        "/api/v1/ogc/collections/:uuid/items/wfs_layers",
        ({ params }) => {
          requested.push(params.uuid as string);
          return HttpResponse.json([{ name: "imos:layer", title: "Layer" }]);
        }
      )
    );
    // Clicking a result card adds it as the expanded temporary item
    const dataset = Object.assign(new OGCCollection(), {
      id: "bookmark-list-menu-wfs",
      title: "WFS dataset",
      links: [{ rel: "wfs", title: "layer", href: "", type: "" } as ILink],
    });
    store.dispatch(setTemporaryItem(dataset));
    store.dispatch(setExpandedItem(dataset));

    render(<BookmarkListMenu />);
    await userEvent.click(
      screen.getByRole("button", { name: "bookmark-list-button" })
    );

    const download = await screen.findByRole("button", { name: "Downloads" });
    await waitFor(() => expect(download).toBeEnabled());
    expect(requested).toEqual([dataset.id]);
  });
});
