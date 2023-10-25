import * as React from 'react';
import {Grid} from "@mui/material";
import StoryBoard from "./StoryBoard";
import grey from '../common/colors/grey'

const StoryBoardPanel = () => {
    return(
        <Grid container sx={{
            backgroundColor: grey['storyBoard']
        }}>
            <Grid item xs={12}>
                <Grid container justifyContent='center'>
                    <Grid item xs={8}>
                        <StoryBoard/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default StoryBoardPanel;