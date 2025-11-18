import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { FeatureCollection, Point } from "geojson";
import {
  DownloadConditionType,
  IDownloadCondition,
} from "./DownloadDefinitions";
import { LayerName } from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";

interface DetailPageContextType {
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
  copyToClipboard: (text: string, referenceId?: string) => Promise<void>;
  checkIfCopied: (text: string, referenceId?: string) => boolean;
  selectedWmsLayer: string;
  setSelectedWmsLayer: Dispatch<SetStateAction<string>>;
  selectedMapLayer: LayerName | undefined;
  setSelectedMapLayer: Dispatch<SetStateAction<LayerName | undefined>>;
}

const DetailPageContextDefault = {
  collection: {} as OGCCollection | undefined,
  setCollection: () => {},
  featureCollection: {} as FeatureCollection<Point> | undefined,
  isCollectionNotFound: false,
  downloadConditions: [],
  getAndSetDownloadConditions: () => [],
  removeDownloadCondition: () => {},
  checkIfCopied: () => false,
  copyToClipboard: async () => {},
  selectedWmsLayer: "",
  setSelectedWmsLayer: () => {},
  selectedMapLayer: undefined,
  setSelectedMapLayer: () => {},
};

export const DetailPageContext = createContext<DetailPageContextType>(
  DetailPageContextDefault
);

export const useDetailPageContext = () => useContext(DetailPageContext);
