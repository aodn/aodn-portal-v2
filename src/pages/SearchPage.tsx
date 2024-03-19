import SimpleTextSearch from "../components/search/SimpleTextSearch";
//import ThemeOnlySmartPanel from "../components/smartpanel/ThemeOnlySmartPanel";
import ResultPanelSimpleFilter, {
  ResultPanelIconFilter,
} from "../components/common/filters/ResultPanelSimpleFilter";
import { Grid, Paper } from "@mui/material";
import { Layers } from "@mui/icons-material";
import Map from "../components/map/maplibre/Map";
import Controls from "../components/map/maplibre/controls/Controls";
import NavigationControl from "../components/map/maplibre/controls/NavigationControl";
import ScaleControl from "../components/map/maplibre/controls/ScaleControl";
import DisplayCoordinate from "../components/map/maplibre/controls/DisplayCoordinate";
import ItemsOnMapControl from "../components/map/maplibre/controls/ItemsOnMapControl";
import MapboxDrawControl from "../components/map/maplibre/controls/MapboxDrawControl";
import VectorTileLayers from "../components/map/maplibre/layers/VectorTileLayers";
import { useState } from "react";
import {
  CollectionsQueryType,
  OGCCollection,
} from "../components/common/store/searchReducer";
import { ResultCards } from "../components/result/ResultCards";
import { useSelector } from "react-redux";
import { RootState, searchQueryResult } from "../components/common/store/store";
import Layout from "../components/layout/layout";

const SearchPage = () => {
  const [layersUuid] = useState<Array<OGCCollection>>([]);
  const contents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );
  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SimpleTextSearch />
        </Grid>
        <Grid item xs={1}>
          <ResultPanelIconFilter />
        </Grid>
        <Grid item xs={4}>
          <ResultPanelSimpleFilter />
          <ResultCards
            contents={contents}
            onAddToMap={undefined}
            onDownload={undefined}
            onTags={undefined}
            onMore={undefined}
          />
        </Grid>
        <Grid item xs={7} sx={{ pr: 2, pb: 2 }}>
          <Paper
            elevation={0}
            id="maplibre-panel-id"
            sx={{ minHeight: "726px", pr: 2, pb: 2 }}
          >
            <Map panelId="maplibre-panel-id" onZoomEvent={undefined}>
              <Controls>
                <NavigationControl />
                <DisplayCoordinate />
                <ScaleControl />
                <ItemsOnMapControl stac={layersUuid} />
                <MapboxDrawControl
                  onDrawCreate={undefined}
                  onDrawDelete={undefined}
                  onDrawUpdate={undefined}
                />
              </Controls>
              <Layers>
                <VectorTileLayers stac={layersUuid} />
              </Layers>
            </Map>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SearchPage;
