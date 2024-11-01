// Map section, you can switch to other map library, this is for maplibre
// import { MapLibreEvent as MapEvent } from "maplibre-gl";
// import Map from "../components/map/maplibre/Map";
// import Controls from "../components/map/maplibre/controls/Controls";
// import Layers from "../components/map/maplibre/layers/Layers";
// import NavigationControl from "../components/map/maplibre/controls/NavigationControl";
// import ScaleControl from "../components/map/maplibre/controls/ScaleControl";
// import DisplayCoordinate from "../components/map/maplibre/controls/DisplayCoordinate";
// import ItemsOnMapControl from "../components/map/maplibre/controls/ItemsOnMapControl";
// import MapboxDrawControl from "../components/map/maplibre/controls/MapboxDrawControl";
// import VectorTileLayers from "../components/map/maplibre/layers/VectorTileLayers";
// Map section, you can switch to other map library, this is for mapbox

import { Box } from "@mui/material";
import Layout from "../../components/layout/layout";
import SearchPageProvider from "./context/SearchPageProvider";
import ResultSection from "./subpages/ResultSection";
import MapSection from "./subpages/MapSection";
import { color, padding } from "../../styles/constants";

const RESULT_SECTION_WIDTH = 500;

const SearchPage = () => {
  return (
    <SearchPageProvider>
      <Layout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",
            width: "100%",
            height: "90vh",
            padding: padding.small,
            bgcolor: color.blue.light,
          }}
          gap={2}
        >
          <Box>
            <ResultSection sx={{ width: RESULT_SECTION_WIDTH }} />
          </Box>

          <Box flex={1}>
            <MapSection />
          </Box>
        </Box>
      </Layout>
    </SearchPageProvider>
  );
};
export default SearchPage;
