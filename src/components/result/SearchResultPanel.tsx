import React, {useCallback, useState} from 'react';
import {borderRadius, border, margin} from "../common/constants";
import {Grid, Box} from "@mui/material";
import Map from '../map/maplibre/Map';
import Controls from "../map/maplibre/controls/Controls";
import NavigationControl from "../map/maplibre/controls/NavigationControl";
import ScaleControl from "../map/maplibre/controls/ScaleControl";
import {ResultCards} from "./ResultCards";
import DisplayCoordinate from '../map/maplibre/controls/DisplayCoordinate';
import MapboxDrawControl from '../map/maplibre/controls/MapboxDrawControl';
import Layers from '../map/maplibre/layers/Layers';
import VectorTileLayers from '../map/maplibre/layers/VectorTileLayers';
import LocateControl from '../map/maplibre/controls/LocateControl';
import ItemsOnMapControl from '../map/maplibre/controls/ItemsOnMapControl';
import {CollectionsQueryType, OGCCollection} from '../common/store/searchReducer';
import {useSelector} from "react-redux/es/hooks/useSelector";
import {RootState, searchQueryResult} from "../common/store/store";

interface SearchResultPanelProps {
}

const mapPanelId = 'maplibre-panel-id';

const SearchResultPanel = (props: SearchResultPanelProps) => {

    const [layersUuid, setLayersUuid] = useState<Array<OGCCollection>>([]);
    const contents = useSelector<RootState, CollectionsQueryType>(searchQueryResult);

    const onAddToMap = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => {
        // Unique set of layers
        const s = new Set<OGCCollection>(layersUuid);
        s.add(stac);
        setLayersUuid(Array.from(s));

    }, [layersUuid]);

    const onDownload = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => {
        //TODO: Add bounding box to map
    }, []);

    return (
        <Grid id={'search-result-panel'} container>
            <Grid item
                  xs={12}
                  sx={{
                      marginBottom: margin['bottom']
                  }}>
                <Grid container id='search-result-center-panel' justifyContent='center'>
                    <Grid item xs={11}>
                        <Box
                            display='grid'
                            minWidth='1200px'
                            maxHeight='700px'
                            marginBottom={margin['tripleBottom']}
                            gridTemplateColumns={'repeat(6, 1fr)'}
                            gridTemplateRows={'repeat(1, 1fr)'}
                            gap={2}
                        >
                            <Box
                                sx={{
                                    gridColumn: 'span 2',
                                    gridRow: 'span 1'
                                }}>
                                <ResultCards
                                    contents={contents}
                                    onAddToMap={onAddToMap}
                                    onDownload={onDownload}
                                    onTags={undefined}
                                    onMore={undefined}
                                />
                            </Box>
                            <Box id={mapPanelId} sx={{
                                gridColumn: 'span 4',
                                gridRow: 'span 1',
                                border: border['frameBorder'],
                                marginTop: margin['top'],
                                borderRadius: borderRadius['filter']
                            }}>
                                <Map panelId={mapPanelId}>
                                    <Controls>
                                        <NavigationControl/>
                                        <DisplayCoordinate/>
                                        <ScaleControl/>
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