// Put common item here to avoid circular reference
import { DatasetFrequency } from "../common/store/searchReducer";
import { ElementType } from "react";

export enum IndexDataType {
  CLOUD = "cloud",
}

export interface ItemButton {
  value: DatasetFrequency | IndexDataType | string;
  label: string;
  icon?: ElementType;
}
