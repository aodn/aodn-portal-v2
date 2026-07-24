/**
 * Per-dataset data requests: dataset metadata and the cloud-optimized
 * feature summary used by charts and the time slider.
 *
 * Naming: a "collection" (see ogcCollectionTypes.ts) is the catalogue
 * record — title, description, bbox — i.e. what search results show.
 * A "dataset" is the real data behind that record. These endpoints take
 * a collection id and return information about its underlying dataset;
 * the file is named after the backend endpoint (`dataset_metadata`).
 *
 * Every function returns response data and throws a normalized
 * ErrorResponse on HTTP failure.
 */
import { FeatureCollection, Point } from "geojson";
import dayjs from "dayjs";
import { ogcAxiosWithRetry, toErrorResponse } from "./httpClient";
import { CloudOptimizedFeature } from "@/app/api/cloudOptimizedTypes";
import { dateDefault } from "@/components/common/constants";

export interface DatasetMetadataItem {
  uuid: string;
  dname: string;
  lat?: Record<string, unknown>;
  lng?: Record<string, unknown>;
  depth?: Record<string, unknown>;
}

export type DatasetMetadata = Record<string, DatasetMetadataItem>;

export const getDatasetMetadata = (id: string) =>
  ogcAxiosWithRetry
    .get(`/ogc/collections/${id}/items/dataset_metadata`)
    .then((response) => response.data)
    .catch(toErrorResponse);

export const getFeatureSummary = (
  id: string
): Promise<FeatureCollection<Point, CloudOptimizedFeature>> =>
  ogcAxiosWithRetry
    .get<FeatureCollection<Point>>(`/ogc/collections/${id}/items/summary`)
    .then((response) => ({
      ...response.data,
      features: (response.data?.features || []).map((feature: any) => ({
        ...feature,
        properties: {
          ...feature.properties,
          timestamp: dayjs(
            feature.properties?.date,
            [dateDefault.DATE_YEAR_MONTH_FORMAT, dateDefault.DATE_FORMAT],
            true
          ).valueOf(),
        },
      })),
    }))
    .catch(toErrorResponse);
