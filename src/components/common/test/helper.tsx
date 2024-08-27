import React, { useEffect } from "react";
import { Map } from "mapbox-gl";
import { mergeWithDefaults } from "../utils";

interface TestProps {
  getMap: () => Map;
}

// Use in test only to expose reference that need by test e2e testing.
const TestHelper: React.FC<TestProps> = (props) => {
  useEffect(() => {
    if (import.meta.env.MODE === "dev") {
      const w = window as Window &
        typeof globalThis & {
          testProps: TestProps;
        };

      w.testProps = mergeWithDefaults(w.testProps, props);
    }
  }, [props]);

  return <React.Fragment />;
};

export { TestHelper };
