import { useLocation } from "react-router-dom";
import { FC, ReactNode, useEffect, useState } from "react";
import { fetchResultByUuidNoStore } from "../../../components/common/store/searchReducer";
import { DetailPageContext, SpatialExtentPhoto } from "./detail-page-context";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { useAppDispatch } from "../../../components/common/store/hooks";
import { HttpStatusCode } from "axios";

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
  const [isCollectionNotFound, setIsCollectionNotFound] =
    useState<boolean>(false);
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

  return (
    <DetailPageContext.Provider
      value={{
        collection,
        setCollection,
        isCollectionNotFound,
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
