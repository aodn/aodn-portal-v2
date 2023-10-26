import * as React from 'react';
import {Grid, Tabs, Tab} from "@mui/material";
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
                                    url='https://www.youtube.com/embed/hOb9oELCp4Q?si=A39K_92ZBmJztncL'
                                    caption='Data Story 01 : Autonomous Underwater Vehicle Program'
                                    content='The NISK Habitat Map was created by the University of Tasmania for a partnership between the Department of Climate Change and the National Land and Water Resources Audit. It supports the DCC/Audit partnership by providing a nationally consistent set of the available mapping data'
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