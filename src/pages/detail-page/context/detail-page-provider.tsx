import { useParams } from "react-router-dom";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import {
  fetchFeaturesByUuid,
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

interface DetailPageProviderProps {
  children: ReactNode;
}

export const DetailPageProvider: FC<DetailPageProviderProps> = ({
  children,
}) => {
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
  }, [dispatch, uuid]);

  useEffect(() => {
    if (!uuid) return;
    dispatch(fetchFeaturesByUuid(uuid))
      .unwrap()
      .then((features) => {
        setFeatures(features);
      });
  }, [dispatch, uuid]);

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
      }}
    >
      {children}
    </DetailPageContext.Provider>
  );
};
