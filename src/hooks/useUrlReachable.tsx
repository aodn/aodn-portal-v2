import { useEffect, useState } from "react";
import axios from "axios";

const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Checks once on mount whether a URL responds with a 2xx to a HEAD request.
 * The target must allow CORS, otherwise the browser blocks the response and
 * this stays false. Returns false until the check succeeds.
 */
const useUrlReachable = (
  url: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): boolean => {
  const [reachable, setReachable] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .head(url, { timeout: timeoutMs, signal: controller.signal })
      .then(() => setReachable(true))
      .catch(() => setReachable(false));

    return () => controller.abort();
  }, [url, timeoutMs]);

  return reachable;
};

export default useUrlReachable;
