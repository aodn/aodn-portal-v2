import React, { useEffect } from "react";
import { merge } from "lodash";
import { Map } from "mapbox-gl";

interface TestProps {
  getMap: () => Map;
}

const mergeWithDefaults = <T extends object>(
  defaults: T,
  props?: Partial<T>
): T => {
  return merge({}, defaults, props);
};
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

export { mergeWithDefaults, TestHelper };
