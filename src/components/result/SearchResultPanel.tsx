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
import ItemsOnMapControl from '../map/maplibre/controls/ItemsOnMapControl';
import {
    CollectionsQueryType,
    createSearchParamFrom,
    fetchResultWithStore,
    OGCCollection
} from '../common/store/searchReducer';
import {useSelector} from "react-redux";
import store, {AppDispatch, getComponentState, RootState, searchQueryResult} from "../common/store/store";
import {MapLibreEvent} from "maplibre-gl";
import * as turf from '@turf/turf';
import {useDispatch} from "react-redux";
import {ParameterState, updateFilterPolygon} from "../common/store/componentParamReducer";
import {useNavigate} from "react-router-dom";

interface SearchResultPanelProps {
}

const mapPanelId = 'maplibre-panel-id';

const SearchResultPanel = (props: SearchResultPanelProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [layersUuid, setLayersUuid] = useState<Array<OGCCollection>>([]);
    const contents = useSelector<RootState, CollectionsQueryType>(searchQueryResult);

    const onMapZoom = useCallback((event: MapLibreEvent<MouseEvent | WheelEvent | TouchEvent | undefined>) => {
        if(event.type === 'zoomend') {
            const bounds = event.target.getBounds();
            const ne = bounds.getNorthEast(); // NorthEast corner
            const sw = bounds.getSouthWest(); // SouthWest corner

            // Note order: longitude, latitude.
            const polygon = turf.bboxPolygon([sw.lng, sw.lat, ne.lng, ne.lat])
            dispatch(updateFilterPolygon(polygon));

            const componentParam : ParameterState = getComponentState(store.getState());
            dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
                .unwrap()
                .then((collections) => {
                    const ids = collections.collections.map(c => c.id);
                    // remove map uuid not exist in the ids
                    setLayersUuid(v =>
                        v.filter(i => ids.includes(i.id))
                    );
                })
                .then((v) => navigate('/search'));
        }
    }, [dispatch, navigate]);

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
                            minHeight='700px'
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
                                <Map panelId={mapPanelId} onZoomEvent={onMapZoom}>
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