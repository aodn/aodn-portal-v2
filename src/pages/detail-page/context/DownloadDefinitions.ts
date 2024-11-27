import { BBox } from "geojson";

export enum DownloadConditionType {
  BBOX = "bbox",
  TIME_RANGE = "time_range",
}

export interface IDownloadCondition {
  type: DownloadConditionType;
  id: string;
}

export class TimeRangeCondition implements IDownloadCondition {
  type: DownloadConditionType = DownloadConditionType.TIME_RANGE;
  id: string;
  start: string;
  end: string;

  constructor(start: string, end: string, id: string) {
    this.id = id;
    this.start = start;
    this.end = end;
  }
}

export class BBoxCondition implements IDownloadCondition {
  type: DownloadConditionType;
  bbox: BBox;
  id: string;

  constructor(bbox: BBox, id: string) {
    this.type = DownloadConditionType.BBOX;
    this.id = id;
    this.bbox = bbox;
  }
}
