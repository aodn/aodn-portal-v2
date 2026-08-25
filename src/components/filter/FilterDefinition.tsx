// Put common item here to avoid circular reference
import { Dispatch, ElementType, SetStateAction } from "react";
import { Vocab } from "@/app/store/componentParamReducer";
import { DatasetFrequency, DatasetStatus } from "@/app/store/datasetEnums";

export enum IndexDataType {
  CLOUD = "cloud",
}

export interface ItemButton {
  value: DatasetFrequency | IndexDataType | string;
  label: string;
  icon?: ElementType;
}

export interface FilterValues {
  parameterVocabs?: Array<Vocab>;
  platform?: Array<string>;
  organisation?: Array<string>;
  dataDeliveryFrequency?: Array<DatasetFrequency> | undefined;
  dataDeliveryMode?: Array<string>;
  dataStatus?: Array<DatasetStatus> | undefined;
  dataIndexedType?: Array<IndexDataType>;
  excludeDocument?: Array<string>;
  dataService?: Array<string>;
}

export interface TabFilterType {
  filters: FilterValues;
  setFilters: Dispatch<SetStateAction<FilterValues>>;
}
