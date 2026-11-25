// One id per browser tab. Elasticsearch uses it as the search preference so
// repeated searches in that tab hit the same shard copies.
const SEARCH_SESSION_KEY = "search-session-id";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Used only when sessionStorage is unavailable (private mode, or Node).
let fallbackSessionId: string | undefined;

// randomUUID exists only in a secure context. A dev server opened by LAN IP
// (http://192.168.x.x) has crypto.getRandomValues and not randomUUID.
const createSessionId = (): string => {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
};

const getSearchSessionId = (): string => {
  try {
    const stored = sessionStorage.getItem(SEARCH_SESSION_KEY);
    if (stored && UUID_PATTERN.test(stored)) {
      return stored;
    }
    const id = createSessionId();
    sessionStorage.setItem(SEARCH_SESSION_KEY, id);
    return id;
  } catch {
    fallbackSessionId ??= createSessionId();
    return fallbackSessionId;
  }
};

export { SEARCH_SESSION_KEY, getSearchSessionId };
