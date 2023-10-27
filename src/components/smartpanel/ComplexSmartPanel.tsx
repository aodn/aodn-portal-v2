import * as React from 'react';
import {Grid, Box, Divider, SxProps, Theme} from '@mui/material';
import {margin} from "../common/constants";

interface ComplexSmartPanel {
    columns? :number,
    rows?: number,
    height: string,
    bottomDivider? : boolean,
    sx?: SxProps<Theme>
};

const ComplexSmartPanel = (props : React.PropsWithChildren<ComplexSmartPanel>) => {

    return (
        <Grid container>
            <Grid item xs={12}>
                {
                    // Create a container inside the item which occupy all area, then
                    // set justify content to center, now within the container set a smaller
                    // item so that the item is center in the container

                    // The minWidth may need to calculate instead of hardcode
                }
                <Grid container justifyContent='center'>
                    <Grid item xs={8}>
                        <Box
                            sx ={{
                                overflowX: 'scroll',
                                overflowY: 'hidden'
                            }}
                        >
                            <Box
                                display='grid'
                                minWidth='1200px'
                                marginTop={margin['tripleTop']}
                                marginBottom={margin['tripleBottom']}
                                gridTemplateColumns={'repeat(' + props.columns + ', 1fr)'}
                                gridTemplateRows={'repeat(' + props.rows + ', ' + props.height + ')'}
                                gap={2}
                                sx={props.sx}
                            >
                                {props.children}
                            </Box>
                        </Box>
                    </Grid>
                    {props.bottomDivider &&
                      <Grid item xs={8}>
                        <Divider sx={{ borderBottomWidth: 5 }}/>
                      </Grid>
                    }
                </Grid>
            </Grid>
        </Grid>
    );

}

ComplexSmartPanel.defaultProps = {
    columns: 9,
    rows: 2,
    height: '95px',
    bottomDivider: false
}

export default ComplexSmartPanel;