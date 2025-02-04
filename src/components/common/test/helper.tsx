import React, { useEffect } from "react";
import { Map } from "mapbox-gl";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";

interface TestProps {
  mapId: string;
  getMap?: () => Map;
  getClusterLayer?: () => string;
  getHeatmapLayer?: () => string;
  getAUMarineParksLayer?: () => string;
  getWorldBoundariesLayer?: () => string;
  getSpiderLayer?: () => string;
}

// Use in test only to expose reference that need by test e2e testing.
const TestHelper: React.FC<TestProps> = (props) => {
  useEffect(() => {
    if (import.meta.env.MODE === "dev") {
      const { mapId, ...restProps } = props;

      const w = window as Window &
        typeof globalThis & {
          testProps: Record<string, Omit<TestProps, "mapId">>;
        };

      // Initialize testProps if it doesn't exist
      w.testProps = w.testProps || {};

      // Merge existing props for the given mapId with the new props
      const existingProps = w.testProps[mapId] || {};
      w.testProps[mapId] = mergeWithDefaults(existingProps, restProps);
    }
  }, [props]);

  return <React.Fragment />;
};

export { TestHelper };
