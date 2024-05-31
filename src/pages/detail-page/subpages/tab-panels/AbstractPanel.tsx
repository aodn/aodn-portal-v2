import { Box, Paper } from "@mui/material";
import Controls from "../../../../components/map/mapbox/controls/Controls";
import NavigationControl from "../../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../../components/map/mapbox/controls/ScaleControl";
import MenuControl, {
  BaseMapSwitcher,
} from "../../../../components/map/mapbox/controls/MenuControl";
import Map from "../../../../components/map/mapbox/Map";
const AbstractCard = () => {
  const mapPanelId = "map-detail-container-id";
  return (
    <Paper arial-label="abstract card">
      AbstractCard
      <Box
        arial-label="map"
        id={mapPanelId}
        sx={{
          width: "100%",
          minHeight: "500px",
        }}
      >
        <Map panelId={mapPanelId}>
          <Controls>
            <NavigationControl />
            <ScaleControl />
            <MenuControl menu={<BaseMapSwitcher />} />
          </Controls>
        </Map>
      </Box>
    </Paper>
  );
};

export default AbstractCard;
