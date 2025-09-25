import { useLocation, useParams } from "react-router-dom";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import {
  fetchFeaturesByUuid,
  fetchResultByUuidNoStore,
} from "../../../components/common/store/searchReducer";
import { DetailPageContext, SpatialExtentPhoto } from "./detail-page-context";
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

  const [photos, setPhotos] = useState<SpatialExtentPhoto[]>([]);
  const [extentsPhotos, setExtentsPhotos] = useState<SpatialExtentPhoto[]>([]);
  const [photoHovered, setPhotoHovered] = useState<SpatialExtentPhoto>();
  const [photoSelected, setPhotoSelected] = useState<SpatialExtentPhoto>();
  const [hasSnapshotsFinished, setHasSnapshotsFinished] =
    useState<boolean>(false);

  const extentsLength = collection?.getBBox()?.length;
  useEffect(() => {
    if (photos.length === extentsLength) {
      setHasSnapshotsFinished(true);
      if (photos.length === 1) return;
      setExtentsPhotos(photos.slice(1, extentsLength));
    }
  }, [extentsLength, hasSnapshotsFinished, photos, photos.length]);

  useEffect(() => {
    if (!uuid) return;
    dispatch(fetchResultByUuidNoStore(uuid))
      .unwrap()
      .then((collection) => {
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
        photos,
        setPhotos,
        extentsPhotos,
        setExtentsPhotos,
        photoHovered,
        setPhotoHovered,
        photoSelected,
        setPhotoSelected,
        hasSnapshotsFinished,
        setHasSnapshotsFinished,
        checkIfCopied,
        copyToClipboard,
      }}
    >
      {children}
    </DetailPageContext.Provider>
  );
};
