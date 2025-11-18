import { FC, useContext, useEffect } from "react";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import MapContext from "../MapContext";
import { fitToBound } from "../../../../utils/MapUtils";
import { MapEventEnum } from "../constants";
import { LngLatBounds } from "mapbox-gl";

interface FitToSpatialExtentsLayerProps {
  collection: OGCCollection;
  bbox?: LngLatBounds | undefined;
}
/*
 * This layer is just to use to fit the map to the spatial extents area of the collection
 */
const FitToSpatialExtentsLayer: FC<FitToSpatialExtentsLayerProps> = ({
  collection,
  bbox,
}: FitToSpatialExtentsLayerProps) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    const b = bbox
      ? [[bbox.getWest(), bbox.getSouth(), bbox.getEast(), bbox.getNorth()]]
      : collection.getExtent()?.bbox;
    if (map && b && b.length > 0) {
      // No need to fit if already fit
      if (
        map.getBounds()?.getWest() !== bbox?.getWest() ||
        map.getBounds()?.getSouth() !== bbox?.getSouth() ||
        map.getBounds()?.getEast() !== bbox?.getEast() ||
        map.getBounds()?.getNorth() !== bbox?.getNorth()
      ) {
        // This make the event fired earlier than IDLE which makes the map move to place
        // during rendering
        map.once(MapEventEnum.RENDER, () => fitToBound(map, b[0]));
      }
    }
  }, [bbox, collection, map]);
  return null;
};

export default FitToSpatialExtentsLayer;
