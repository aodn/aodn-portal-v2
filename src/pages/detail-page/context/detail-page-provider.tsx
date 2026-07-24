import { useParams } from "react-router-dom";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DatasetMetadata } from "@/app/api/dataset";
import { DetailPageContext } from "./detail-page-context";
import { OGCCollection } from "@/app/api/ogcCollectionTypes";
import { useAppDispatch } from "@/app/store/hooks";
import { FeatureCollection, Point } from "geojson";
import {
  DownloadConditionType,
  DownloadServiceType,
  IDownloadCondition,
} from "./DownloadDefinitions";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { AnalyticsEvent } from "../../../analytics/analyticsEvents";
import { trackCustomEvent } from "../../../analytics/customEventTracker";
import {
  LayerName,
  LayerSwitcherLayer,
} from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import { CloudOptimizedFeature } from "@/app/api/cloudOptimizedTypes";
import * as datasetApi from "@/app/api/dataset";
import * as searchApi from "@/app/api/search";

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
  const [features, setFeatures] = useState<
    FeatureCollection<Point, CloudOptimizedFeature> | undefined
  >(undefined);
  const [datasetMetadata, setDatasetMetadata] = useState<
    DatasetMetadata | undefined
  >(undefined);
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
    searchApi
      .getCollectionById(uuid)

      .then((collection) => {
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
        console.log("Error fetching collection by UUID:", error);
        setIsCollectionNotFound(true);
      });
  }, [dispatch, uuid]);

  useEffect(() => {
    if (!uuid) return;
    datasetApi
      .getFeatureSummary(uuid)

      .then((features) => {
        setFeatures(features);
      });
  }, [dispatch, uuid]);

  useEffect(() => {
    if (!uuid) return;
    datasetApi
      .getDatasetMetadata(uuid)

      .then((metadata) => {
        setDatasetMetadata(metadata);
      })
      .catch((error) => {
        console.log("Error fetching dataset metadata by UUID:", error);
        setDatasetMetadata(undefined);
      });
  }, [dispatch, uuid]);

  // PMTiles layer is supported when the dataset_metadata endpoint returns at least
  // one parquet dataset
  // TODO: This is a temporary solution until the backend provides a more reliable
  // way to determine PMTiles support. Before that shall we use the CO keys in Collection?
  const isSupportPMTiles = useMemo<boolean>(() => {
    if (!datasetMetadata) return false;
    return Object.keys(datasetMetadata).some((key) => key.endsWith(".parquet"));
  }, [datasetMetadata]);

  return (
    <DetailPageContext.Provider
      value={{
        collection,
        setCollection,
        featureCollection: features,
        datasetMetadata,
        isSupportPMTiles,
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
      }}
    >
      {children}
    </DetailPageContext.Provider>
  );
};
