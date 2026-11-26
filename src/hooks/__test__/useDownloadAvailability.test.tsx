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
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/__mocks__/server";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { ILink, OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import useDownloadAvailability from "../useDownloadAvailability";

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const createLink = (rel: string, title: string): ILink => ({
  rel,
  title,
  href: "",
  type: "",
});
const coLink = createLink("summary", "a.parquet");
const netcdfsLink = createLink("file-list", "original_netcdfs");
const wfsLink = createLink("wfs", "layer");

// Each collection has its own id, so the requests are easy to tell apart
let idCount = 0;
const createCollection = (links: ILink[]): OGCCollection =>
  Object.assign(new OGCCollection(), {
    id: `download-availability-${idCount++}`,
    links,
  });

const requested: string[] = [];
// Ids not on the allow list, all the others have a layer
const blocked = new Set<string>();

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

// Holds every check until the returned function is called
const holdAnswers = () => {
  let release: () => void = () => {};
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  server.use(
    http.get(
      "/api/v1/ogc/collections/:uuid/items/wfs_layers",
      async ({ params }) => {
        requested.push(params.uuid as string);
        await released;
        return HttpResponse.json([{ name: "imos:layer", title: "Layer" }]);
      }
    )
  );
  return release;
};

beforeAll(() => server.listen());
beforeEach(() => {
  requested.length = 0;
  blocked.clear();
  server.use(
    http.get(
      "/api/v1/ogc/collections/:uuid/items/wfs_layers",
      ({ params, request }) => {
        const id = params.uuid as string;
        const allowList = new URL(request.url).searchParams.get(
          "enableGeoServerWhiteList"
        );
        requested.push(id);
        return allowList === "true" && blocked.has(id)
          ? new HttpResponse(null, { status: 401 })
          : HttpResponse.json([{ name: "imos:layer", title: "Layer" }]);
      }
    )
  );
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useDownloadAvailability", () => {
  it.each([
    ["cloud optimised", [coLink, wfsLink], true],
    ["original netcdfs", [netcdfsLink, wfsLink], true],
    ["no download type", [createLink("wms", "layer")], false],
  ])("needs no check for %s", async (_, links, expected) => {
    const collection = createCollection(links);
    const collections = [collection];

    const { result } = renderHook(() => useDownloadAvailability(collections), {
      wrapper,
    });
    expect(result.current(collection)).toBe(expected);
    await settle();

    expect(result.current(collection)).toBe(expected);
    expect(requested).toEqual([]);
  });

  it("is downloadable by WFS only after the check confirms it", async () => {
    const available = createCollection([wfsLink]);
    const notAllowed = createCollection([wfsLink]);
    blocked.add(notAllowed.id);
    const collections = [available, notAllowed];

    const { result } = renderHook(() => useDownloadAvailability(collections), {
      wrapper,
    });
    expect(result.current(available)).toBe(false);

    await waitFor(() => expect(result.current(available)).toBe(true));
    await settle();
    expect(result.current(notAllowed)).toBe(false);
    expect(requested).toEqual([available.id, notAllowed.id]);
  });

  it("checks only the new collections when the results change", async () => {
    const first = createCollection([wfsLink]);
    const second = createCollection([wfsLink]);

    const { result, rerender } = renderHook(
      ({ collections }) => useDownloadAvailability(collections),
      { wrapper, initialProps: { collections: [first] } }
    );
    await waitFor(() => expect(result.current(first)).toBe(true));

    rerender({ collections: [first, second] });
    expect(result.current(first)).toBe(true);
    await waitFor(() => expect(result.current(second)).toBe(true));
    expect(requested).toEqual([first.id, second.id]);
  });

  it("keeps the answer of collections no longer in the results", async () => {
    const release = holdAnswers();
    const first = createCollection([wfsLink]);
    const second = createCollection([wfsLink]);

    const { result, rerender } = renderHook(
      ({ collections }) => useDownloadAvailability(collections),
      { wrapper, initialProps: { collections: [first] } }
    );
    await waitFor(() => expect(requested).toEqual([first.id]));

    // e.g. a new search, the check of first is not stopped
    rerender({ collections: [second] });
    await waitFor(() => expect(requested).toEqual([first.id, second.id]));
    release();
    await waitFor(() => expect(result.current(second)).toBe(true));

    // e.g. back to the first search
    rerender({ collections: [first] });
    expect(result.current(first)).toBe(true);
    expect(requested).toEqual([first.id, second.id]);
  });

  it("shares the answer with the next mount", async () => {
    const collection = createCollection([wfsLink]);
    const collections = [collection];
    const first = renderHook(() => useDownloadAvailability(collections), {
      wrapper,
    });
    await waitFor(() => expect(first.result.current(collection)).toBe(true));
    first.unmount();

    const { result } = renderHook(() => useDownloadAvailability(collections), {
      wrapper,
    });

    expect(result.current(collection)).toBe(true);
    await settle();
    expect(requested).toEqual([collection.id]);
  });

  it("shares one check between places showing the same collection", async () => {
    const release = holdAnswers();
    const collection = createCollection([wfsLink]);
    const collections = [collection];
    // e.g. the result list and a bookmark card
    const list = renderHook(() => useDownloadAvailability(collections), {
      wrapper,
    });
    const bookmark = renderHook(() => useDownloadAvailability(collections), {
      wrapper,
    });
    await waitFor(() => expect(requested).toEqual([collection.id]));
    release();

    await waitFor(() => expect(list.result.current(collection)).toBe(true));
    expect(bookmark.result.current(collection)).toBe(true);
    expect(requested).toEqual([collection.id]);
  });

  it("checks a failed collection again when the results change", async () => {
    const collection = createCollection([wfsLink]);
    let answers = 0;
    server.use(
      http.get("/api/v1/ogc/collections/:uuid/items/wfs_layers", () => {
        requested.push(collection.id);
        // GeoServer is down for the first check, which is not retried
        return answers++ === 0
          ? new HttpResponse(null, { status: 503 })
          : HttpResponse.json([{ name: "imos:layer", title: "Layer" }]);
      })
    );

    const { result, rerender } = renderHook(
      ({ collections }) => useDownloadAvailability(collections),
      { wrapper, initialProps: { collections: [collection] } }
    );
    await waitFor(() => expect(requested).toHaveLength(1));
    await settle();
    expect(result.current(collection)).toBe(false);

    // e.g. "load more"
    rerender({ collections: [collection] });
    await waitFor(() => expect(result.current(collection)).toBe(true));
    expect(requested).toHaveLength(2);
  });

  it("checks again when the allow list setting changes", async () => {
    const collection = createCollection([wfsLink]);
    blocked.add(collection.id);
    const collections = [collection];

    const { result, rerender } = renderHook(
      ({ allowList }: { allowList?: boolean }) =>
        useDownloadAvailability(collections, allowList),
      // The setting is undefined outside the admin screen
      { wrapper, initialProps: { allowList: undefined as boolean | undefined } }
    );
    await waitFor(() => expect(requested).toHaveLength(1));
    await settle();
    expect(result.current(collection)).toBe(false);

    rerender({ allowList: false });
    await waitFor(() => expect(result.current(collection)).toBe(true));

    rerender({ allowList: true });
    expect(result.current(collection)).toBe(false);
    expect(requested).toHaveLength(2);
  });

  it("renders again only when a collection becomes available", async () => {
    const available = createCollection([wfsLink]);
    const notAllowed = createCollection([wfsLink]);
    blocked.add(notAllowed.id);
    const collections = [notAllowed];
    const otherCollections = [available];
    const onRender = vi.fn();

    renderHook(
      () => {
        onRender();
        return useDownloadAvailability(collections);
      },
      { wrapper }
    );
    const other = renderHook(() => useDownloadAvailability(otherCollections), {
      wrapper,
    });
    await waitFor(() => expect(other.result.current(available)).toBe(true));
    await waitFor(() => expect(requested).toContain(notAllowed.id));
    await settle();

    expect(onRender).toHaveBeenCalledTimes(1);
  });
});
