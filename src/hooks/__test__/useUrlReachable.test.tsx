import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";

// setupTests.ts mocks this hook globally; test the real implementation here.
vi.unmock("@/hooks/useUrlReachable");
import useUrlReachable from "@/hooks/useUrlReachable";

const URL = "https://legacy.test.local/";

// Local msw server so these handlers don't leak into other test files.
const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useUrlReachable", () => {
  it("returns false before the check completes", () => {
    server.use(
      http.head(URL, async () => {
        await delay("infinite");
        return new HttpResponse(null, { status: 200 });
      })
    );
    const { result, unmount } = renderHook(() => useUrlReachable(URL));
    expect(result.current).toBe(false);
    unmount();
  });

  it("returns true when the URL responds", async () => {
    server.use(http.head(URL, () => new HttpResponse(null, { status: 200 })));
    const { result } = renderHook(() => useUrlReachable(URL));
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("returns false on a network error", async () => {
    server.use(http.head(URL, () => HttpResponse.error()));
    const { result } = renderHook(() => useUrlReachable(URL));
    // Let the rejected request settle before asserting it stayed false.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(result.current).toBe(false);
  });

  it("returns false when the request times out", async () => {
    // Responds after the 20ms timeout; without the abort this would be true.
    server.use(
      http.head(URL, async () => {
        await delay(150);
        return new HttpResponse(null, { status: 200 });
      })
    );
    const { result } = renderHook(() => useUrlReachable(URL, 20));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(result.current).toBe(false);
  });

  it("sends a HEAD request with no-cors mode", async () => {
    let captured: Request | undefined;
    server.use(
      http.head(URL, ({ request }) => {
        captured = request;
        return new HttpResponse(null, { status: 200 });
      })
    );
    renderHook(() => useUrlReachable(URL));
    await waitFor(() => expect(captured).toBeDefined());
    expect(captured?.method).toBe("HEAD");
    expect(captured?.mode).toBe("no-cors");
  });
});
