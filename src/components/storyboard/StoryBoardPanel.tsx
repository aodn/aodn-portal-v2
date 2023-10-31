import * as React from 'react';
import { Grid } from "@mui/material";
import StoryBoard from "./StoryBoard";
import grey from '../common/colors/grey';
import { margin } from '../common/constants';
import { UnderlineTab, UnderlineTabs } from '../common/tabs/UnderlineTabs';

const StoryBoardPanel = () => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return(
        <Grid container sx={{
            backgroundColor: grey['storyBoard']
        }}>
            <Grid item xs={12}>
                <Grid 
                    container 
                    justifyContent='center'
                    marginTop={margin['tripleTop']}
                    marginBottom={margin['tripleBottom']}
                >
                    <Grid item xs={8}>
                        <StoryBoard 
                                    isActive={value === 0}
                                    url='https://www.youtube.com/embed/hOb9oELCp4Q?si=A39K_92ZBmJztncL'
                                    caption='Data Story 01 : Autonomous Underwater Vehicle Program'
                                    content='The NISK Habitat Map was created by the University of Tasmania for a partnership between the Department of Climate Change and the National Land and Water Resources Audit. It supports the DCC/Audit partnership by providing a nationally consistent set of the available mapping data'
                                    buttons={[
                                        { label: 'Metadata' },
                                        { label: 'NISB maps' },
                                        { label: 'netCDF' } 
                                    ]}
                                />
                        <StoryBoard 
                                    isActive={value === 1}
                                    url='https://www.youtube.com/embed/AGaLVYoM1E8?si=wcqO_3BhCLdK88e7'
                                    caption='Data Story 02 : What is Australias Integrated Marine Observing System (IMOS)?'
                                    content='What is Australias Integrated Marine Observing System (IMOS)?'
                                    buttons={[
                                        { label: 'Metadata' },
                                        { label: 'NISB maps' },
                                        { label: 'netCDF' } 
                                    ]}
                                />
                        <StoryBoard 
                                    isActive={value === 2}
                                    url='https://www.youtube.com/embed/xamjQ9hgEpk?si=QDvoDzO0bpzLVhGS'
                                    caption='Data Story 03 : Integrated Marine Observing System (IMOS) Southern Ocean flux station buoy'
                                    content='IMOS is celebrating the successful retrieval of the first moored weather buoy deployed in the remote Southern Ocean.
                                    Marine and climate scientists are still analysing the wealth of data relayed back to shore by the South Ocean Flux Station about this climatically important region of the world. The data includes hourly observations of wind, temperature, humidity, air pressure, sunlight and rain.'
                                    buttons={[
                                        { label: 'Metadata' },
                                        { label: 'NISB maps' },
                                        { label: 'netCDF' } 
                                    ]}
                                />                                
                    </Grid>
                    <Grid item xs={6}>
                        <UnderlineTabs
                            value={value} 
                            onChange={handleChange} 
                        >
                            <UnderlineTab/>
                            <UnderlineTab/>
                            <UnderlineTab/>
                        </UnderlineTabs>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default StoryBoardPanel;