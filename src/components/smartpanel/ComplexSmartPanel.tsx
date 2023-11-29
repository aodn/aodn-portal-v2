import * as React from 'react';
import {Grid, Box, Divider, SxProps, Theme, IconButton} from '@mui/material';
import {margin} from "../common/constants";
import {useCallback, useRef} from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

interface ComplexSmartPanelProps {
    columns? :number,
    rows?: number,
    height: string,
    bottomDivider? : boolean,
    gridColumns: number,
    sx?: SxProps<Theme>
};

const ComplexSmartPanel = (props : React.PropsWithChildren<ComplexSmartPanelProps>) => {
    const boxRef = useRef<HTMLDivElement>(null);

    const scroll = useCallback((scrollOffset : number) => {
        if(boxRef && boxRef.current) {
            boxRef.current.scrollLeft += scrollOffset;
        }
    },[boxRef]);

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
                    <IconButton
                        onClick={() => scroll(-50)}
                        sx={{ "&:hover": { background: "none" } }}
                    >
                        <ArrowLeftIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <Grid item xs={props.gridColumns}>
                        <Box
                            ref={boxRef}
                            sx ={{ overflow: 'hidden' }}
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
                    <IconButton
                        onClick={() => scroll(50)}
                        sx={{ "&:hover": { background: "none" } }}
                    >
                        <ArrowRightIcon sx={{ height: 38, width: 38 }}/>
                    </IconButton>
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
    gridColumns: 8,
    height: '95px',
    bottomDivider: false
}

export default ComplexSmartPanel;