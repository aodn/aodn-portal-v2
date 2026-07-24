import React from "react";
import { useGetHealthQuery } from "@/app/store/ogcApi";
import DegradedPage from "../pages/error-page/DegradedPage";

interface HealthCheckerProps {
  children?: React.ReactNode;
}

const HEALTH_CHECK_INTERVAL_MS = 30000;

const HealthChecker: React.FC<HealthCheckerProps> = ({ children }) => {
  // No need for health checks in playwright-local mode
  const skip = import.meta.env.MODE === "playwright-local";

  // RTK Query handles the polling, abort-on-unmount and request dedupe
  // that this component used to hand-roll.
  const { data, isError } = useGetHealthQuery(undefined, {
    pollingInterval: HEALTH_CHECK_INTERVAL_MS,
    skip,
  });

  // While the first check is in flight, data is undefined — render the
  // children (optimistic) to prevent flickering on initial load.
  const isHealthy = (() => {
    if (skip || (!data && !isError)) return true;
    if (isError) return false;
    const status = data?.status?.toUpperCase() || "UNKNOWN";
    const ogcStatus =
      data?.components?.ogcApiHealth?.status?.toUpperCase() || "UNKNOWN";
    return status === "UP" && ogcStatus === "UP";
  })();

  return isHealthy ? <>{children}</> : <DegradedPage />;
};

export default HealthChecker;
