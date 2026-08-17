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
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

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
  const [isCollectionNotFound, setIsCollectionNotFound] =
    useState<boolean>(false);
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

  useEffect(() => {
    if (!uuid) return;
    let cancelled = false;
    dispatch(fetchResultByUuidNoStore(uuid))
      .unwrap()
      .then((collection) => {
        if (cancelled) return;
        if (!collection) {
          setIsCollectionNotFound(true);
          return;
        }
        setCollection(collection);
        setIsCollectionNotFound(false);

        // Track analytics when user views a dataset details page
        trackCustomEvent(AnalyticsEvent.DETAILS_PAGE_DATASET, {
          details_page_dataset_group:
            collection.properties?.dataset_group?.join(","),
          details_page_dataset_id: uuid,
          details_page_dataset_title: collection.title,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Error fetching collection by UUID:", error);
        setIsCollectionNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, uuid]);

  // Keep this even though crawlers get the pre-rendered <title>: SPA navigation
  // never reloads the HTML, so without it the tab would keep showing the previously loaded record's title on this record's page.
  useDocumentTitle(collection?.title);

  // Layer-aware: GeoServer time support does not imply PMTiles time (and vice versa).
  const isSubsettingSupported = useCallback(
    (type: SubsettingType) =>
      evaluateSubsettingSupport(type, mapSubsettingCapabilities, {
        PMTiles: LayerName.PMTiles,
        GeoServer: LayerName.GeoServer,
      }),
    [mapSubsettingCapabilities]
  );

  return (
    <DetailPageContext.Provider
      value={{
        collection,
        setCollection,
        isCollectionNotFound,
        downloadConditions,
        getAndSetDownloadConditions,
        removeDownloadCondition,
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
