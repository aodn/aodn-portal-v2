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
  console.log("photos", photos);

  useEffect(() => {
    const uuid = new URLSearchParams(location.search).get("uuid");
    if (!uuid) return;
    dispatch(fetchResultByUuidNoStore(uuid))
      .unwrap()
      .then((collection) => {
        setCollection(collection);
      });
  }, [dispatch, location.search]);

  console.log("collection", collection);
  return (
    <DetailPageContext.Provider
      value={{
        collection,
        setCollection,
        photos,
        setPhotos,
      }}
    >
      {children}
    </DetailPageContext.Provider>
  );
};
