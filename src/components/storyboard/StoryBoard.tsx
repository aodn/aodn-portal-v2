import * as React from 'react';
import {Box, CardContent, Typography, Grid} from '@mui/material';
import RoundButton from '../common/buttons/RoundButton';
import {border} from '../common/constants';

interface ButtonEvent {
    label: string, 
    onClick?: (event: React.MouseEvent<HTMLButtonElement> | undefined) => void
}

interface StoryBoardProps {
    url: string,
    caption: string,
    content: string,
    isActive?: boolean,
    buttons? : Array<ButtonEvent>
};

const StoryBoard = (props: StoryBoardProps) => {
    return (
        <Box sx={{display: props?.isActive ? 'flex' : 'none'}}>
            <CardContent>
                <iframe style= {{
                            border: border['frameBorder'],
                            minWidth: '290px'
                        }}
                        height="100%"
                        src={props.url}
                        title={props.caption}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen>        
                </iframe>
            </CardContent>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div" variant="h5">
                        {props.caption}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" component="div" style={{ lineHeightStep: "30px" }}>
                        {props.content}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" component="div" style={{ lineHeightStep: "30px" }}>
                        &nbsp;
                    </Typography>
                    <Typography variant="body1" color="text.secondary" component="div" style={{ lineHeightStep: "30px" }}>
                        &nbsp;
                    </Typography>
                    <Grid container spacing={3}>
                        {props.buttons &&
                            props.buttons?.map((button) => {
                                return (
                                    <Grid item xs='auto'>
                                        <RoundButton variant="outlined" size="small" onClick={button.onClick}>{button.label}</RoundButton>
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>
                </CardContent>
            </Box>
        </Box>
    );
};

export default StoryBoard;