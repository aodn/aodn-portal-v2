import { useCallback, useEffect, useMemo } from "react";
import { DownloadServiceType } from "@/app/store/datasetEnums";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  checkWfsDownload,
  isWfsDownloadable,
} from "@/app/store/downloadAvailabilityReducer";

/**
 * Whether the links tell if a collection can be downloaded. Undefined for WFS,
 * which needs a GeoServer check (checkWfsDownload).
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
 * netcdfs are known from the links. WFS is checked with GeoServer and is not
 * downloadable until confirmed. WFS answers are shared through redux by every
 * place using this hook, and kept until the page is reloaded.
 *
 * @param collections Keep the reference stable. A new reference checks the
 * collections not answered yet, e.g. only the new ones after "load more", and
 * those whose last check failed.
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

  useEffect(() => {
    wfsIds.forEach((uuid) =>
      dispatch(checkWfsDownload({ uuid, enableGeoServerWhiteList }))
    );
  }, [dispatch, wfsIds, enableGeoServerWhiteList]);

  // A string, so this renders again only when one of these collections becomes
  // available, not on every check of the shared state
  const availableIdsJson = useAppSelector((state) =>
    JSON.stringify(
      wfsIds.filter((id) =>
        isWfsDownloadable(state, id, enableGeoServerWhiteList)
      )
    )
  );
  const availableIds = useMemo(
    () => new Set<string>(JSON.parse(availableIdsJson)),
    [availableIdsJson]
  );

  return useCallback(
    (collection: OGCCollection) =>
      isDownloadableByLinks(collection) ?? availableIds.has(collection.id),
    [availableIds]
  );
};

export default useDownloadAvailability;
