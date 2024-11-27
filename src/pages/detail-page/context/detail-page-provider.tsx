import { useLocation } from "react-router-dom";
import { FC, ReactNode, useEffect, useState } from "react";
import {
  fetchFeaturesByUuid,
  fetchResultByUuidNoStore,
} from "../../../components/common/store/searchReducer";
import { DetailPageContext, SpatialExtentPhoto } from "./detail-page-context";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { useAppDispatch } from "../../../components/common/store/hooks";
import { HttpStatusCode } from "axios";
import { FeatureCollection, Point } from "geojson";
import {
  DownloadConditionType,
  IDownloadCondition,
} from "./DownloadDefinitions";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import DrawRectangle from "../../../components/map/mapbox/controls/CustomizedControls/DrawRectangle";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const mapDraw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
  defaultMode: "draw_polygon",
  modes: {
    ...MapboxDraw.modes,
    draw_rectangle: DrawRectangle,
  },
});

interface DetailPageProviderProps {
  children: ReactNode;
}

export const DetailPageProvider: FC<DetailPageProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
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
  const setDownloadConditions = (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => {
    _setDownloadConditions((prev) => {
      return prev
        .filter((condition) => condition.type !== type)
        .concat(conditions);
    });
  };
  const deleteDownloadConditionBy = (id: string) => {
    _setDownloadConditions((prev) => {
      return prev.filter((condition) => condition.id !== id);
    });
    mapDraw.delete(id);
  };

  const [photos, setPhotos] = useState<SpatialExtentPhoto[]>([]);
  const [extentsPhotos, setExtentsPhotos] = useState<SpatialExtentPhoto[]>([]);
  const [photoHovered, setPhotoHovered] = useState<SpatialExtentPhoto>();
  const [photoSelected, setPhotoSelected] = useState<SpatialExtentPhoto>();
  const [hasSnapshotsFinished, setHasSnapshotsFinished] =
    useState<boolean>(false);

  const extentsLength = collection?.extent?.bbox?.length;
  useEffect(() => {
    if (photos.length === extentsLength) {
      setHasSnapshotsFinished(true);
      if (photos.length === 1) return;
      setExtentsPhotos(photos.slice(1, extentsLength));
    }
  }, [extentsLength, hasSnapshotsFinished, photos, photos.length]);

  useEffect(() => {
    const uuid = new URLSearchParams(location.search).get("uuid");
    if (!uuid) return;
    dispatch(fetchResultByUuidNoStore(uuid))
      .unwrap()
      .then((collection) => {
        setCollection(collection);
        setIsCollectionNotFound(false);
      })
      .catch((error) => {
        if (error.statusCode && error.statusCode === HttpStatusCode.NotFound) {
          setIsCollectionNotFound(true);
        }
      });
  }, [dispatch, location.search]);

  useEffect(() => {
    const uuid = new URLSearchParams(location.search).get("uuid");
    if (!uuid) return;
    dispatch(fetchFeaturesByUuid(uuid))
      .unwrap()
      .then((features) => {
        setFeatures(features);
      });
  }, [dispatch, location.search]);

  return (
    <DetailPageContext.Provider
      value={{
        collection,
        setCollection,
        features,
        isCollectionNotFound,
        downloadConditions,
        setDownloadConditions,
        deleteDownloadConditionBy,
        mapDraw,
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
      }}
    >
      {children}
    </DetailPageContext.Provider>
  );
};
