import { ErrorResponse } from "@/utils/ErrorBoundary";
import { useParams } from "react-router-dom";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { fetchResultByUuidNoStore } from "@/app/store/searchReducer";
import { DetailPageContext } from "./detail-page-context";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { useAppDispatch } from "@/app/store/hooks";
import {
  defaultMapSubsettingCapabilities,
  DownloadConditionType,
  DownloadServiceType,
  evaluateSubsettingSupport,
  IDownloadCondition,
  MapSubsettingCapabilities,
  SubsettingType,
} from "./DownloadDefinitions";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { AnalyticsEvent } from "@/analytics/analyticsEvents";
import { trackCustomEvent } from "@/analytics/customEventTracker";
import {
  LayerName,
  LayerSwitcherLayer,
} from "@/components/map/mapbox/controls/menu/MapLayerSwitcher";

interface DetailPageProviderProps {
  children: ReactNode;
}

export const DetailPageProvider: FC<DetailPageProviderProps> = ({
  children,
}) => {
  const { uuid } = useParams();
  const dispatch = useAppDispatch();
  const [collection, setCollection] = useState<OGCCollection | undefined>(
    undefined
  );
  const [fetchError, setFetchError] = useState<{
    uuid: string;
    notFound: boolean;
  }>();
  const [collectionUuid, setCollectionUuid] = useState(uuid);
  if (collectionUuid !== uuid) {
    setCollectionUuid(uuid);
    setCollection(undefined);
    setFetchError(undefined);
  }
  const currentError = fetchError?.uuid === uuid ? fetchError : undefined;
  const isCollectionNotFound = currentError?.notFound === true;
  const isTemporaryError = currentError?.notFound === false;
  const [downloadConditions, _setDownloadConditions] = useState<
    IDownloadCondition[]
  >([]);
  const [selectedWmsLayer, setSelectedWmsLayer] = useState<string>("");
  const [selectedCoKey, setSelectedCoKey] = useState<string>("");
  const [lastSelectedMapLayer, setLastSelectedMapLayer] =
    useState<LayerSwitcherLayer<LayerName> | null>(null);
  const [downloadService, setDownloadService] = useState<DownloadServiceType>(
    DownloadServiceType.Unavailable
  );
  const [mapSubsettingCapabilities, setMapSubsettingCapabilities] =
    useState<MapSubsettingCapabilities>(defaultMapSubsettingCapabilities);

  const getAndSetDownloadConditions = useCallback(
    (
      type: DownloadConditionType,
      conditions: IDownloadCondition[]
    ): IDownloadCondition[] => {
      let p: IDownloadCondition[] = [];
      _setDownloadConditions((prev) => {
        p = prev.filter((condition) => condition.type === type);
        return prev
          .filter((condition) => condition.type !== type)
          .concat(conditions);
      });
      return p;
    },
    []
  );

  const removeDownloadCondition = useCallback(
    (condition: IDownloadCondition) => {
      _setDownloadConditions((prev) =>
        prev.filter(
          (cs) => !(cs.type === condition.type && cs.id === condition.id)
        )
      );
    },
    []
  );

  const clearDownloadConditions = useCallback(
    (types: DownloadConditionType[]) =>
      _setDownloadConditions((prev) =>
        prev.filter((c) => !types.includes(c.type))
      ),
    []
  );

  useEffect(() => {
    if (!uuid) return;
    let cancelled = false;
    dispatch(fetchResultByUuidNoStore(uuid))
      .unwrap()
      .then((collection) => {
        if (cancelled) return;
        if (!collection) {
          setFetchError({ uuid, notFound: false });
          return;
        }
        setCollection(collection);
        setFetchError(undefined);

        // Track analytics when user views a dataset details page
        trackCustomEvent(AnalyticsEvent.DETAILS_PAGE_DATASET, {
          details_page_dataset_group: Array.isArray(
            collection.properties?.dataset_group
          )
            ? collection.properties.dataset_group.join(",")
            : undefined,
          details_page_dataset_id: uuid,
          details_page_dataset_title: collection.title,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Error fetching collection by UUID:", error);
        setFetchError({
          uuid,
          notFound: error instanceof ErrorResponse && error.statusCode === 404,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, uuid]);

  // Layer-aware: GeoServer time support does not imply PMTiles time (and vice versa).
  const isSubsettingSupported = useCallback(
    (type: SubsettingType) =>
      evaluateSubsettingSupport(type, mapSubsettingCapabilities, {
        PMTiles: LayerName.PMTiles,
        GeoServer: LayerName.GeoServer,
        GriddedRaster: LayerName.GriddedRaster,
      }),
    [mapSubsettingCapabilities]
  );

  return (
    <DetailPageContext.Provider
      value={{
        collection,
        setCollection,
        isCollectionNotFound,
        isTemporaryError,
        downloadConditions,
        getAndSetDownloadConditions,
        removeDownloadCondition,
        clearDownloadConditions,
        selectedWmsLayer,
        setSelectedWmsLayer,
        selectedCoKey,
        setSelectedCoKey,
        lastSelectedMapLayer,
        setLastSelectedMapLayer,
        downloadService,
        setDownloadService,
        mapSubsettingCapabilities,
        setMapSubsettingCapabilities,
        isSubsettingSupported,
      }}
    >
      {children}
    </DetailPageContext.Provider>
  );
};
