import { Box, CircularProgress, Stack } from "@mui/material";
import SideCardContainer from "./SideCardContainer";
import Map from "../../../../components/map/mapbox/Map";
import { useDetailPageContext } from "../../context/detail-page-context";
import { padding } from "../../../../styles/constants";
import Controls from "../../../../components/map/mapbox/controls/Controls";
import ScaleControl from "../../../../components/map/mapbox/controls/ScaleControl";
import NavigationControl from "../../../../components/map/mapbox/controls/NavigationControl";
import MenuControl, {
  BaseMapSwitcher,
} from "../../../../components/map/mapbox/controls/MenuControl";
import Layers from "../../../../components/map/mapbox/layers/Layers";
import GeojsonLayer from "../../../../components/map/mapbox/layers/GeojsonLayer";
import Carousel from "../../../../components/details/Carousel";

const SpatialExtendCard = () => {
  const { collection, setPhotos, hasSnapshotsFinished } =
    useDetailPageContext();
  const { photos } = useDetailPageContext();
  const mainMap = photos[0];
  const mapContainerId = "map-spatial-extent-container-id";

  if (!collection || !collection.extent || !collection.extent.bbox) return;
  return (
    <SideCardContainer title="Spatial Extend">
      <Stack direction="column" sx={{ position: "relative" }}>
        <Box sx={{ position: "absolute", visibility: "hidden" }}>
          <Box
            arial-label="map"
            id={mapContainerId}
            sx={{
              width: "100%",
              minHeight: "500px",
              marginY: padding.large,
            }}
          >
            <Map panelId={mapContainerId}>
              <Controls>
                <NavigationControl />
                <ScaleControl />
                <MenuControl menu={<BaseMapSwitcher />} />
              </Controls>
              <Layers>
                <GeojsonLayer collection={collection} setPhotos={setPhotos} />
              </Layers>
            </Map>
          </Box>
        </Box>
        <Box sx={{ width: "100%", height: "250px" }}>
          {!hasSnapshotsFinished && (
            <Stack
              direction="column"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Stack>
          )}
          {hasSnapshotsFinished && mainMap && (
            <img
              src={mainMap.url}
              alt="imos_logo"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </Box>
        <Carousel />
      </Stack>
    </SideCardContainer>
  );
};

export default SpatialExtendCard;
