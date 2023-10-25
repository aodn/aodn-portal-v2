import * as React from 'react';
import {Box, CardContent, Typography} from '@mui/material';

const StoryBoard = () => {
    return (
        <Box sx={{display: 'flex'}}>
            <CardContent>
                <iframe width="560" height="315"
                        src="https://www.youtube.com/embed/hOb9oELCp4Q?si=A39K_92ZBmJztncL"
                        title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen></iframe>
            </CardContent>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div" variant="h5">
                        Live From Space
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                    </Typography>
                </CardContent>
            </Box>
        </Box>
    );
};

export default StoryBoard;