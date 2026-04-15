/**
 * Guards that the analytics response interceptor stays wired onto
 * ogcAxiosWithRetry. If someone removes the .interceptors.response.use(...)
 * block in searchReducer.tsx, this test fails — the unit test in
 * src/analytics/__test__/httpRequestErrEvent.test.ts cannot catch that.
 *
 * Uses status 404 because retryCondition only retries 5xx/408/429,
 * so the request fails immediately instead of burning the axios-retry
 * exponential backoff (10 retries).
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
import { AnalyticsEvent } from "../../../../analytics/analyticsEvents";

vi.mock("../../../../analytics/customEventTracker", () => ({
  trackCustomEvent: vi.fn(),
}));
import { trackCustomEvent } from "../../../../analytics/customEventTracker";
import { ogcAxiosWithRetry } from "../searchReducer";

const mockedTrackCustomEvent = vi.mocked(trackCustomEvent);
const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

describe("ogcAxiosWithRetry analytics interceptor", () => {
  it("forwards failed requests to trackHttpRequestError", async () => {
    server.use(
      http.get(/\/api\/v1\/interceptor-probe$/, () =>
        HttpResponse.json({ message: "wired" }, { status: 404 })
      )
    );

    await ogcAxiosWithRetry.get("/interceptor-probe").catch(() => {});

    expect(mockedTrackCustomEvent).toHaveBeenCalledWith(
      AnalyticsEvent.HTTP_REQUEST_ERRORS,
      expect.objectContaining({ status: 404, message: "wired" })
    );
  });
});
