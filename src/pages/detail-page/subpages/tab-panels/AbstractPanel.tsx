import { Box, Paper, Stack, Typography } from "@mui/material";
import Controls from "../../../../components/map/mapbox/controls/Controls";
import NavigationControl from "../../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../../components/map/mapbox/controls/ScaleControl";
import MenuControl, {
  BaseMapSwitcher,
} from "../../../../components/map/mapbox/controls/MenuControl";
import Map from "../../../../components/map/mapbox/Map";
import { useDetailPageContext } from "../../context/detail-page-context";

const AbstractCard = () => {
  const { collection } = useDetailPageContext();
  const abstract = collection?.description ? collection.description : "";
  const mapPanelId = "map-detail-container-id";
  return (
    <Paper arial-label="abstract card" elevation={0}>
      <Stack>
        <Typography sx={{ padding: 0 }}>{abstract}</Typography>
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
      </Stack>
    </Paper>
  );
};

export default AbstractCard;
