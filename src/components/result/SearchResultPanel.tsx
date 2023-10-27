import React, {useState} from 'react';
import {borderRadius, frameBorder, margin} from "../common/constants";
import {Grid} from "@mui/material";
import Map from '../map/maplibre/Map';
import Controls from "../map/maplibre/controls/Controls";
import NavigationControl from "../map/maplibre/controls/NavigationControl";
import ScaleControl from "../map/maplibre/controls/ScaleControl";

const mapPanelId = 'maplibre-panel-id';

const SearchResultPanel = () => {


    return(
        <Grid container>
            <Grid item
                  xs={12}
                  sx={{
                      marginTop: margin['top'],
                      marginBottom: margin['bottom']
                  }}>
                <Grid container justifyContent={'center'} spacing={2} columns={4}>
                    <Grid item>
                        TODO
                    </Grid>
                    <Grid item>
                        TODO
                    </Grid>
                    <Grid id={mapPanelId} item xs={2} sx={{
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