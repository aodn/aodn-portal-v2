import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { FeatureCollection, Point } from "geojson";
import {
  defaultMapSubsettingCapabilities,
  DownloadConditionType,
  DownloadServiceType,
  IDownloadCondition,
  MapSubsettingCapabilities,
  SubsettingType,
} from "./DownloadDefinitions";
import {
  LayerName,
  LayerSwitcherLayer,
} from "@/components/map/mapbox/controls/menu/MapLayerSwitcher";
import { CloudOptimizedFeature } from "@/app/store/CloudOptimizedDefinitions";
import { DatasetMetadata } from "@/app/store/searchReducer";

export interface DetailPageContextType {
  collection: OGCCollection | undefined;
  setCollection: Dispatch<SetStateAction<OGCCollection | undefined>>;
  featureCollection:
    | FeatureCollection<Point, CloudOptimizedFeature>
    | undefined;
  datasetMetadata: DatasetMetadata | undefined;
  isSupportPMTiles: boolean;
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
  /** Live map-layer subsetting capabilities (published by MapPanel). */
  mapSubsettingCapabilities: MapSubsettingCapabilities;
  setMapSubsettingCapabilities: Dispatch<
    SetStateAction<MapSubsettingCapabilities>
  >;
  /** Layer-aware support check shared by map menu and download subsetting UI. */
  isSubsettingSupported: (type: SubsettingType) => boolean;
}

const DetailPageContextDefault: DetailPageContextType = {
  collection: {} as OGCCollection | undefined,
  setCollection: () => {},
  featureCollection: {} as
    | FeatureCollection<Point, CloudOptimizedFeature>
    | undefined,
  datasetMetadata: undefined,
  isSupportPMTiles: false,
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
  mapSubsettingCapabilities: defaultMapSubsettingCapabilities,
  setMapSubsettingCapabilities: () => {},
  isSubsettingSupported: () => false,
};

const DetailPageContext = createContext<DetailPageContextType>(
  DetailPageContextDefault
);

const useDetailPageContext = () => useContext(DetailPageContext);

export { DetailPageContextDefault, DetailPageContext, useDetailPageContext };
