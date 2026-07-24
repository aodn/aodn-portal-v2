/**
 * RTK Query definitions for the OGC backend — the modern replacement for
 * hand-written fetch thunks. Each endpoint gets caching, in-flight
 * dedupe and abort for free; hooks (useXxxQuery) also get polling.
 *
 * The HTTP work is delegated to the request functions in @/app/api, so
 * URLs, timeouts and error normalization live in one place only.
 *
 * Components either use the generated hooks (useGetHealthQuery) or the
 * fetchXxx action creators below, which keep the familiar
 * `dispatch(fetchXxx(arg)).unwrap()` call style.
 */
import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig } from "axios";
import { FeatureCollection, Point } from "geojson";
import { ogcAxiosWithRetry, normalizeHttpError } from "@/app/api/httpClient";
import * as searchApi from "@/app/api/search";
import * as datasetApi from "@/app/api/dataset";
import * as geoserverApi from "@/app/api/geoserver";
import * as downloadApi from "@/app/api/download";
import { Health } from "@/app/api/healthTypes";
import { OGCCollection } from "@/app/api/ogcCollectionTypes";
import { CloudOptimizedFeature } from "@/app/api/cloudOptimizedTypes";
import {
  MapFeatureRequest,
  MapFeatureResponse,
  GeoserverFieldsResponse,
  MapLayerResponse,
  DownloadLayersResponse,
} from "@/app/api/geoserverTypes";
import type { DatasetMetadata } from "@/app/api/dataset";
import {
  SearchParameters,
  SuggesterParameters,
} from "@/app/api/searchQueryBuilder";
import type { Vocab } from "@/app/store/searchParamsReducer";
import { DatasetDownloadRequest } from "@/pages/detail-page/context/DownloadDefinitions";

// Fallback base query reusing the shared axios client; the endpoints
// below use queryFn + @/app/api functions, but createApi requires one.
const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig, unknown, unknown> =>
  async (requestConfig, { signal }) => {
    try {
      const response = await ogcAxiosWithRetry.request({
        ...requestConfig,
        signal,
      });
      return { data: response.data };
    } catch (error) {
      return { error: normalizeHttpError(error) };
    }
  };

// Adapts an @/app/api request function into an RTK Query queryFn.
const fromApi =
  <Arg, Result>(request: (arg: Arg, signal?: AbortSignal) => Promise<Result>) =>
  async (arg: Arg, { signal }: { signal: AbortSignal }) => {
    try {
      return { data: await request(arg, signal) };
    } catch (error) {
      return { error };
    }
  };

export const ogcApi = createApi({
  reducerPath: "ogcApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    // ----- system -----
    getHealth: builder.query<Health, void>({
      query: () => ({ url: "/ogc/manage/health" }),
    }),

    // ----- search -----
    getCollections: builder.query<string, SearchParameters>({
      queryFn: fromApi((param, signal) =>
        searchApi.getCollections(param, signal)
      ),
    }),
    getCollectionById: builder.query<OGCCollection, string>({
      queryFn: fromApi((id: string) => searchApi.getCollectionById(id)),
    }),
    getAutocomplete: builder.query<any, SuggesterParameters>({
      queryFn: fromApi((params: SuggesterParameters) =>
        searchApi.getAutocomplete(params)
      ),
    }),
    getParameterVocabs: builder.query<Array<Vocab>, void>({
      queryFn: fromApi(() => searchApi.getParameterVocabs()),
    }),

    // ----- dataset -----
    getDatasetMetadata: builder.query<DatasetMetadata, string>({
      queryFn: fromApi((id: string) => datasetApi.getDatasetMetadata(id)),
    }),
    getFeatureSummary: builder.query<
      FeatureCollection<Point, CloudOptimizedFeature>,
      string
    >({
      queryFn: fromApi((id: string) => datasetApi.getFeatureSummary(id)),
    }),

    // ----- geoserver -----
    getWmsMapFeature: builder.query<MapFeatureResponse, MapFeatureRequest>({
      queryFn: fromApi(geoserverApi.getWmsMapFeature),
    }),
    getWmsFields: builder.query<
      Array<GeoserverFieldsResponse>,
      MapFeatureRequest
    >({
      queryFn: fromApi(geoserverApi.getWmsFields),
    }),
    getWfsFieldValues: builder.query<
      Record<string, Array<object>>,
      MapFeatureRequest
    >({
      queryFn: fromApi(geoserverApi.getWfsFieldValues),
    }),
    getWmsLayers: builder.query<Array<MapLayerResponse>, MapFeatureRequest>({
      queryFn: fromApi(geoserverApi.getWmsLayers),
    }),
    getWfsLayers: builder.query<
      Array<DownloadLayersResponse>,
      MapFeatureRequest
    >({
      queryFn: fromApi(geoserverApi.getWfsLayers),
    }),

    // ----- download (plain POST; the SSE streams stay as thunks) -----
    postDatasetDownload: builder.mutation<any, DatasetDownloadRequest>({
      queryFn: fromApi((request: DatasetDownloadRequest) =>
        downloadApi.postDatasetDownload(request)
      ),
    }),
  }),
});

export const { useGetHealthQuery } = ogcApi;

// One-shot fetch options: dedupe in-flight requests and reuse a fresh
// cache entry, but do not keep a subscription open (the entry is dropped
// after the default keepUnusedDataFor once unused).
const ONE_SHOT = { subscribe: false } as const;

// Action creators with the familiar dispatch(fetchXxx(arg)).unwrap()
// interface. The returned object also provides .abort().
export const fetchResultNoStore = (param: SearchParameters) =>
  // Search results change often — always hit the network like the old thunk
  ogcApi.endpoints.getCollections.initiate(param, {
    ...ONE_SHOT,
    forceRefetch: true,
  });

export const fetchResultByUuidNoStore = (uuid: string) =>
  ogcApi.endpoints.getCollectionById.initiate(uuid, ONE_SHOT);

export const fetchSuggesterOptions = (params: SuggesterParameters) =>
  ogcApi.endpoints.getAutocomplete.initiate(params, ONE_SHOT);

export const fetchParameterVocabs = () =>
  ogcApi.endpoints.getParameterVocabs.initiate(undefined, ONE_SHOT);

export const fetchDatasetMetadataByUuid = (uuid: string) =>
  ogcApi.endpoints.getDatasetMetadata.initiate(uuid, ONE_SHOT);

export const fetchFeaturesByUuid = (uuid: string) =>
  ogcApi.endpoints.getFeatureSummary.initiate(uuid, ONE_SHOT);

export const fetchGeoServerMapFeature = (request: MapFeatureRequest) =>
  ogcApi.endpoints.getWmsMapFeature.initiate(request, ONE_SHOT);

export const fetchGeoServerMapFields = (request: MapFeatureRequest) =>
  ogcApi.endpoints.getWmsFields.initiate(request, ONE_SHOT);

export const fetchGeoServerFieldValues = (request: MapFeatureRequest) =>
  ogcApi.endpoints.getWfsFieldValues.initiate(request, ONE_SHOT);

export const fetchGeoServerMapLayers = (request: MapFeatureRequest) =>
  ogcApi.endpoints.getWmsLayers.initiate(request, ONE_SHOT);

export const fetchGeoServerDownloadLayers = (request: MapFeatureRequest) =>
  ogcApi.endpoints.getWfsLayers.initiate(request, ONE_SHOT);

export const processDatasetDownload = (request: DatasetDownloadRequest) =>
  ogcApi.endpoints.postDatasetDownload.initiate(request);
