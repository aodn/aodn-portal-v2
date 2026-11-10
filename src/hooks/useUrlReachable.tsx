import { useEffect, useState } from "react";

const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Checks once on mount whether a URL can be reached. Uses a no-cors request
 * because the target may not send CORS headers (axios/XHR cannot opt out of
 * CORS). The response is opaque, so this detects DNS/network failures and
 * timeouts but cannot read the HTTP status (a 404 still counts as reachable).
 * Returns false until the check succeeds.
 */
const useUrlReachable = (
  url: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): boolean => {
  const [reachable, setReachable] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    fetch(url, { method: "HEAD", mode: "no-cors", signal: controller.signal })
      .then(() => setReachable(true))
      .catch(() => setReachable(false))
      .finally(() => clearTimeout(timer));

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [url, timeoutMs]);

  return reachable;
};

export default useUrlReachable;
