import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { FeatureCollection, Point } from "geojson";
import {
  DownloadConditionType,
  IDownloadCondition,
} from "./DownloadDefinitions";

export interface SpatialExtentPhoto {
  bbox: number[];
  url: string;
}
interface DetailPageContextType {
  collection: OGCCollection | undefined;
  setCollection: Dispatch<SetStateAction<OGCCollection | undefined>>;
  features: FeatureCollection<Point> | undefined;
  isCollectionNotFound: boolean;
  downloadConditions: IDownloadCondition[];
  setDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => void;
  photos: SpatialExtentPhoto[];
  setPhotos: Dispatch<SetStateAction<SpatialExtentPhoto[]>>;
  extentsPhotos: SpatialExtentPhoto[] | undefined;
  setExtentsPhotos: Dispatch<SetStateAction<SpatialExtentPhoto[]>>;
  photoHovered: SpatialExtentPhoto | undefined;
  setPhotoHovered: Dispatch<SetStateAction<SpatialExtentPhoto | undefined>>;
  photoSelected: SpatialExtentPhoto | undefined;
  setPhotoSelected: Dispatch<SetStateAction<SpatialExtentPhoto | undefined>>;
  hasSnapshotsFinished: boolean;
  setHasSnapshotsFinished: Dispatch<SetStateAction<boolean>>;
}

const DetailPageContextDefault = {
  collection: {} as OGCCollection | undefined,
  setCollection: () => {},
  features: {} as FeatureCollection<Point> | undefined,
  isCollectionNotFound: false,
  downloadConditions: [],
  setDownloadConditions: () => {},
  photos: [] as SpatialExtentPhoto[],
  setPhotos: () => {},
  extentsPhotos: [] as SpatialExtentPhoto[],
  setExtentsPhotos: () => {},
  photoHovered: {} as SpatialExtentPhoto,
  setPhotoHovered: () => {},
  photoSelected: {} as SpatialExtentPhoto,
  setPhotoSelected: () => {},
  hasSnapshotsFinished: false,
  setHasSnapshotsFinished: () => {},
};

export const DetailPageContext = createContext<DetailPageContextType>(
  DetailPageContextDefault
);

export const useDetailPageContext = () => useContext(DetailPageContext);
