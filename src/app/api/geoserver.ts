/**
 * Geoserver-backed map item requests.
 *
 * Read (GET), all under /ogc/collections/{uuid}/items/:
 *   getWmsMapFeature(req)    .../wms_map_feature
 *   getWmsFields(req)        .../wms_fields
 *   getWfsFieldValues(req)   .../wfs_field_value
 *   getWmsLayers(req)        .../wms_layers
 *   getWfsLayers(req)        .../wfs_layers
 *
 * All five share the same request shape, so they are generated from one
 * template. Every function returns response data and throws a
 * normalized ErrorResponse on HTTP failure. Optional AbortSignal.
 */
import { ogcAxiosWithRetry, TIMEOUT, toErrorResponse } from "./httpClient";
import {
  MapFeatureRequest,
  MapFeatureResponse,
  GeoserverFieldsResponse,
  MapLayerResponse,
  DownloadLayersResponse,
} from "@/app/api/geoserverTypes";

const geoserverItemQuery =
  <R>(item: string) =>
  (request: MapFeatureRequest, signal?: AbortSignal): Promise<R> =>
    ogcAxiosWithRetry
      .get<R>(`/ogc/collections/${request.uuid}/items/${item}`, {
        params: request,
        timeout: TIMEOUT,
        signal,
      })
      .then((response) => response.data)
      .catch(toErrorResponse);

export const getWmsMapFeature =
  geoserverItemQuery<MapFeatureResponse>("wms_map_feature");
export const getWmsFields =
  geoserverItemQuery<Array<GeoserverFieldsResponse>>("wms_fields");
export const getWfsFieldValues =
  geoserverItemQuery<Record<string, Array<object>>>("wfs_field_value");
export const getWmsLayers =
  geoserverItemQuery<Array<MapLayerResponse>>("wms_layers");
export const getWfsLayers =
  geoserverItemQuery<Array<DownloadLayersResponse>>("wfs_layers");
