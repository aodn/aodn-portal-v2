import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { OGCCollection } from "../../../components/common/store/searchReducer";

export interface SpatialExtentPhoto {
  bbox: number[];
  url: string;
}
interface DetailPageContextType {
  collection: OGCCollection | undefined;
  setCollection: Dispatch<SetStateAction<OGCCollection | undefined>>;
  photos: SpatialExtentPhoto[];
  setPhotos: Dispatch<SetStateAction<SpatialExtentPhoto[]>>;
}

const DetailPageContextDefault = {
  collection: {} as OGCCollection | undefined,
  setCollection: () => {},
  photos: [] as SpatialExtentPhoto[],
  setPhotos: () => {},
};

export const DetailPageContext = createContext<DetailPageContextType>(
  DetailPageContextDefault
);

export const useDetailPageContext = () => useContext(DetailPageContext);
