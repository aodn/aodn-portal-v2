import React, {useCallback, useState} from 'react';
import {borderRadius, border, margin} from "../common/constants";
import {Grid, Box} from "@mui/material";
import Map from '../map/maplibre/Map';
import Controls from "../map/maplibre/controls/Controls";
import NavigationControl from "../map/maplibre/controls/NavigationControl";
import ScaleControl from "../map/maplibre/controls/ScaleControl";
import {ResultCards} from "./ResultCards";
import ComplexListFilter from '../common/filters/ComplexListFilter';
import DisplayCoordinate from '../map/maplibre/controls/DisplayCoordinate';
import MapboxDrawControl from '../map/maplibre/controls/MapboxDrawControl';
import Layers from '../map/maplibre/layers/Layers';
import VectorTileLayers from '../map/maplibre/layers/VectorTileLayers';
import LocateControl from '../map/maplibre/controls/LocateControl';
import ItemsOnMapControl from '../map/maplibre/controls/ItemsOnMapControl';
import { OGCCollection } from '../common/store/searchReducer';

interface SearchResultPanelProps {
    showMap?: boolean
}

const mapPanelId = 'maplibre-panel-id';

const SearchResultPanel = (props: SearchResultPanelProps) => {

    const [layersUuid, setLayersUuid] = useState<Array<OGCCollection>>([]);

    const onAddToMap = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => {
        // Unique set of layers
        const s = new Set<OGCCollection>(layersUuid);
        s.add(stac);
        setLayersUuid(Array.from(s));

    },[layersUuid]);

    const onDownload = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => {
        //TODO: Add bounding box to map
    },[]);

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
                            maxHeight='700px'
                            marginTop={margin['tripleTop']}
                            marginBottom={margin['tripleBottom']}
                            gridTemplateColumns={'repeat(5, 1fr)'}
                            gridTemplateRows={'repeat(1, 1fr)'}
                            gap={2}
                        >
                            {!props.showMap &&
                              <Box
                                sx = {{
                                    gridColumn: 'span 2',
                                    gridRow: 'span 1'
                                }}>
                                    <ComplexListFilter/>
                              </Box>
                            }
                            <Box
                                sx = {{
                                    gridColumn: props.showMap? 'span 2' :'span 3',
                                    gridRow: 'span 1'
                                }}>
                                <ResultCards 
                                    onAddToMap={onAddToMap}
                                    onDownload={onDownload}
                                    onTags={undefined}
                                    onMore={undefined}
                                />
                            </Box>
                            {props.showMap &&
                              <Box id={mapPanelId} sx={{
                                  gridColumn: 'span 3',
                                  gridRow: 'span 1',
                                  border: border['frameBorder'],
                                  borderRadius: borderRadius['filter']
                              }}>
                                <Map panelId={mapPanelId}>
                                  <Controls>
                                    <NavigationControl/>
                                    <DisplayCoordinate/>
                                    <ScaleControl/>
                                    <LocateControl/>
                                    <ItemsOnMapControl stac={layersUuid}/>
                                    <MapboxDrawControl
                                        onDrawCreate={undefined}
                                        onDrawDelete={undefined}
                                        onDrawUpdate={undefined}/>
                                  </Controls>
                                  <Layers>
                                    <VectorTileLayers stac={layersUuid}/>
                                  </Layers>
                                </Map>
                              </Box>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

SearchResultPanel.defaultProps = {
    showMap: false
}
export default SearchResultPanel;