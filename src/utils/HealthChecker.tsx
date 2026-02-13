import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../components/common/store/hooks";
import { fetchSystemHealthNoStore } from "../components/common/store/searchReducer";
import { pageDefault } from "../components/common/constants";

const HealthChecker = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [_, setIsHealthy] = useState(true);

  useEffect(() => {
    const checkHealth = () =>
      dispatch(fetchSystemHealthNoStore())
        .unwrap()
        .then((health) => {
          const status = health.status?.toUpperCase() || "UNKNOWN";

          if (
            status !== "UP" ||
            health.components.ogcApiHealth.status !== "UP"
          ) {
            setIsHealthy(false);
            navigate(pageDefault.degraded, { replace: true });
          } else {
            setIsHealthy(true);
          }
        })
        .catch(() => {
          setIsHealthy(false);
          navigate(pageDefault.degraded, { replace: true });
        });

    checkHealth(); // initial check
    const interval = setInterval(checkHealth, 30000); // every 30s

    return () => clearInterval(interval);
  }, [navigate, dispatch]);

  return null; // invisible component
};

export default HealthChecker;
