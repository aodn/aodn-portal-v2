/**
 * Uses real axios + msw so the AxiosError objects under test are produced
 * by the installed axios version. An axios upgrade that changes error shape
 * will fail these tests locally instead of silently breaking GA4 in prod.
 */
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import axios from "axios";
import { trackHttpRequestError } from "../httpRequestErrEvent";
import { AnalyticsEvent } from "../analyticsEvents";

vi.mock("../customEventTracker", () => ({ trackCustomEvent: vi.fn() }));
import { trackCustomEvent } from "../customEventTracker";

const BASE_URL = "http://test.local";
const mockedTrackCustomEvent = vi.mocked(trackCustomEvent);

// Local msw server — kept isolated from the global one in src/__mocks__/server.ts
// so error handlers here don't leak into other test files.
const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

const respondWith = (
  path: string,
  body: Record<string, unknown>,
  status: number
): void => {
  server.use(
    http.get(`${BASE_URL}${path}`, () => HttpResponse.json(body, { status }))
  );
};

const triggerRequest = (path: string, config?: object): Promise<unknown> =>
  axios.get(`${BASE_URL}${path}`, config).catch(trackHttpRequestError);

describe("trackHttpRequestError", () => {
  describe("when the backend returns an error response", () => {
    it("sends endpoint, method, status, message and details to GA4", async () => {
      respondWith(
        "/collections",
        { message: "boom", details: "stacktrace here" },
        500
      );

      await triggerRequest("/collections");

      expect(mockedTrackCustomEvent).toHaveBeenCalledTimes(1);
      expect(mockedTrackCustomEvent).toHaveBeenCalledWith(
        AnalyticsEvent.HTTP_REQUEST_ERRORS,
        expect.objectContaining({
          endpoint: `${BASE_URL}/collections`,
          method: "GET",
          status: 500,
          message: "boom",
          details: "stacktrace here",
        })
      );
    });

    it("truncates long message values to 100 characters (GA4 limit)", async () => {
      respondWith("/long", { message: "x".repeat(250) }, 500);

      await triggerRequest("/long");

      const [, payload] = mockedTrackCustomEvent.mock.calls[0];
      expect((payload as { message: string }).message).toHaveLength(100);
    });
  });

  describe("when the request fails without a response", () => {
    it("reports status 0 for network errors", async () => {
      server.use(http.get(`${BASE_URL}/down`, () => HttpResponse.error()));

      await triggerRequest("/down");

      expect(mockedTrackCustomEvent).toHaveBeenCalledTimes(1);
      expect(mockedTrackCustomEvent).toHaveBeenCalledWith(
        AnalyticsEvent.HTTP_REQUEST_ERRORS,
        expect.objectContaining({ status: 0, method: "GET" })
      );
    });
  });

  describe("when the user cancels the request", () => {
    it("does not emit an event", async () => {
      const controller = new AbortController();
      server.use(
        http.get(`${BASE_URL}/slow`, async () => {
          await new Promise((r) => setTimeout(r, 50));
          return HttpResponse.json({});
        })
      );

      const pending = triggerRequest("/slow", { signal: controller.signal });
      controller.abort();
      await pending;

      expect(mockedTrackCustomEvent).not.toHaveBeenCalled();
    });
  });
});
