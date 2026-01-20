import React, { useEffect } from "react";
import { Map, LngLat } from "mapbox-gl";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";

interface TestProps {
  id: string;
  getMap?: () => Map;
  getClusterLayer?: () => string;
  getHeatmapLayer?: () => string;
  getAUMarineParksLayer?: () => string;
  getWorldBoundariesLayer?: () => string;
  getSpiderLayer?: () => string;
  getGeoServerTileLayer?: () => string;
  getHexbinLayer?: () => string;
  getSpatialExtentLayer?: () => string;
  getMapClickLngLat?: () => LngLat;
  getSelectedLocationIntersects?: () => any;
}

// Use in test only to expose reference that need by test e2e testing.
const TestHelper: React.FC<TestProps> = (props) => {
  useEffect(() => {
    if (import.meta.env.MODE === "playwright-local") {
      const { id, ...restProps } = props;
      const getMap = restProps.getMap;

      const w = window as Window &
        typeof globalThis & {
          testProps: Record<string, Omit<TestProps, "id">>;
        };

      // Initialize testProps if it doesn't exist
      w.testProps = w.testProps || {};
      // Merge existing props for the given id with the new props
      const existingProps = w.testProps[id] || {};
      w.testProps[id] = mergeWithDefaults(existingProps, restProps);

      // Add click listener if getMap exists
      if (getMap) {
        const map = getMap();
        const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
          // Update map click lnglat in testProps
          if (w.testProps[id]) {
            w.testProps[id].getMapClickLngLat = () => e.lngLat;
          }
        };

        map.on("click", handleMapClick);

        // Cleanup function
        return () => {
          map.off("click", handleMapClick);
        };
      }
    }
  }, [props]);

  return <React.Fragment />;
};

export { TestHelper };
