import { useEffect } from "react";

/**
 * Injects <meta name="robots" content="noindex"> while mounted and removes it
 * on unmount. The SPA answers every route with HTTP 200, so this is the only
 * way error pages can tell crawlers not to index them — Google reads the tag
 * after rendering the JavaScript. No-op while `enabled` is false.
 */
export const useRobotsNoIndex = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, [enabled]);
};
