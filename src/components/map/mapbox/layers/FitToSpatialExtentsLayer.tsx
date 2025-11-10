import { FC, useContext, useEffect } from "react";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import MapContext from "../MapContext";
import { fitToBound } from "../../../../utils/MapUtils";
import { MapEventEnum } from "../constants";

interface FitToSpatialExtentsLayerProps {
  collection: OGCCollection;
}
/*
 * This layer is just to use to fit the map to the spatial extents area of the collection
 */
const FitToSpatialExtentsLayer: FC<FitToSpatialExtentsLayerProps> = ({
  collection,
}: FitToSpatialExtentsLayerProps) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    const bbox = collection.getExtent()?.bbox;
    if (map && bbox && bbox.length > 0) {
      // This make the event fired earlier than IDLE which makes the map move to place
      // during rendering
      map.once(MapEventEnum.RENDER, () => fitToBound(map, bbox[0]));
    }
  }, [collection, map]);
  return null;
};

export default FitToSpatialExtentsLayer;
