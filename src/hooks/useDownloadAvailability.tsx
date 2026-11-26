import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DownloadServiceType } from "@/app/store/datasetEnums";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchGeoServerDownloadLayers } from "@/app/store/searchReducer";

const toCheckKey = (id: string, enableGeoServerWhiteList: boolean) =>
  `${enableGeoServerWhiteList}:${id}`;

/**
 * Whether the links tell if a collection can be downloaded. Undefined for WFS,
 * which needs a GeoServer check (fetchGeoServerDownloadLayers).
 */
export const isDownloadableByLinks = (
  collection: OGCCollection
): boolean | undefined => {
  switch (collection.getDownloadServiceType()) {
    case DownloadServiceType.CloudOptimised:
    case DownloadServiceType.OriginalNetcdfs:
      return true;
    case DownloadServiceType.WFS:
      return undefined;
    default:
      return false;
  }
};

/**
 * Tells which collections can be downloaded. Cloud optimised and original
 * netcdfs are known from the links, WFS is checked with GeoServer on mount and
 * is not downloadable until confirmed.
 *
 * @param collections Keep the reference stable. A new reference checks the
 * collections not answered yet, e.g. only the new ones after "load more".
 */
const useDownloadAvailability = (
  collections: OGCCollection[],
  enableGeoServerWhiteList: boolean = true
): ((collection: OGCCollection) => boolean) => {
  const dispatch = useAppDispatch();
  const wfsIds = useMemo(
    () =>
      collections
        .filter((collection) => isDownloadableByLinks(collection) === undefined)
        .map((collection) => collection.id),
    [collections]
  );

  // Only while mounted, the next mount checks again
  const answeredKeys = useRef(new Set<string>());
  const [availableKeys, setAvailableKeys] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  useEffect(() => {
    const checks = wfsIds.flatMap((uuid) => {
      const key = toCheckKey(uuid, enableGeoServerWhiteList);
      if (answeredKeys.current.has(key)) return [];
      const check = dispatch(
        fetchGeoServerDownloadLayers({
          uuid,
          enableGeoServerWhiteList,
          skipRetries: true,
        })
      );
      check
        .unwrap()
        .then((layers) => {
          answeredKeys.current.add(key);
          if (layers.length > 0)
            setAvailableKeys((keys) => new Set(keys).add(key));
        })
        // Aborted, or failed and already logged: not downloadable
        .catch(() => {});
      return [check];
    });
    return () => checks.forEach((check) => check.abort());
  }, [dispatch, wfsIds, enableGeoServerWhiteList]);

  return useCallback(
    (collection: OGCCollection) =>
      isDownloadableByLinks(collection) ??
      availableKeys.has(toCheckKey(collection.id, enableGeoServerWhiteList)),
    [availableKeys, enableGeoServerWhiteList]
  );
};

export default useDownloadAvailability;
