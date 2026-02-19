import { Box } from "@mui/material";
import SideCardContainer from "./SideCardContainer";
import Map from "../../../../components/map/mapbox/Map";
import { useDetailPageContext } from "../../context/detail-page-context";
import Layers from "../../../../components/map/mapbox/layers/Layers";
import GeojsonLayer from "../../../../components/map/mapbox/layers/GeojsonLayer";
import { FC, useCallback } from "react";
import { Popup, MapMouseEvent } from "mapbox-gl";
import FitToSpatialExtentsLayer from "../../../../components/map/mapbox/layers/FitToSpatialExtentsLayer";

export interface SpatialCoverageCardProps {
  onSpatialCoverageLayerClick?: (event: MapMouseEvent) => void;
}

const popup = new Popup({
  closeButton: false,
  closeOnClick: false,
});

const SpatialCoverageCard: FC<SpatialCoverageCardProps> = ({
  onSpatialCoverageLayerClick,
}) => {
  const { collection } = useDetailPageContext();
  const mapContainerId = "map-spatial-extent-container-id";

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
    collection?.getBBox() && (
      <SideCardContainer title="Spatial Coverage" px={0} py={0}>
        <Box
          arial-label="map"
          id={mapContainerId}
          sx={{
            width: "100%",
            height: "200px",
          }}
        >
          <Map panelId={mapContainerId} zoom={0} minZoom={0}>
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
              />
            </Layers>
          </Map>
        </Box>
      </SideCardContainer>
    )
  );
};

export default SpatialCoverageCard;
