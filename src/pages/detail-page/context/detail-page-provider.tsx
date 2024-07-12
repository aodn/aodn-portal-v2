import { useLocation } from "react-router-dom";
import { AppDispatch } from "../../../components/common/store/store";
import { useDispatch } from "react-redux";
import { FC, ReactNode, useEffect, useState } from "react";
import {
  fetchResultByUuidNoStore,
  OGCCollection,
} from "../../../components/common/store/searchReducer";
import { DetailPageContext, SpatialExtentPhoto } from "./detail-page-context";

interface DetailPageProviderProps {
  children: ReactNode;
}

export const DetailPageProvider: FC<DetailPageProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [collection, setCollection] = useState<OGCCollection | undefined>(
    undefined
  );
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
      });
  }, [dispatch, location.search]);

  return (
    <DetailPageContext.Provider
      value={{
        collection,
        setCollection,
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
