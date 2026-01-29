import { FC, useContext, useEffect, useRef } from "react";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import MapContext from "../MapContext";
import { fitToBound } from "../../../../utils/MapUtils";
import { LngLatBounds } from "mapbox-gl";

interface FitToSpatialExtentsLayerProps {
  collection: OGCCollection;
  bbox?: LngLatBounds | undefined;
  // This prop is to control whether the fitting should be active or not
  // It is a dependency to the useEffect to re-evaluate when it's value changes (e.g., when tab becomes active from inactive)
  shouldActive?: boolean;
}
/*
 * This layer is just to use to fit the map to the spatial extents area of the collection
 */
const FitToSpatialExtentsLayer: FC<FitToSpatialExtentsLayerProps> = ({
  collection,
  bbox,
  shouldActive = true,
}: FitToSpatialExtentsLayerProps) => {
  const { map } = useContext(MapContext);
  // Ref to track if we have already done the initial fit (based on collection extent)
  // We only want the initial fit to happen once, but user-triggered fits (via bbox prop) should always work
  const hasInitialFittedRef = useRef(false);
  // Track the last bbox we fitted to, so we can detect when it changes
  const lastBboxRef = useRef<LngLatBounds | undefined>(undefined);

  useEffect(() => {
    if (!map || !shouldActive) return;

    // Check if this is a new bbox from user interaction
    const isNewBbox = bbox !== undefined && bbox !== lastBboxRef.current;

    const b = bbox
      ? [[bbox.getWest(), bbox.getSouth(), bbox.getEast(), bbox.getNorth()]]
      : collection.getExtent()?.bbox;

    if (!b || b.length === 0) return;

    // Fit to bounds if:
    // 1. We have a new bbox from user interaction (clicking spatial coverage map)
    // 2. OR we haven't done the initial fit yet (first time loading without bbox)
    if (isNewBbox || !hasInitialFittedRef.current) {
      // No need to fit if already fit
      if (
        map.getBounds()?.getWest() !== bbox?.getWest() ||
        map.getBounds()?.getSouth() !== bbox?.getSouth() ||
        map.getBounds()?.getEast() !== bbox?.getEast() ||
        map.getBounds()?.getNorth() !== bbox?.getNorth()
      ) {
        // Update refs
        lastBboxRef.current = bbox;
        hasInitialFittedRef.current = true;

        // Use requestAnimationFrame to ensure the container has been laid out
        // and has correct dimensions before fitting bounds.
        // This is important when switching tabs - the container might not have
        // its final dimensions immediately when shouldActive becomes true.
        requestAnimationFrame(() => {
          // Trigger resize to ensure map knows the correct container dimensions
          map.resize();
          fitToBound(map, b[0]);
        });
      }
    }
  }, [bbox, collection, map, shouldActive]);

  return null;
};

export default FitToSpatialExtentsLayer;
