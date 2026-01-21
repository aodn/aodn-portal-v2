import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { FeatureCollection, Point } from "geojson";
import {
  DownloadConditionType,
  DownloadServiceType,
  IDownloadCondition,
} from "./DownloadDefinitions";
import {
  LayerName,
  LayerSwitcherLayer,
} from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import { CloudOptimizedFeature } from "../../../components/common/store/CloudOptimizedDefinitions";

export interface DetailPageContextType {
  collection: OGCCollection | undefined;
  setCollection: Dispatch<SetStateAction<OGCCollection | undefined>>;
  featureCollection:
    | FeatureCollection<Point, CloudOptimizedFeature>
    | undefined;
  isCollectionNotFound: boolean;
  downloadConditions: IDownloadCondition[];
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
  removeDownloadCondition: (condition: IDownloadCondition) => void;
  selectedWmsLayer: string;
  setSelectedWmsLayer: Dispatch<SetStateAction<string>>;
  selectedCoKey: string;
  setSelectedCoKey: Dispatch<SetStateAction<string>>;
  lastSelectedMapLayer: LayerSwitcherLayer<LayerName> | null;
  setLastSelectedMapLayer: Dispatch<
    SetStateAction<LayerSwitcherLayer<LayerName> | null>
  >;
  downloadService: DownloadServiceType;
  setDownloadService: Dispatch<SetStateAction<DownloadServiceType>>;
}

const DetailPageContextDefault = {
  collection: {} as OGCCollection | undefined,
  setCollection: () => {},
  featureCollection: {} as
    | FeatureCollection<Point, CloudOptimizedFeature>
    | undefined,
  isCollectionNotFound: false,
  downloadConditions: [],
  getAndSetDownloadConditions: () => [],
  removeDownloadCondition: () => {},
  selectedWmsLayer: "",
  setSelectedWmsLayer: () => {},
  selectedCoKey: "",
  setSelectedCoKey: () => {},
  lastSelectedMapLayer: null,
  setLastSelectedMapLayer: () => {},
  downloadService: DownloadServiceType.Unavailable,
  setDownloadService: () => {},
};

const DetailPageContext = createContext<DetailPageContextType>(
  DetailPageContextDefault
);

const useDetailPageContext = () => useContext(DetailPageContext);

export { DetailPageContextDefault, DetailPageContext, useDetailPageContext };
