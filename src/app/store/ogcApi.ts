/**
 * RTK Query endpoints for the OGC backend. Declare an endpoint here and
 * a typed hook (useXxxQuery) is generated with caching, in-flight
 * dedupe, abort and polling built in.
 *
 * Only data that benefits from caching/sharing belongs here. One-off
 * imperative requests live in app/api/requests.ts instead.
 */
import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig } from "axios";
import { ogcAxiosWithRetry, normalizeHttpError } from "@/app/api/httpClient";
import { Health } from "@/app/api/healthTypes";

// Base query reusing the shared axios client (retry + error tracking).
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

export const ogcApi = createApi({
  reducerPath: "ogcApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getHealth: builder.query<Health, void>({
      query: () => ({ url: "/ogc/manage/health" }),
    }),
  }),
});

export const { useGetHealthQuery } = ogcApi;
