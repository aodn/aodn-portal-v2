import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../components/common/store/hooks";
import { fetchSystemHealthNoStore } from "../components/common/store/searchReducer";
import DegradedPage from "../pages/error-page/DegradedPage";

interface HealthCheckerProps {
  children?: React.ReactNode;
}

const HealthChecker: React.FC<HealthCheckerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  // Track health status: null = checking, true = healthy, false = unhealthy
  const [isHealthyState, setIsHealthyState] = useState<boolean | null>(null);

  const checkHealthStatus = useCallback(async (): Promise<boolean> => {
    try {
      const health = await dispatch(fetchSystemHealthNoStore()).unwrap();
      const status = (health.status || "UNKNOWN").toUpperCase();
      const ogcStatus = (
        health.components?.ogcApiHealth?.status || "UNKNOWN"
      ).toUpperCase();
      return status === "UP" && ogcStatus === "UP";
    } catch (err) {
      console.error("Error checking system health:", err);
      return false;
    }
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      const healthy = await checkHealthStatus();
      if (isMounted) {
        setIsHealthyState(healthy);
      }
    };

    checkHealth(); // initial check
    const interval = setInterval(checkHealth, 30000); // every 30s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [checkHealthStatus]);

  // While checking health status, render children (optimistic)
  // This prevents flickering on initial load
  if (isHealthyState === null || isHealthyState === true) {
    return <>{children}</>;
  }

  // System is unhealthy
  return <DegradedPage />;
};

export default HealthChecker;
