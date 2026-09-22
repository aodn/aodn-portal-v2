import { FC, useCallback } from "react";
import { Popup, MapMouseEvent, LngLatBounds } from "mapbox-gl";
import Map from "@/components/map/mapbox/Map";
import Layers from "@/components/map/mapbox/layers/Layers";
import GeojsonLayer from "@/components/map/mapbox/layers/GeojsonLayer";
import FitToSpatialExtentsLayer from "@/components/map/mapbox/layers/FitToSpatialExtentsLayer";
import DisplayCoordinate from "@/components/map/mapbox/controls/DisplayCoordinate";
import Controls from "@/components/map/mapbox/controls/Controls";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";

export interface SpatialCoverageMapProps {
  panelId: string;
  collection: OGCCollection;
  onSpatialCoverageLayerClick?: (bounds: LngLatBounds) => void;
}

const popup = new Popup({
  closeButton: false,
  closeOnClick: false,
});

/**
 * The map inside SpatialCoverageCard, split out so SpatialCoverageCard can
 * load it (and mapbox-gl with it) only once the card nears the viewport.
 */
const SpatialCoverageMap: FC<SpatialCoverageMapProps> = ({
  panelId,
  collection,
  onSpatialCoverageLayerClick,
}) => {
  const onMouseEnterHandler = useCallback((event: MapMouseEvent) => {
    event.target.getCanvas().style.cursor = "pointer";
    popup
      .setLngLat(event.lngLat)
      .setText("Click to navigate main map")
      .addTo(event.target);
  }, []);

  const onMouseLeaveHandler = useCallback((event: MapMouseEvent) => {
    event.target.getCanvas().style.cursor = "";
    popup.remove();
  }, []);

  const onMouseMoveHandler = useCallback((event: MapMouseEvent) => {
    popup.setLngLat(event.lngLat);
  }, []);

  return (
    <Map panelId={panelId} zoom={0} minZoom={0}>
      <Controls>
        <DisplayCoordinate />
      </Controls>
      <Layers>
        <FitToSpatialExtentsLayer collection={collection} />
        <GeojsonLayer
          collection={collection}
          onLayerClick={onSpatialCoverageLayerClick}
          onMouseEnter={onMouseEnterHandler}
          onMouseLeave={onMouseLeaveHandler}
          onMouseMove={onMouseMoveHandler}
          animate={false}
          visible={true}
          showExtentPopup
        />
      </Layers>
    </Map>
  );
};

export default SpatialCoverageMap;
