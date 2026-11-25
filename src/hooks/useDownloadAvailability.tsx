import { useCallback, useMemo, useSyncExternalStore } from "react";
import { DownloadServiceType } from "@/app/store/datasetEnums";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import {
  getAvailableWfsKeys,
  toWfsCheckKey,
  watchWfsAvailability,
} from "@/app/store/wfsAvailability";

/**
 * Tells which collections can be downloaded. Cloud optimised and original
 * netcdfs are known from the links, WFS is checked with GeoServer and is not
 * downloadable until confirmed.
 *
 * Must not use any React context or redux, the map hover tip has none.
 *
 * @param collections Keep the reference stable. A new reference checks again
 * the collections whose last check failed.
 */
const useDownloadAvailability = (
  collections: OGCCollection[],
  enableGeoServerWhiteList: boolean = true
): ((collection: OGCCollection) => boolean) => {
  const wfsIds = useMemo(
    () =>
      collections
        .filter(
          (collection) =>
            collection.getDownloadServiceType() === DownloadServiceType.WFS
        )
        .map((collection) => collection.id),
    [collections]
  );

  const subscribe = useCallback(
    (onAvailable: () => void) =>
      watchWfsAvailability(wfsIds, enableGeoServerWhiteList, onAvailable),
    [wfsIds, enableGeoServerWhiteList]
  );
  const availableWfsKeys = useSyncExternalStore(subscribe, getAvailableWfsKeys);

  return useCallback(
    (collection: OGCCollection) => {
      switch (collection.getDownloadServiceType()) {
        case DownloadServiceType.CloudOptimised:
        case DownloadServiceType.OriginalNetcdfs:
          return true;
        case DownloadServiceType.WFS:
          return availableWfsKeys.has(
            toWfsCheckKey(collection.id, enableGeoServerWhiteList)
          );
        default:
          return false;
      }
    },
    [availableWfsKeys, enableGeoServerWhiteList]
  );
};

export default useDownloadAvailability;
