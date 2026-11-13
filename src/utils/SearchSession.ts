// One id per browser tab. Elasticsearch uses it as the search preference so
// repeated searches in that tab hit the same shard copies.
const SEARCH_SESSION_KEY = "search-session-id";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Used only when sessionStorage is unavailable (private mode, or Node).
let fallbackSessionId: string | undefined;

const createSessionId = () => crypto.randomUUID();

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
