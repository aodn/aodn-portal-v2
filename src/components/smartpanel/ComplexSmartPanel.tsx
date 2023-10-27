import * as React from 'react';
import {Grid, Box} from '@mui/material';
import {SmartCard_1_1, SmartCard_2_1, SmartCard_2_2} from "./SmartCard";
import {margin} from "../common/constants";

interface ComplexSmartPanel {
    columns? :number,
    rows?: number
};

const ComplexSmartPanel = (props : React.PropsWithChildren<ComplexSmartPanel>) => {

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
                            gridTemplateColumns={'repeat(' + props.columns + ', 1fr)'}
                            gridTemplateRows={'repeat(' + props.rows + ', 95px)'}
                            gap={2}
                            sx ={{
                                overflowX: 'auto',
                                overflowY: 'hidden'
                            }}
                        >
                            {props.children}
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );

}

ComplexSmartPanel.defaultProps = {
    columns: 9,
    rows: 2
}

export default ComplexSmartPanel;