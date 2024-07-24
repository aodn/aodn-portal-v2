import { Box } from "@mui/material";
import SideCardContainer from "./SideCardContainer";
import Map from "../../../../components/map/mapbox/Map";
import { useDetailPageContext } from "../../context/detail-page-context";
import Layers from "../../../../components/map/mapbox/layers/Layers";
import GeojsonLayer from "../../../../components/map/mapbox/layers/GeojsonLayer";

const SpatialCoverageCard = () => {
  const { collection } = useDetailPageContext();
  const mapContainerId = "map-spatial-extent-container-id";

  if (!collection?.extent?.bbox) return;
  return (
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
            <GeojsonLayer collection={collection} />
          </Layers>
        </Map>
      </Box>
    </SideCardContainer>
  );
};

export default SpatialCoverageCard;
