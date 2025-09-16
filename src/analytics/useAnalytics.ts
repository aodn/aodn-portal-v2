import { useCallback } from "react";
import { trackCustomEvent } from "./customEventTracker";

export const useAnalytics = () => {
  const track = useCallback(trackCustomEvent, []);

  return { track };
};
