import { afterEach, describe, expect, it, vi } from "vitest";
import { getSearchSessionId, SEARCH_SESSION_KEY } from "../SearchSession";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("getSearchSessionId", () => {
  afterEach(() => {
    sessionStorage.removeItem(SEARCH_SESSION_KEY);
    vi.restoreAllMocks();
  });

  it("stores one uuid and reuses it for the tab", () => {
    const first = getSearchSessionId();
    const second = getSearchSessionId();

    expect(first).toMatch(UUID_PATTERN);
    expect(second).toBe(first);
    expect(sessionStorage.getItem(SEARCH_SESSION_KEY)).toBe(first);
  });

  it("keeps a uuid already stored for this tab", () => {
    const existing = "11111111-1111-4111-8111-111111111111";
    sessionStorage.setItem(SEARCH_SESSION_KEY, existing);

    expect(getSearchSessionId()).toBe(existing);
  });

  it("replaces a stored value that is not a uuid", () => {
    sessionStorage.setItem(SEARCH_SESSION_KEY, "not-a-uuid");

    const id = getSearchSessionId();

    expect(id).toMatch(UUID_PATTERN);
    expect(id).not.toBe("not-a-uuid");
    expect(sessionStorage.getItem(SEARCH_SESSION_KEY)).toBe(id);
  });

  it("keeps one id when sessionStorage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });

    const first = getSearchSessionId();
    const second = getSearchSessionId();

    expect(first).toMatch(UUID_PATTERN);
    expect(second).toBe(first);
  });
});
