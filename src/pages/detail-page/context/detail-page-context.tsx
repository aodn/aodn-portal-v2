import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { FeatureCollection, Point } from "geojson";
import {
  DownloadConditionType,
  IDownloadCondition,
} from "./DownloadDefinitions";
import {
  LayerName,
  LayerSwitcherLayer,
} from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";

export interface DetailPageContextType {
  collection: OGCCollection | undefined;
  setCollection: Dispatch<SetStateAction<OGCCollection | undefined>>;
  featureCollection: FeatureCollection<Point> | undefined;
  isCollectionNotFound: boolean;
  downloadConditions: IDownloadCondition[];
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
  removeDownloadCondition: (condition: IDownloadCondition) => void;
  selectedWmsLayer: string;
  setSelectedWmsLayer: Dispatch<SetStateAction<string>>;
  lastSelectedMapLayer: LayerSwitcherLayer<LayerName> | null;
  setLastSelectedMapLayer: Dispatch<
    SetStateAction<LayerSwitcherLayer<LayerName> | null>
  >;
}

const DetailPageContextDefault = {
  collection: {} as OGCCollection | undefined,
  setCollection: () => {},
  featureCollection: {} as FeatureCollection<Point> | undefined,
  isCollectionNotFound: false,
  downloadConditions: [],
  getAndSetDownloadConditions: () => [],
  removeDownloadCondition: () => {},
  selectedWmsLayer: "",
  setSelectedWmsLayer: () => {},
  lastSelectedMapLayer: null,
  setLastSelectedMapLayer: () => {},
};

const DetailPageContext = createContext<DetailPageContextType>(
  DetailPageContextDefault
);

const useDetailPageContext = () => useContext(DetailPageContext);

export { DetailPageContextDefault, DetailPageContext, useDetailPageContext };
