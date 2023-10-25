import * as React from 'react';
import {Grid, Box} from '@mui/material';
import {SmartCard_1_1, SmartCard_2_1, SmartCard_2_2} from "./SmartCard";
import {margin} from "../common/constants";

const ComplexSmartPanel = () => {

    return (
        <Grid container>
            <Grid item xs={12}>
                {
                    // Create a container inside the item which occupy all area, then
                    // set justify content to center, now within the container set a smaller
                    // item so that the item is center in the container
                }
                <Grid container justifyContent='center'>
                    <Grid item xs={8}>
                        <Box
                            display='grid'
                            marginTop={margin['tripleTop']}
                            marginBottom={margin['tripleBottom']}
                            gridTemplateColumns="repeat(9, 1fr)"
                            gridTemplateRows='repeat(2, 95px)'
                            gap={2}
                            sx ={{
                                overflowX: 'auto',
                                overflowY: 'hidden'
                            }}
                        >
                            <SmartCard_2_1 caption='Get started' imageUrl='/smartcard/getstarted.png'/>
                            <SmartCard_2_2 caption='Surface Waves' imageUrl='/smartcard/wave.png'/>
                            <SmartCard_1_1 caption='Satellite' imageUrl='/smartcard/satellite.png'/>
                            <SmartCard_1_1 caption='Reef' imageUrl='/smartcard/reef.png'/>
                            <SmartCard_1_1 caption='Location' imageUrl='/smartcard/location.png'/>
                            <SmartCard_2_1 caption='Advanced Search' imageUrl='/smartcard/advancedSearch.png'/>
                            <SmartCard_1_1 caption='Tutorials' imageUrl='/smartcard/tutorial.png'/>
                            <SmartCard_1_1 caption='All Topics' imageUrl='/smartcard/all_topics.png'/>
                            <SmartCard_1_1 caption='Ocean Biota' imageUrl='/smartcard/leave.png'/>
                            <SmartCard_2_1 caption='Explore on Map' imageUrl='/smartcard/explorerOnMap.png'/>
                            <SmartCard_1_1 caption='Fishery' imageUrl='/smartcard/fishery.png'/>
                            <SmartCard_1_1 caption='Tourism' imageUrl='/smartcard/tour.png'/>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );

}

export default ComplexSmartPanel;