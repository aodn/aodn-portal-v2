import React, { useState, useEffect } from 'react'
import {Card, Grid} from "@mui/material";
import ResultCard from "./ResultCard";

const ResultCards = () => {
    return(
        <Grid container direction={'column'}>
            <ResultCard
                title={'IMOS - ANMN South Australia (SA) Deep Slope Mooring (SAM1DS)'}
                status={'completed'}
                imageUrl={''}
                description={'The data available from this mooring was designed to monitor particular oceanographic phenomena in coastal ocean waters. The mooring is located at Latitude:-36.52, Longitude:136.24 and trim the rest'}/>
        </Grid>
    );
};

export default ResultCards;