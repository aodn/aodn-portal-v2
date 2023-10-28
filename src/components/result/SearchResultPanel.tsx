import React, {useCallback, useState} from 'react';
import {borderRadius, frameBorder, margin} from "../common/constants";
import {Grid, Box} from "@mui/material";
import Map from '../map/maplibre/Map';
import Controls from "../map/maplibre/controls/Controls";
import NavigationControl from "../map/maplibre/controls/NavigationControl";
import ScaleControl from "../map/maplibre/controls/ScaleControl";
import {ResultCards} from "./ResultCards";
import { findResults } from './api';
import DisplayCoordinate from '../map/maplibre/controls/DisplayCoordinate';
import MapboxDrawControl from '../map/maplibre/controls/MapboxDrawControl';

const mapPanelId = 'maplibre-panel-id';

const SearchResultPanel = () => {

    const onAddToMap = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => {
        //TODO: Add bounding box to map
    },[]);

    const onDownload = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => {
        //TODO: Add bounding box to map
    },[]);

    const [results, setResult] = useState(findResults());

    return(
        <Grid id={'search-result-panel'} container>
            <Grid item
                  xs={12}
                  sx={{
                      marginBottom: margin['bottom']
                  }}>
                <Grid container id='search-result-center-panel' justifyContent='center'>
                    <Grid item  xs={8}>
                        <Box
                            display='grid'
                            minWidth='1200px'
                            marginTop={margin['tripleTop']}
                            marginBottom={margin['tripleBottom']}
                            gridTemplateColumns={'repeat(5, 1fr)'}
                            gridTemplateRows={'repeat(1, 1fr)'}
                            gap={2}
                        >
                            <Box
                                sx = {{
                                    gridColumn: 'span 2',
                                    gridRow: 'span 1'
                                }}>
                                <ResultCards 
                                    contents={results}
                                    onAddToMap={onAddToMap} 
                                    onDownload={onDownload}
                                    onTags={undefined}
                                    onMore={undefined}
                                />
                            </Box>
                            <Box id={mapPanelId} sx={{
                                gridColumn: 'span 3',
                                gridRow: 'span 1',
                                border: frameBorder,
                                borderRadius: borderRadius['filter']
                            }}>
                                <Map panelId={mapPanelId}>
                                    <Controls>
                                        <NavigationControl/>
                                        <DisplayCoordinate/>
                                        <ScaleControl/>
                                        <MapboxDrawControl/>
                                    </Controls>
                                </Map>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SearchResultPanel;