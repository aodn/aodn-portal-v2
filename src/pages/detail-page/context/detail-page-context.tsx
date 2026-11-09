import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
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

export interface DetailPageContextType {
  collection: OGCCollection | undefined;
  setCollection: Dispatch<SetStateAction<OGCCollection | undefined>>;
  isCollectionNotFound: boolean;
  isTemporaryError: boolean;
  downloadConditions: IDownloadCondition[];
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
  removeDownloadCondition: (condition: IDownloadCondition) => void;
  clearDownloadConditions: (types: DownloadConditionType[]) => void;
  selectedWmsLayer: string;
  setSelectedWmsLayer: Dispatch<SetStateAction<string>>;
  selectedCoKey: string;
  /**
   * Select a dataset. A real change (from a non-empty, different key) clears
   * the DATE_RANGE condition and bumps `selectionGeneration`.
   */
  setSelectedCoKey: (key: string) => void;
  /** Incremented on every real dataset change. */
  selectionGeneration: number;
  /** False when `generation` was captured before a later dataset change. */
  isCurrentSelectionGeneration: (generation: number) => boolean;
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
  isCollectionNotFound: false,
  isTemporaryError: false,
  downloadConditions: [],
  getAndSetDownloadConditions: () => [],
  removeDownloadCondition: () => {},
  clearDownloadConditions: () => {},
  selectedWmsLayer: "",
  setSelectedWmsLayer: () => {},
  selectedCoKey: "",
  setSelectedCoKey: () => {},
  selectionGeneration: 0,
  isCurrentSelectionGeneration: () => true,
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
