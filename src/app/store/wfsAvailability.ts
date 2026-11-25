/**
 * Checks if GeoServer has WFS layers to download for a collection. A WFS link
 * alone does not mean it can be downloaded.
 *
 * The cache and queue are plain module state, not redux, because the map hover
 * tip renders in its own React root without any provider.
 * Use it through useDownloadAvailability.
 */
import {
  DownloadLayersResponse,
  MapFeatureRequest,
} from "./GeoserverDefinitions";
import { ogcAxiosWithRetry } from "./searchReducer";

const MAX_RUNNING_CHECKS = 4;
// Shorter than other requests, a slow GeoServer must not hold all the slots
const CHECK_TIMEOUT = 30_000;
// Do not try a failed check again too soon, e.g. on each map move in an outage
const FAILED_CHECK_WAIT = 60_000;

// Ids are case-sensitive and not always uuids, use them exactly as given
export const toWfsCheckKey = (
  id: string,
  enableGeoServerWhiteList: boolean
): string => `${enableGeoServerWhiteList}:${id}`;

// Final answers, kept until the page is reloaded
const answeredKeys = new Set<string>();
// Replaced, never mutated, so it can be a useSyncExternalStore snapshot
let availableKeys: ReadonlySet<string> = new Set();
const failedAt = new Map<string, number>();

const queue = new Map<string, MapFeatureRequest>();
const runningKeys = new Set<string>();
const watchers = new Map<string, Set<() => void>>();

const needsCheck = (key: string): boolean => {
  if (answeredKeys.has(key) || runningKeys.has(key)) return false;
  const failedTime = failedAt.get(key);
  return (
    failedTime === undefined || Date.now() - failedTime >= FAILED_CHECK_WAIT
  );
};

const fetchHasLayers = async (request: MapFeatureRequest): Promise<boolean> => {
  const response = await ogcAxiosWithRetry.get<DownloadLayersResponse[]>(
    `/ogc/collections/${request.uuid}/items/wfs_layers`,
    {
      params: request,
      timeout: CHECK_TIMEOUT,
      // 401 (not on the allow list) and 404 (no layer) are normal answers here,
      // do not log them as HTTP errors
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 401 || status === 404,
      "axios-retry": { retries: 0 },
    }
  );
  return (
    response.status === 200 &&
    Array.isArray(response.data) &&
    response.data.length > 0
  );
};

const runCheck = async (key: string, request: MapFeatureRequest) => {
  runningKeys.add(key);
  try {
    const hasLayers = await fetchHasLayers(request);
    answeredKeys.add(key);
    failedAt.delete(key);
    if (hasLayers) {
      availableKeys = new Set(availableKeys).add(key);
      [...(watchers.get(key) ?? [])].forEach((watcher) => watcher());
    }
  } catch {
    // Already logged by the axios interceptor
    failedAt.set(key, Date.now());
  } finally {
    runningKeys.delete(key);
    runNextChecks();
  }
};

const runNextChecks = () => {
  for (const [key, request] of queue) {
    if (runningKeys.size >= MAX_RUNNING_CHECKS) return;
    queue.delete(key);
    runCheck(key, request);
  }
};

/** Keys (see toWfsCheckKey) confirmed to have WFS layers. */
export const getAvailableWfsKeys = (): ReadonlySet<string> => availableKeys;

/**
 * Check the ids not checked yet, and call onAvailable when one of them becomes
 * available.
 *
 * @returns Stops watching. Queued checks that nobody else watches are dropped,
 * running ones finish.
 */
export const watchWfsAvailability = (
  ids: string[],
  enableGeoServerWhiteList: boolean,
  onAvailable: () => void
): (() => void) => {
  const watcher = () => onAvailable();
  const keys = new Set<string>();

  ids.forEach((uuid) => {
    const key = toWfsCheckKey(uuid, enableGeoServerWhiteList);
    keys.add(key);
    watchers.set(key, (watchers.get(key) ?? new Set()).add(watcher));
    if (needsCheck(key)) queue.set(key, { uuid, enableGeoServerWhiteList });
  });
  runNextChecks();

  return () =>
    keys.forEach((key) => {
      const keyWatchers = watchers.get(key);
      keyWatchers?.delete(watcher);
      if (keyWatchers?.size) return;
      watchers.delete(key);
      queue.delete(key);
    });
};
