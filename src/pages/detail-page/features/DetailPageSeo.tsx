import { FC } from "react";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import { useDocumentTitle } from "@/seo/useDocumentTitle";
import { useRobotsNoIndex } from "@/seo/useRobotsNoIndex";

const DetailPageSeo: FC = () => {
  const { collection, isCollectionNotFound, isTemporaryError } =
    useDetailPageContext();

  // SPA navigation never reloads the prerendered title, so update it here.
  useDocumentTitle(
    isCollectionNotFound
      ? "Record not found"
      : isTemporaryError
        ? "Service unavailable"
        : collection?.title
  );
  // Detail routes answer HTTP 200; only confirmed missing records need noindex.
  useRobotsNoIndex(isCollectionNotFound);

  return null;
};

export default DetailPageSeo;
