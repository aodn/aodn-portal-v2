/**
 * System-level requests: backend health used by the HealthChecker gate.
 */
import { ogcAxiosWithRetry, toErrorResponse } from "./httpClient";
import { Health } from "@/app/api/healthTypes";

export const getHealth = (signal?: AbortSignal) =>
  ogcAxiosWithRetry
    .get<Health>("/ogc/manage/health", { signal })
    .then((response) => response.data)
    .catch(toErrorResponse);
