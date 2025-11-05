import {
  BBoxCondition,
  DateRangeCondition,
  DownloadConditionType,
  FormatCondition,
  IDownloadCondition,
} from "../pages/detail-page/context/DownloadDefinitions";
import { MultiPolygon } from "geojson";
import { combineBBoxesToMultiPolygon } from "./GeoJsonUtils";

export const getDateConditionFrom = (
  conditions: IDownloadCondition[]
): DateRangeCondition => {
  const filteredCondition = conditions.filter(
    (condition) => condition.type === DownloadConditionType.DATE_RANGE
  );
  if (filteredCondition.length > 1) {
    throw new Error("Multiple date range conditions found");
  }
  if (filteredCondition.length === 1) {
    return filteredCondition[0] as DateRangeCondition;
  }
  // if no date range condition found, return null for both start and end date.
  // So backends can exclude date range in the notification emails
  return new DateRangeCondition("defaultid", "non-specified", "non-specified");
};

export const getMultiPolygonFrom = (
  conditions: IDownloadCondition[]
): MultiPolygon | string => {
  const filteredCondition = conditions.filter(
    (condition) => condition.type === DownloadConditionType.BBOX
  );
  // if no bbox condition found, return the whole world
  if (filteredCondition.length === 0) {
    return "non-specified";
  }

  const bboxes: [number, number, number, number][] = filteredCondition.map(
    (condition) => {
      const bbox = (condition as BBoxCondition).bbox;
      if (bbox.length !== 4) {
        throw new Error("Invalid bounding box");
      }
      return bbox;
    }
  );

  return combineBBoxesToMultiPolygon(bboxes);
};

export const getFormatFrom = (conditions: IDownloadCondition[]): string => {
  const filteredCondition = conditions.filter(
    (condition) => condition.type === DownloadConditionType.FORMAT
  );
  if (filteredCondition.length === 1) {
    return (filteredCondition[0] as FormatCondition).format;
  }
  if (filteredCondition.length > 1) {
    throw new Error("Multiple format conditions found");
  }
  return "";
};
