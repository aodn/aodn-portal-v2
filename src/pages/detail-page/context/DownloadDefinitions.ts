import { BBox } from "geojson";

export interface IDownloadCondition {
  type: DownloadConditionType;
}

export class ITimeRange implements IDownloadCondition {
  type: DownloadConditionType = DownloadConditionType.TIME_RANGE;
  start: string;
  end: string;

  constructor(start: string, end: string) {
    this.start = start;
    this.end = end;
  }
}

export class IBBox implements IDownloadCondition {
  type: DownloadConditionType = DownloadConditionType.BBOX;
  west: number;
  south: number;
  east: number;
  north: number;

  constructor(bbox: BBox) {
    this.west = bbox[0];
    this.south = bbox[1];
    this.east = bbox[2];
    this.north = bbox[3];
  }
}

export class DownloadConditions {
  private _conditions: IDownloadCondition[] = [];

  get conditions() {
    return this._conditions;
  }

  addCondition(condition: IDownloadCondition) {
    this._conditions.push(condition);
  }

  removeCondition(condition: IDownloadCondition) {
    this._conditions = this._conditions.filter((c) => c !== condition);
  }
}
