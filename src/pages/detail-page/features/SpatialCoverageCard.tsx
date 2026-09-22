import { Box, Skeleton } from "@mui/material";
import SideCardContainer from "@/pages/detail-page/layout/SideCardContainer";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import { FC, lazy, Suspense, useEffect, useState } from "react";
import type { LngLatBounds } from "mapbox-gl";
import { portalTheme } from "@/styles";

// Loaded only once the card nears the viewport, so mapbox-gl stays off the
// details page's initial load (on mobile this card sits far below the fold).
const SpatialCoverageMap = lazy(
  () => import("@/pages/detail-page/features/SpatialCoverageMap")
);

const MAP_HEIGHT = 200;
const MAP_PRELOAD_MARGIN = "200px 0px";

export interface SpatialCoverageCardProps {
  onSpatialCoverageLayerClick?: (bounds: LngLatBounds) => void;
}

const SpatialCoverageCard: FC<SpatialCoverageCardProps> = ({
  onSpatialCoverageLayerClick,
}) => {
  const { collection } = useDetailPageContext();
  const mapContainerId = "map-spatial-extent-container-id";
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    if (!container || isMapVisible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: MAP_PRELOAD_MARGIN }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [container, isMapVisible]);

  const skeleton = (
    <Skeleton
      variant="rectangular"
      animation={false}
      width="100%"
      height="100%"
      aria-label="Spatial coverage map loading"
      sx={{ bgcolor: portalTheme.palette.action.hover }}
    />
  );

  return (
    collection?.getBBox() && (
      <SideCardContainer title="Spatial Coverage" px={0} py={0}>
        <Box
          ref={setContainer}
          aria-label="map"
          id={mapContainerId}
          sx={{
            width: "100%",
            height: MAP_HEIGHT,
          }}
        >
          {isMapVisible ? (
            <Suspense fallback={skeleton}>
              <SpatialCoverageMap
                panelId={mapContainerId}
                collection={collection}
                onSpatialCoverageLayerClick={onSpatialCoverageLayerClick}
              />
            </Suspense>
          ) : (
            skeleton
          )}
        </Box>
      </SideCardContainer>
    )
  );
};

export default SpatialCoverageCard;
