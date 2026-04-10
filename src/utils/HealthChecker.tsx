import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../components/common/store/hooks";
import { fetchSystemHealthNoStore } from "../components/common/store/searchReducer";
import DegradedPage from "../pages/error-page/DegradedPage";

interface HealthCheckerProps {
  children?: React.ReactNode;
}

const HealthChecker: React.FC<HealthCheckerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [componentToRender, setComponentToRender] =
    useState<React.ReactNode>(children);

  const isHealthy = useCallback(async (): Promise<boolean> => {
    try {
      const health = await dispatch(fetchSystemHealthNoStore()).unwrap();
      const status = (health.status || "UNKNOWN").toUpperCase();
      const ogcStatus = (
        health.components?.ogcApiHealth?.status || "UNKNOWN"
      ).toUpperCase();
      return status === "UP" && ogcStatus === "UP";
    } catch (err) {
      return false;
    }
  }, [dispatch]);

  useEffect(() => {
    const checkHealth = () => {
      isHealthy().then((healthy) => {
        if (!healthy) {
          setComponentToRender(<DegradedPage />);
        } else {
          setComponentToRender(children); // render children if healthy
        }
      });
    };

    checkHealth(); // initial check
    const interval = setInterval(checkHealth, 30000); // every 30s

    return () => clearInterval(interval);
  }, [dispatch, isHealthy, children]);

  return componentToRender; // render children or degraded component
};

export default HealthChecker;
