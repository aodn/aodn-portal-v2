import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { FeatureCollection, Point } from "geojson";
import {
  DownloadConditionType,
  IDownloadCondition,
} from "./DownloadDefinitions";

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
};

export const DetailPageContext = createContext<DetailPageContextType>(
  DetailPageContextDefault
);

export const useDetailPageContext = () => useContext(DetailPageContext);
