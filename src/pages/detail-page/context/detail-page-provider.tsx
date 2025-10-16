import { useLocation, useParams } from "react-router-dom";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import {
  fetchFeaturesByUuid,
  fetchGeoServerMapFields,
  fetchGeoServerMapLayers,
  fetchResultByUuidNoStore,
} from "../../../components/common/store/searchReducer";
import { DetailPageContext } from "./detail-page-context";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { useAppDispatch } from "../../../components/common/store/hooks";
import { FeatureCollection, Point } from "geojson";
import {
  DownloadConditionType,
  IDownloadCondition,
} from "./DownloadDefinitions";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import useClipboard from "../../../hooks/useClipboard";
import {
  MapFeatureRequest,
  MapFieldResponse,
  MapLayerResponse,
} from "../../../components/common/store/GeoserverDefinitions";
import { ErrorResponse } from "../../../utils/ErrorBoundary";

interface DetailPageProviderProps {
  children: ReactNode;
}

const GEOSERVER_LOADING_MESSAGES = {
  initial: "Initializing map...",
  fetching_layers: "Fetching available map layers...",
  failure: "No Map Preview Available",
};

const getWMSLayerNames = (collection: OGCCollection | undefined) => {
  const layerNames = collection?.getWMSLinks()?.map((link) => link.title);
  return layerNames && layerNames.length > 0 ? layerNames : [];
};

export const DetailPageProvider: FC<DetailPageProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const { uuid } = useParams();
  const dispatch = useAppDispatch();
  const { checkIfCopied, copyToClipboard } = useClipboard();
  const [collection, setCollection] = useState<OGCCollection | undefined>(
    undefined
  );
  const [features, setFeatures] = useState<
    FeatureCollection<Point> | undefined
  >(undefined);
  const [isCollectionNotFound, setIsCollectionNotFound] =
    useState<boolean>(false);
  const [downloadConditions, _setDownloadConditions] = useState<
    IDownloadCondition[]
  >([]);
  const [wmsLayers, setMwsLayers] = useState<MapLayerResponse[]>([]);
  const [wmsFields, setWmsFields] = useState<MapFieldResponse[]>([]);
  const [isLoadingWmsLayer, setIsLoadingWmsLayer] = useState<boolean>(true);
  const [geoServerLoadingMessage, setGeoServerLoadingMessage] =
    useState<string>("");

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
    dispatch(fetchResultByUuidNoStore(uuid))
      .unwrap()
      .then((collection) => {
        if (!collection) {
          setIsCollectionNotFound(true);
          return;
        }
        setCollection(collection);
        setIsCollectionNotFound(false);
      })
      .catch((error) => {
        console.log("Error fetching collection by UUID:", error);
        setIsCollectionNotFound(true);
      });
  }, [dispatch, location.search, uuid]);

  useEffect(() => {
    if (!uuid) return;
    dispatch(fetchFeaturesByUuid(uuid))
      .unwrap()
      .then((features) => {
        setFeatures(features);
      });
  }, [dispatch, location.search, uuid]);

  // call wms_download_fields first to get wms selector fields
  // if it doesn't work that means the wms link is invalid (invalid server url or layerName)
  // in this case we will call wms_layers to get all the possible layers
  // once get the all the layers we will use the correct layerName to for wms_download_fields, wms_map_tile and wms_map_feature
  useEffect(() => {
    if (!uuid) return;

    const layerName = getWMSLayerNames(collection)?.[0] || "";

    const fieldRequest: MapFeatureRequest = {
      uuid: uuid,
      layerName: layerName,
    };

    dispatch(fetchGeoServerMapFields(fieldRequest))
      .unwrap()
      .then((fields) => {
        setWmsFields(fields);
        setIsLoadingWmsLayer(false);
      })
      .catch((error: ErrorResponse) => {
        console.log("error fetching fields, error:", error.statusCode);
        // For now only catch 404 error for further fetching layers
        // TODO: we could fetch layers even there is no error to find all wms layers that support wfs download
        if (error.statusCode === 404) {
          console.log("Failed to fetch fields, fetching layers instead", error);

          const layerRequest: MapFeatureRequest = {
            uuid: uuid,
          };

          dispatch(fetchGeoServerMapLayers(layerRequest))
            .unwrap()
            .then((layers) => {
              setMwsLayers(layers);
              setIsLoadingWmsLayer(false);
            })
            .catch((layerError) => {
              console.error("Failed to fetch layers", layerError);
            });
        } else {
          console.error("Failed to fetch fields", error);
        }
      });
  }, [collection, dispatch, uuid]);

  // console.log("wms fields", wmsFields);
  // console.log("wms layers", wmsLayers);
  // console.log("is loading wms layer", isLoadingWmsLayer);

  return (
    <DetailPageContext.Provider
      value={{
        collection,
        setCollection,
        featureCollection: features,
        isCollectionNotFound,
        downloadConditions,
        getAndSetDownloadConditions,
        removeDownloadCondition,
        checkIfCopied,
        copyToClipboard,
        wmsFields,
        wmsLayers,
        isLoadingWmsLayer,
      }}
    >
      {children}
    </DetailPageContext.Provider>
  );
};
