import { BBox } from "geojson";

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

export class DateRangeCondition implements IDownloadCondition {
  type: DownloadConditionType = DownloadConditionType.DATE_RANGE;
  id: string;
  start: string;
  end: string;

  constructor(start: string, end: string, id: string) {
    this.id = id;
    this.start = start;
    this.end = end;
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
