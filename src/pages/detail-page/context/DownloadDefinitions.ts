import { BBox, MultiPolygon } from "geojson";

export enum DownloadConditionType {
  BBOX = "bbox",
  DATE_RANGE = "date_range",
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
    recipient: string;
    start_date: string;
    end_date: string;
    multi_polygon: MultiPolygon;
    // TODO: will support form submition later. currently only for frontend
    data_usage?: {
      purposes: string[];
      sectors: string[];
      allow_contact: boolean;
    };
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
