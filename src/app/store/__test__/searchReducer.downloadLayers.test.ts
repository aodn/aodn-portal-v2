import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/__mocks__/server";
import { trackCustomEvent } from "@/analytics/customEventTracker";
import { fetchGeoServerDownloadLayers } from "../searchReducer";
import store from "../store";

const layers = [{ name: "imos:layer", title: "Layer" }];
let requestedUrl: URL | undefined;

const fetchLayers = (
  request: Parameters<typeof fetchGeoServerDownloadLayers>[0]
) => store.dispatch(fetchGeoServerDownloadLayers(request));

const answerWith = (response: () => Response) =>
  server.use(
    http.get(
      "/api/v1/ogc/collections/:uuid/items/wfs_layers",
      ({ request }) => {
        requestedUrl = new URL(request.url);
        return response();
      }
    )
  );

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  requestedUrl = undefined;
});
afterAll(() => server.close());

describe("fetchGeoServerDownloadLayers", () => {
  it("returns the layers and sends the allow list setting", async () => {
    answerWith(() => HttpResponse.json(layers));

    await expect(
      fetchLayers({ uuid: "abc", enableGeoServerWhiteList: false }).unwrap()
    ).resolves.toEqual(layers);
    expect(requestedUrl?.pathname).toBe(
      "/api/v1/ogc/collections/abc/items/wfs_layers"
    );
    expect(requestedUrl?.searchParams.get("enableGeoServerWhiteList")).toBe(
      "false"
    );
  });

  it.each([
    ["not on the allow list", 401],
    ["without any layer", 404],
  ])(
    "returns no layer for a collection %s, without logging an error",
    async (_, status) => {
      answerWith(() => new HttpResponse(null, { status }));

      await expect(
        fetchLayers({ uuid: "abc", enableGeoServerWhiteList: true }).unwrap()
      ).resolves.toEqual([]);
      expect(trackCustomEvent).not.toHaveBeenCalled();
    }
  );

  it("makes one request on 503 when retries are skipped", async () => {
    let requests = 0;
    answerWith(() => {
      requests++;
      return new HttpResponse(null, { status: 503 });
    });

    await expect(
      fetchLayers({
        uuid: "abc",
        enableGeoServerWhiteList: true,
        skipRetries: true,
      }).unwrap()
    ).rejects.toBeDefined();
    expect(requests).toBe(1);
    expect(requestedUrl?.searchParams.has("skipRetries")).toBe(false);
  });

  it("retries a transient 503 by default", async () => {
    let requests = 0;
    answerWith(() => {
      requests++;
      return requests === 1
        ? new HttpResponse(null, { status: 503 })
        : HttpResponse.json(layers);
    });

    await expect(
      fetchLayers({ uuid: "abc", enableGeoServerWhiteList: true }).unwrap()
    ).resolves.toEqual(layers);
    expect(requests).toBe(2);
  });

  it("rejects when aborted", async () => {
    answerWith(() => HttpResponse.json(layers));

    const check = fetchLayers({ uuid: "abc", enableGeoServerWhiteList: true });
    check.abort();

    await expect(check.unwrap()).rejects.toBeDefined();
  });
});
