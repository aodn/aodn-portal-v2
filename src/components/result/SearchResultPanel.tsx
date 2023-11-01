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
import Locate from '../map/maplibre/controls/Locate';

interface SearchResultPanelProps {
    showMap?: boolean
}

const mapPanelId = 'maplibre-panel-id';

const SearchResultPanel = (props: SearchResultPanelProps) => {

    const [layersUuid, setLayersUuid] = useState<Array<string>>([]);

    const onAddToMap = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => {
        // Unique set of layers
        const s = new Set<string>(layersUuid);
        s.add(uuid);
        setLayersUuid(Array.from(s));

    },[layersUuid]);

    const onDownload = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => {
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
                                    <Locate/>
                                    <MapboxDrawControl
                                        onDrawCreate={undefined}
                                        onDrawDelete={undefined}
                                        onDrawUpdate={undefined}/>
                                  </Controls>
                                  <Layers>
                                    <VectorTileLayers uuids={layersUuid}/>
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