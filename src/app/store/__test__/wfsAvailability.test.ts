import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/__mocks__/server";
import { AnalyticsEvent } from "@/analytics/analyticsEvents";
import { trackCustomEvent } from "@/analytics/customEventTracker";
import { ogcAxiosWithRetry } from "../searchReducer";
import {
  getAvailableWfsKeys,
  toWfsCheckKey,
  watchWfsAvailability,
} from "../wfsAvailability";

const PATH = "/api/v1/ogc/collections/:uuid/items/wfs_layers";
const LAYERS = [{ name: "imos:layer", title: "Layer" }];

// The cache lives as long as the module, so each test needs its own ids
let idCount = 0;
const newId = () => `wfs-availability-${idCount++}`;
const newIds = (length: number) => Array.from({ length }, newId);

const stops: Array<() => void> = [];
const watch = (ids: string[], allowList = true, onAvailable = vi.fn()) => {
  const stop = watchWfsAvailability(ids, allowList, onAvailable);
  stops.push(stop);
  return { stop, onAvailable };
};

const isAvailable = (id: string, allowList = true) =>
  getAvailableWfsKeys().has(toWfsCheckKey(id, allowList));

// Answer each request with the given response, and record the requested ids
const respond = (resolver: (id: string) => Response | Promise<Response>) => {
  const requested: string[] = [];
  server.use(
    http.get(PATH, ({ params }) => {
      const id = params.uuid as string;
      requested.push(id);
      return resolver(id);
    })
  );
  return requested;
};

// Like respond, but each request waits until it is released
const respondWhenReleased = () => {
  const releases = new Map<string, () => void>();
  const requested = respond(
    (id) =>
      new Promise((resolve) => {
        releases.set(id, () => resolve(HttpResponse.json(LAYERS)));
      })
  );
  return { requested, release: (id: string) => releases.get(id)?.() };
};

// Long enough for an unexpected request to show up
const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

beforeAll(() => server.listen());
afterEach(() => {
  stops.splice(0).forEach((stop) => stop());
  server.resetHandlers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

describe("wfsAvailability results", () => {
  it("is available for a 200 with layers", async () => {
    const id = newId();
    respond(() => HttpResponse.json(LAYERS));

    const { onAvailable } = watch([id]);
    expect(isAvailable(id)).toBe(false);

    await waitFor(() => expect(onAvailable).toHaveBeenCalledTimes(1));
    expect(isAvailable(id)).toBe(true);
  });

  it.each([
    ["an empty list", () => HttpResponse.json([])],
    ["an object (as the Playwright mock)", () => HttpResponse.json({})],
    ["a 401", () => new HttpResponse(null, { status: 401 })],
    ["a 404", () => new HttpResponse(null, { status: 404 })],
  ])("is not available for %s, and remembers it", async (_, response) => {
    const id = newId();
    const requested = respond(response);

    const { onAvailable, stop } = watch([id]);
    await waitFor(() => expect(requested).toHaveLength(1));
    await settle();
    stop();
    // Later than the wait after a failure
    vi.useFakeTimers({ toFake: ["Date"], now: Date.now() + 120_000 });
    watch([id]);
    await settle();

    expect(requested).toHaveLength(1);
    expect(onAvailable).not.toHaveBeenCalled();
    expect(isAvailable(id)).toBe(false);
  });

  it("remembers an available collection", async () => {
    const id = newId();
    const requested = respond(() => HttpResponse.json(LAYERS));

    const { stop } = watch([id]);
    await waitFor(() => expect(isAvailable(id)).toBe(true));
    stop();
    watch([id]);
    await settle();

    expect(requested).toHaveLength(1);
    expect(isAvailable(id)).toBe(true);
  });

  it.each([
    ["a 500", () => new HttpResponse(null, { status: 500 })],
    ["a 503", () => new HttpResponse(null, { status: 503 })],
    ["a 429", () => new HttpResponse(null, { status: 429 })],
    ["a network error", () => HttpResponse.error()],
  ])("tries again after %s, but only after 60 s", async (_, response) => {
    const id = newId();
    const requested = respond(response);

    const { stop } = watch([id]);
    await waitFor(() => expect(requested).toHaveLength(1));
    await settle();
    expect(requested).toHaveLength(1);
    expect(isAvailable(id)).toBe(false);
    stop();

    const failedTime = Date.now();
    vi.useFakeTimers({ toFake: ["Date"], now: failedTime + 50_000 });
    watch([id]).stop();
    await settle();
    expect(requested).toHaveLength(1);

    server.resetHandlers();
    const requestedLater = respond(() => HttpResponse.json(LAYERS));
    vi.setSystemTime(failedTime + 61_000);
    watch([id]);
    await waitFor(() => expect(isAvailable(id)).toBe(true));
    expect(requestedLater).toHaveLength(1);
  });

  it("does not retry by itself while watched", async () => {
    const id = newId();
    const requested = respond(() => new HttpResponse(null, { status: 500 }));

    watch([id]);
    await waitFor(() => expect(requested).toHaveLength(1));
    vi.useFakeTimers({ toFake: ["Date"], now: Date.now() + 120_000 });
    await settle();

    expect(requested).toHaveLength(1);
  });

  it("limits the request time, and treats a timeout as a failure", async () => {
    const id = newId();
    const get = vi
      .spyOn(ogcAxiosWithRetry, "get")
      .mockRejectedValue(Object.assign(new Error(), { code: "ECONNABORTED" }));

    watch([id]).stop();
    await settle();
    watch([id]).stop();
    await settle();

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(
      `/ogc/collections/${id}/items/wfs_layers`,
      expect.objectContaining({
        timeout: 30_000,
        "axios-retry": { retries: 0 },
      })
    );
  });
});

describe("wfsAvailability requests", () => {
  it("uses the id exactly as given, with the allow list setting", async () => {
    const id = `AADC-${newId()}`;
    const urls: URL[] = [];
    server.use(
      http.get(PATH, ({ request }) => {
        urls.push(new URL(request.url));
        return HttpResponse.json(LAYERS);
      })
    );

    watch([id]);
    await waitFor(() => expect(isAvailable(id)).toBe(true));

    expect(urls[0].pathname).toBe(
      `/api/v1/ogc/collections/${id}/items/wfs_layers`
    );
    expect(urls[0].searchParams.get("enableGeoServerWhiteList")).toBe("true");
    expect(isAvailable(id.toLowerCase())).toBe(false);
  });

  it("checks separately for each allow list setting", async () => {
    const id = newId();
    const settings: Array<string | null> = [];
    server.use(
      http.get(PATH, ({ request }) => {
        const setting = new URL(request.url).searchParams.get(
          "enableGeoServerWhiteList"
        );
        settings.push(setting);
        return setting === "false"
          ? HttpResponse.json(LAYERS)
          : new HttpResponse(null, { status: 401 });
      })
    );

    watch([id], true);
    watch([id], false);
    await waitFor(() => expect(isAvailable(id, false)).toBe(true));

    expect(settings.sort()).toEqual(["false", "true"]);
    expect(isAvailable(id, true)).toBe(false);
  });

  it("logs 5xx as HTTP errors, but not 401 and 404", async () => {
    const statuses = new Map([401, 404, 500].map((s) => [newId(), s]));
    const requested = respond(
      (id) => new HttpResponse(null, { status: statuses.get(id) })
    );

    watch([...statuses.keys()]);
    await waitFor(() => expect(requested).toHaveLength(3));
    await waitFor(() => expect(trackCustomEvent).toHaveBeenCalled());
    await settle();

    expect(trackCustomEvent).toHaveBeenCalledTimes(1);
    expect(trackCustomEvent).toHaveBeenCalledWith(
      AnalyticsEvent.HTTP_REQUEST_ERRORS,
      expect.objectContaining({ status: 500 })
    );
  });
});

describe("wfsAvailability queue", () => {
  it("shares the running request of the same id", async () => {
    const id = newId();
    const { requested, release } = respondWhenReleased();

    const first = watch([id, id]);
    const second = watch([id]);
    await waitFor(() => expect(requested).toHaveLength(1));
    release(id);

    await waitFor(() => expect(first.onAvailable).toHaveBeenCalledTimes(1));
    expect(second.onAvailable).toHaveBeenCalledTimes(1);
    expect(requested).toEqual([id]);
  });

  it("runs at most 4 requests, and starts the next when one finishes", async () => {
    const ids = newIds(6);
    const { requested, release } = respondWhenReleased();

    watch(ids);
    await waitFor(() => expect(requested).toHaveLength(4));
    await settle();
    expect(requested).toEqual(ids.slice(0, 4));

    release(ids[1]);
    await waitFor(() => expect(requested).toEqual(ids.slice(0, 5)));

    [0, 2, 3, 4].forEach((i) => release(ids[i]));
    await waitFor(() => expect(requested).toEqual(ids));
    release(ids[5]);
    await waitFor(() => expect(ids.every((id) => isAvailable(id))).toBe(true));
  });

  it("frees the slot of a failed request", async () => {
    const ids = newIds(5);
    const requested = respond((id) =>
      id === ids[4]
        ? HttpResponse.json(LAYERS)
        : new HttpResponse(null, { status: 500 })
    );

    watch(ids);

    await waitFor(() => expect(isAvailable(ids[4])).toBe(true));
    expect(requested).toEqual(ids);
  });

  it("drops queued checks no longer needed, and lets running ones finish", async () => {
    const oldIds = newIds(6);
    const newResultId = newId();
    const { requested, release } = respondWhenReleased();

    const { stop, onAvailable } = watch(oldIds);
    await waitFor(() => expect(requested).toHaveLength(4));
    stop();
    watch([newResultId]);
    oldIds.slice(0, 4).forEach(release);

    await waitFor(() => expect(requested).toContain(newResultId));
    release(newResultId);
    await waitFor(() => expect(isAvailable(newResultId)).toBe(true));
    await settle();

    expect(requested).toEqual([...oldIds.slice(0, 4), newResultId]);
    // Finished and remembered, but the old watcher is not called
    expect(oldIds.slice(0, 4).every((id) => isAvailable(id))).toBe(true);
    expect(onAvailable).not.toHaveBeenCalled();
  });

  it("keeps a queued check that is still needed elsewhere", async () => {
    const ids = newIds(5);
    const { requested, release } = respondWhenReleased();

    const { stop } = watch(ids);
    const { onAvailable } = watch([ids[4]]);
    await waitFor(() => expect(requested).toHaveLength(4));
    stop();
    ids.slice(0, 4).forEach(release);

    await waitFor(() => expect(requested).toEqual(ids));
    release(ids[4]);
    await waitFor(() => expect(onAvailable).toHaveBeenCalledTimes(1));
  });
});
