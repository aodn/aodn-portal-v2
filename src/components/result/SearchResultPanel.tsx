import React, {useState} from 'react';
import {borderRadius, frameBorder, margin} from "../common/constants";
import {Grid} from "@mui/material";
import Map from '../map/maplibre/Map';
import Controls from "../map/maplibre/controls/Controls";
import NavigationControl from "../map/maplibre/controls/NavigationControl";
import ScaleControl from "../map/maplibre/controls/ScaleControl";
import ResultCards from "./ResultCards";

const mapPanelId = 'maplibre-panel-id';

const SearchResultPanel = () => {

    return(
        <Grid id={'search-result-panel'} container>
            <Grid item
                  xs={12}
                  sx={{
                      marginTop: margin['top'],
                      marginBottom: margin['bottom']
                  }}>
                <Grid container id='search-result-center-panel' justifyContent={'center'} spacing={2}>
                    <Grid item xs={3}>
                        <ResultCards/>
                    </Grid>
                    <Grid id={mapPanelId} item xs={5} sx={{
                        border: frameBorder,
                        borderRadius: borderRadius['filter']
                    }}>
                        <Map panelId={mapPanelId}>
                            <Controls>
                                <NavigationControl/>
                                <ScaleControl/>
                            </Controls>
                        </Map>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SearchResultPanel;