import {
  BBoxCondition,
  DateRangeCondition,
  DownloadConditionType,
  IDownloadCondition,
} from "../pages/detail-page/context/DownloadDefinitions";
import { dateDefault } from "../components/common/constants";
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
  return new DateRangeCondition(
    "defaultid",
    dateDefault.min.getDate().toString(),
    dateDefault.max.getDate().toString()
  );
};

export const getMultiPolygonFrom = (
  conditions: IDownloadCondition[]
): MultiPolygon => {
  const filteredCondition = conditions.filter(
    (condition) => condition.type === DownloadConditionType.BBOX
  );
  // if no bbox condition found, return the whole world
  if (filteredCondition.length === 0) {
    return {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [-180, 90],
            [-180, -90],
            [180, -90],
            [180, 90],
            [-180, 90],
          ],
        ],
      ],
    };
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
