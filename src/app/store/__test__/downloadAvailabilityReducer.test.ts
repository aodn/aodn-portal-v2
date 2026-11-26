import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/__mocks__/server";
import {
  checkWfsDownload,
  isWfsDownloadable,
} from "../downloadAvailabilityReducer";
import { fetchGeoServerDownloadLayers } from "../searchReducer";
import store from "../store";

// Each test has its own id, answers are kept in the store until reload
let idCount = 0;
const newId = () => `download-availability-reducer-${idCount++}`;

let requests = 0;
const answerWith = (status: number) =>
  server.use(
    http.get("/api/v1/ogc/collections/:uuid/items/wfs_layers", () => {
      requests++;
      return HttpResponse.json([{ name: "imos:layer", title: "Layer" }], {
        status,
      });
    })
  );

const isDownloadable = (id: string) =>
  isWfsDownloadable(store.getState(), id, true);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  requests = 0;
});
afterAll(() => server.close());

describe("downloadAvailabilityReducer", () => {
  it("ignores an older result that arrives after the detail page result", () => {
    const request = { uuid: newId() };
    const { pending, fulfilled } = fetchGeoServerDownloadLayers;
    store.dispatch(pending("background", request));
    store.dispatch(pending("detail", request));
    store.dispatch(fulfilled([], "detail", request));
    store.dispatch(
      fulfilled([{ name: "imos:layer", title: "Layer" }], "background", request)
    );

    expect(
      store.getState().downloadAvailability.wfsChecks[`true:${request.uuid}`]
    ).toEqual({ status: "unavailable" });
  });

  it("uses an older result that arrives first, until the newer one arrives", () => {
    const request = { uuid: newId() };
    const { pending, fulfilled } = fetchGeoServerDownloadLayers;
    const wfsCheck = () =>
      store.getState().downloadAvailability.wfsChecks[`true:${request.uuid}`];
    store.dispatch(pending("background", request));
    store.dispatch(pending("detail", request));
    store.dispatch(
      fulfilled([{ name: "imos:layer", title: "Layer" }], "background", request)
    );
    expect(wfsCheck()?.status).toBe("available");

    store.dispatch(fulfilled([], "detail", request));
    expect(wfsCheck()).toEqual({ status: "unavailable" });
  });

  it("keeps an older result that arrives first when the newer check fails", () => {
    const request = { uuid: newId() };
    const { pending, fulfilled, rejected } = fetchGeoServerDownloadLayers;
    store.dispatch(pending("background", request));
    store.dispatch(pending("detail", request));
    store.dispatch(
      fulfilled([{ name: "imos:layer", title: "Layer" }], "background", request)
    );
    store.dispatch(
      rejected(new Error("Service unavailable"), "detail", request)
    );

    expect(
      store.getState().downloadAvailability.wfsChecks[`true:${request.uuid}`]
    ).toEqual({ status: "available" });
  });

  it("keeps the known answer when a refresh fails", () => {
    const request = { uuid: newId() };
    const { pending, fulfilled, rejected } = fetchGeoServerDownloadLayers;
    store.dispatch(pending("background", request));
    store.dispatch(
      fulfilled([{ name: "imos:layer", title: "Layer" }], "background", request)
    );
    store.dispatch(pending("detail", request));
    store.dispatch(
      rejected(new Error("Service unavailable"), "detail", request)
    );

    expect(
      store.getState().downloadAvailability.wfsChecks[`true:${request.uuid}`]
    ).toEqual({ status: "available" });
  });

  it("keeps the answer while the detail page checks again, then uses its answer", async () => {
    const uuid = newId();
    answerWith(200);
    await store.dispatch(
      checkWfsDownload({ uuid, enableGeoServerWhiteList: true })
    );
    expect(isDownloadable(uuid)).toBe(true);

    // The layer is gone when the detail page checks
    answerWith(404);
    const detailCheck = store.dispatch(
      fetchGeoServerDownloadLayers({ uuid, enableGeoServerWhiteList: true })
    );
    expect(isDownloadable(uuid)).toBe(true);
    await detailCheck;

    expect(isDownloadable(uuid)).toBe(false);
    // The answer is kept, the next check sends nothing
    await store.dispatch(
      checkWfsDownload({ uuid, enableGeoServerWhiteList: true })
    );
    expect(requests).toBe(2);
  });

  it("forgets a check that was stopped, so it is checked again", async () => {
    const uuid = newId();
    answerWith(200);
    const detailCheck = store.dispatch(
      fetchGeoServerDownloadLayers({ uuid, enableGeoServerWhiteList: true })
    );
    // e.g. the detail page is left
    detailCheck.abort();
    await detailCheck;
    expect(store.getState().downloadAvailability.wfsChecks).not.toHaveProperty(
      `true:${uuid}`
    );

    await store.dispatch(
      checkWfsDownload({ uuid, enableGeoServerWhiteList: true })
    );
    expect(isDownloadable(uuid)).toBe(true);
  });

  it("treats an unset allow list setting as on, like the hooks", async () => {
    const uuid = newId();
    answerWith(200);
    // The detail page sends the setting as it is, it can be unset
    await store.dispatch(fetchGeoServerDownloadLayers({ uuid }));

    expect(isDownloadable(uuid)).toBe(true);
    expect(isWfsDownloadable(store.getState(), uuid, false)).toBe(false);
  });
});
