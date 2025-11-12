import { BBox, MultiPolygon } from "geojson";

export enum DownloadConditionType {
  BBOX = "bbox",
  DATE_RANGE = "date_range",
  FORMAT = "format",
  KEY = "key",
}

export interface IDownloadCondition {
  type: DownloadConditionType;
  id: string;
}

export interface IDownloadConditionCallback {
  removeCallback?: () => void;
}

// TODO: will support multi polygons later. currently only for 1 bbox
export interface DatasetDownloadRequest {
  inputs: {
    uuid: string;
    key: string;
    recipient: string;
    start_date: string;
    end_date: string;
    multi_polygon: MultiPolygon | string;
    format: string;
    data_usage?: {
      purposes: string[];
      sectors: string[];
      allow_contact: boolean | null;
    };
    collection_title?: string;
    full_metadata_link?: string;
    suggested_citation?: string;
  };
  outputs: object;
  subscriber: {
    successUri: string;
    inProgressUri: string;
    failedUri: string;
  };
}

export class DateRangeCondition
  implements IDownloadCondition, IDownloadConditionCallback
{
  type: DownloadConditionType = DownloadConditionType.DATE_RANGE;
  id: string;
  start: string;
  end: string;
  removeCallback?: () => void;

  constructor(
    id: string,
    start: string,
    end: string,
    removeCallback?: () => void
  ) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.removeCallback = removeCallback;
  }
}

export class BBoxCondition
  implements IDownloadCondition, IDownloadConditionCallback
{
  type: DownloadConditionType;
  bbox: BBox;
  id: string;
  removeCallback?: () => void;

  constructor(id: string, bbox: BBox, removeCallback?: () => void) {
    this.type = DownloadConditionType.BBOX;
    this.id = id;
    this.bbox = bbox;
    this.removeCallback = removeCallback;
  }
}

export class FormatCondition
  implements IDownloadCondition, IDownloadConditionCallback
{
  type: DownloadConditionType = DownloadConditionType.FORMAT;
  id: string;
  format: string;
  removeCallback?: () => void;

  constructor(id: string, format: string, removeCallback?: () => void) {
    this.id = id;
    this.format = format;
    this.removeCallback = removeCallback;
  }
}

export class KeyCondition
  implements IDownloadCondition, IDownloadConditionCallback
{
  type = DownloadConditionType.KEY;
  id: string;
  key: string;
  removeCallback?: () => void;

  constructor(id: string, key: string, removeCallback?: () => void) {
    this.id = id;
    this.key = key;
    this.removeCallback = removeCallback;
  }
}

export type WFSDownloadRequest = {
  uuid: string;
  layerName: string;
  downloadConditions: IDownloadCondition[];
};

export type DownloadCondition = {
  downloadConditions: IDownloadCondition[];
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
  removeDownloadCondition: (condition: IDownloadCondition) => void;
};
