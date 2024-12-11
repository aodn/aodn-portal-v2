import { Root } from "react-dom/client";

export const safeRemoveControl = (
  container: HTMLDivElement | null,
  root: Root | null
) => {
  // https://github.com/facebook/react/issues/25675#issuecomment-1518272581
  // Keep the old pointer
  if (container?.parentNode) {
    setTimeout(() => {
      container?.parentNode?.removeChild(container);
      container = null;
      root?.unmount();
    });
  }
};
