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
import { ILink, OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import useDownloadAvailability from "../useDownloadAvailability";

const createLink = (rel: string, title: string): ILink => ({
  rel,
  title,
  href: "",
  type: "",
});
const coLink = createLink("summary", "a.parquet");
const netcdfsLink = createLink("file-list", "original_netcdfs");
const wfsLink = createLink("wfs", "layer");

// Results are remembered, so each collection needs its own id
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

    const { result } = renderHook(() => useDownloadAvailability(collections));
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

    // No wrapper: it must work without any provider
    const { result } = renderHook(() => useDownloadAvailability(collections));
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
      { initialProps: { collections: [first] } }
    );
    await waitFor(() => expect(result.current(first)).toBe(true));

    rerender({ collections: [first, second] });
    expect(result.current(first)).toBe(true);
    await waitFor(() => expect(result.current(second)).toBe(true));
    expect(requested).toEqual([first.id, second.id]);
  });

  it("uses the remembered result at the first render", async () => {
    const collection = createCollection([wfsLink]);
    const collections = [collection];
    const first = renderHook(() => useDownloadAvailability(collections));
    await waitFor(() => expect(first.result.current(collection)).toBe(true));
    first.unmount();

    const { result } = renderHook(() => useDownloadAvailability(collections));

    expect(result.current(collection)).toBe(true);
    await settle();
    expect(requested).toEqual([collection.id]);
  });

  it("checks again when the allow list setting changes", async () => {
    const collection = createCollection([wfsLink]);
    blocked.add(collection.id);
    const collections = [collection];

    const { result, rerender } = renderHook(
      ({ allowList }: { allowList?: boolean }) =>
        useDownloadAvailability(collections, allowList),
      // The setting is undefined outside the admin screen
      { initialProps: { allowList: undefined as boolean | undefined } }
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

    renderHook(() => {
      onRender();
      return useDownloadAvailability(collections);
    });
    const other = renderHook(() => useDownloadAvailability(otherCollections));
    await waitFor(() => expect(other.result.current(available)).toBe(true));
    await waitFor(() => expect(requested).toContain(notAllowed.id));
    await settle();

    expect(onRender).toHaveBeenCalledTimes(1);
  });
});
