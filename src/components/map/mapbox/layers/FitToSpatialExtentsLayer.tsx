import { FC, useContext, useEffect, useRef, memo } from "react";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import MapContext from "../MapContext";
import { fitToBound } from "../../../../utils/MapUtils";
import { MapEventEnum } from "../constants";

interface FitToSpatialExtentsLayerProps {
  collection: OGCCollection;
  once?: boolean; // We only want the fitToBounds action happen once throughout the map life cycle
}
/*
 * This layer is just to use to fit the map to the spatial extents area of the collection
 */
const FitToSpatialExtentsLayer: FC<FitToSpatialExtentsLayerProps> = memo(
  ({ collection, once = true }: FitToSpatialExtentsLayerProps) => {
    const { map } = useContext(MapContext);
    const hasFitted = useRef(false);

    useEffect(() => {
      const bbox = collection.getExtent()?.bbox;
      if (map && bbox && bbox.length > 0) {
        // This make the event fired earlier than IDLE which makes the map move to place
        // during rendering
        if (!hasFitted.current || !once) {
          map.once(MapEventEnum.RENDER, () => fitToBound(map, bbox[0]));
          hasFitted.current = true;
        }
      }
    }, [collection, map, once]);
    return null;
  }
);

FitToSpatialExtentsLayer.displayName = "FitToSpatialExtentsLayer";
export default FitToSpatialExtentsLayer;
