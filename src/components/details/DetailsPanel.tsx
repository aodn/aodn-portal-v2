import {OGCCollection} from "../common/store/searchReducer";
import {border, borderRadius, margin} from "../common/constants";
import {Grid, Box, Card} from "@mui/material";
import { DetailsHeader, DetailsHeaderButton } from "./DetailsHeader";
import React from "react";
import {MapCard} from "./DetailsCards";

export interface DetailsProps {
    collection? : OGCCollection,
}

const DetailsPanel = (props : DetailsProps) => {
    return(
        <Grid id={'details-page-panel'} container>
            <Grid item
                  xs={12}
                  sx={{
                      marginTop: margin['top'],
                      marginBottom: margin['bottom']
                  }}>
                <Grid container id='details-page-center-panel' justifyContent='center' spacing={2} gap={1}>
                    <Grid item xs={8}>
                        <DetailsHeaderButton collection={props.collection}/>
                    </Grid>
                    <Grid item xs={8}>
                        <DetailsHeader collection={props.collection}/>
                    </Grid>
                    <Grid item xs={8}>
                        <Box
                            display='grid'
                            gridTemplateColumns={'repeat(6, 1fr)'}
                        >
                            <Box
                                sx={{
                                    gridColumn: 'span 5',
                                    gridRow: 'span 1',
                                    border: border['frameBorder'],
                                    borderRadius: borderRadius['filter']
                                }}>
                                <MapCard/>
                            </Box>
                            <Box
                                sx={{
                                    gridColumn: 'span 1',
                                    gridRow: 'span 1'
                                }}>
                                <Card>

                                </Card>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default DetailsPanel;