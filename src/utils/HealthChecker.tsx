import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../components/common/store/hooks";
import { fetchSystemHealthNoStore } from "../components/common/store/searchReducer";
import DegradedPage from "../pages/error-page/DegradedPage";
import { Health } from "../components/common/store/systemDefinition";
import { ErrorResponse } from "../utils/ErrorBoundary";

interface HealthCheckerProps {
  children?: React.ReactNode;
}

const HEALTH_CHECK_INTERVAL_MS = 30000;

const HealthChecker: React.FC<HealthCheckerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  // Track health status: null = checking, true = healthy, false = unhealthy
  const [isHealthy, setIsHealthy] = useState<boolean>(true);

  useEffect(() => {
    // No need for health checks in playwright-local mode
    if (import.meta.env.MODE === "playwright-local") {
      return;
    }

    let isMounted = true;
    let timerId: NodeJS.Timeout | null = null;
    let current: {
      abort: (reason?: string) => void;
      unwrap: () => Promise<Health>;
    } | null = null;

    const performCheck = async () => {
      current = dispatch(fetchSystemHealthNoStore());
      try {
        const health = await current.unwrap();
        if (isMounted) {
          const status = health.status?.toUpperCase() || "UNKNOWN";
          const ogcStatus =
            health.components?.ogcApiHealth?.status?.toUpperCase() || "UNKNOWN";
          setIsHealthy(status === "UP" && ogcStatus === "UP");
        }
      } catch (err: any) {
        if (isMounted) {
          // If the request was aborted, don't update health status to unhealthy
          const isCancelled =
            err?.name === "AbortError" || err?.code === "ERR_CANCELED";
          if (!isCancelled) {
            console.error("Error checking system health:", err);
            setIsHealthy(false);
          }
        }
      } finally {
        if (isMounted) {
          timerId = setTimeout(performCheck, HEALTH_CHECK_INTERVAL_MS);
        }
      }
    };

    performCheck();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
      if (current) current.abort();
    };
  }, [dispatch]);

  // While checking health status, render children (optimistic)
  // This prevents flickering on initial load
  return isHealthy ? <>{children}</> : <DegradedPage />;
};

export default HealthChecker;
