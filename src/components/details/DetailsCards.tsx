import * as React from 'react';
import Map from "../map/maplibre/Map";
import Controls from "../map/maplibre/controls/Controls";
import NavigationControl from "../map/maplibre/controls/NavigationControl";
import DisplayCoordinate from "../map/maplibre/controls/DisplayCoordinate";
import {Card, Typography, CardContent, Box, CardHeader, Stack} from "@mui/material";
import grey from "../common/colors/grey";

interface MapCardProps {
}

const mapPanelId = 'maplibre-detail-page-id';

const MapCard = (props: MapCardProps) => {
    return(
        <Card sx={{
            backgroundColor: grey['resultCard'],
        }}>
            <CardHeader
                title='Map Contents'
            />
            <CardContent>
                <Box
                    id={mapPanelId}
                    sx = {{
                        width:'100%',
                        minHeight: '700px',
                    }}
                >
                    <Map panelId={mapPanelId}>
                        <Controls>
                            <NavigationControl/>
                            <DisplayCoordinate/>
                        </Controls>
                    </Map>
                </Box>
            </CardContent>
        </Card>
    );
}

const OverviewCard = () => {
    return(
        <Stack direction="row" spacing={2}>

        </Stack>
    );
}

export {
    MapCard,
    OverviewCard
}