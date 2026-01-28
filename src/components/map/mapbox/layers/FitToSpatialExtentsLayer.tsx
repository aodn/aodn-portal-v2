import { FC, useContext, useEffect, useRef } from "react";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import MapContext from "../MapContext";
import { fitToBound } from "../../../../utils/MapUtils";
import { MapEventEnum } from "../constants";
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
  // Ref to track if we have already fitted the map
  // We only want to fit once
  const hasFittedRef = useRef(false);

  useEffect(() => {
    const b = bbox
      ? [[bbox.getWest(), bbox.getSouth(), bbox.getEast(), bbox.getNorth()]]
      : collection.getExtent()?.bbox;

    if (map && b && b.length > 0 && shouldActive && !hasFittedRef.current) {
      // No need to fit if already fit
      if (
        map.getBounds()?.getWest() !== bbox?.getWest() ||
        map.getBounds()?.getSouth() !== bbox?.getSouth() ||
        map.getBounds()?.getEast() !== bbox?.getEast() ||
        map.getBounds()?.getNorth() !== bbox?.getNorth()
      ) {
        hasFittedRef.current = true;

        // Use requestAnimationFrame to ensure the container has been laid out
        // and has correct dimensions before fitting bounds.
        // This is important when switching tabs - the container might not have
        // its final dimensions immediately when shouldActive becomes true.
        requestAnimationFrame(() => {
          // Trigger resize to ensure map knows the correct container dimensions
          map.resize();

          map.once(MapEventEnum.RENDER, () => {
            fitToBound(map, b[0]);
          });
        });
      }
    }
  }, [bbox, collection, map, shouldActive]);

  return null;
};

export default FitToSpatialExtentsLayer;
