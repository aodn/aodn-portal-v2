import * as React from 'react';
import {Grid} from '@mui/material';

interface BannerProps {
    isDisplay?: boolean ,
}

const BannerOpenAccess = (props : BannerProps) => {

    let banner = <></>; // Empty item;

    if(props.isDisplay === undefined || props.isDisplay) {
        banner =
            <Grid container>
                <Grid item xs={11}
                      sx={{
                          marginTop: '40px',
                          marginBottom: '40px'
                      }}>
                    <Grid container justifyContent="left">
                        <Grid xs={7} item>&nbsp;</Grid>
                        <Grid
                            item
                            xs={4} sx={{
                                fontSize: '70px',
                                color: 'white',
                                textShadow: '3px 3px lightgrey'
                            }}>
                            Open Access to Ocean Data
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
    }

    return(banner);
};

export default BannerOpenAccess;
