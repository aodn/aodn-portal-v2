import { Box } from "@mui/material";
import SideCardContainer from "./SideCardContainer";
import Map from "../../../../components/map/mapbox/Map";
import { useDetailPageContext } from "../../context/detail-page-context";
import Layers from "../../../../components/map/mapbox/layers/Layers";
import GeojsonLayer from "../../../../components/map/mapbox/layers/GeojsonLayer";
import { FC } from "react";
import { MapMouseEvent } from "mapbox-gl";

interface SpatialCoverageCardProps {
  onLayerClick?: (event: MapMouseEvent) => void;
}

const SpatialCoverageCard: FC<SpatialCoverageCardProps> = ({
  onLayerClick,
}) => {
  const { collection } = useDetailPageContext();
  const mapContainerId = "map-spatial-extent-container-id";

  return (
    collection?.extent?.bbox && (
      <SideCardContainer title="Spatial Coverage">
        <Box
          arial-label="map"
          id={mapContainerId}
          sx={{
            width: "100%",
            height: "200px",
          }}
        >
          <Map panelId={mapContainerId}>
            <Layers>
              <GeojsonLayer
                collection={collection}
                onLayerClick={onLayerClick}
                animate={false}
              />
            </Layers>
          </Map>
        </Box>
      </SideCardContainer>
    )
  );
};

export default SpatialCoverageCard;
