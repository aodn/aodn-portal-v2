import React, { FC, useContext, useEffect } from "react";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import MapContext from "../MapContext";
import { fitToBound } from "../../../../utils/MapUtils";

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
      fitToBound(map, bbox[0]);
    }
  }, [collection, map]);
  return <React.Fragment />;
};

export default FitToSpatialExtentsLayer;
