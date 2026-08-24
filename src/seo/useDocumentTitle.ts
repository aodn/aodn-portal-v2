import { useEffect } from "react";
import { SITE_NAME } from "./constants";

/**
 * Sets "<title> | AODN Portal" as the document title while mounted and
 * restores the previous title on unmount. No-op while `title` is undefined.
 */
export const useDocumentTitle = (title: string | undefined) => {
  useEffect(() => {
    if (!title) return;
    const previousTitle = document.title;
    document.title = `${title} | ${SITE_NAME}`;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
