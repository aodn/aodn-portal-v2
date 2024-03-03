import {Grid, Typography} from '@mui/material';
import Collapse from '@mui/material/Collapse';

interface BannerProps {
    isDisplay?: boolean ,
}

const BannerOpenAccess = (props : BannerProps) => {

    return (
        <Collapse in={props.isDisplay}>
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
                            xs={4}>
                            <Typography
                            sx={{
                                fontSize: '70px',
                                color: 'white',
                                textAlign: 'left',                      
                            }}
                            variant='h1'
                            >Open Access to Ocean Data</Typography> 
                            <Typography
                                 sx={{
                                     color: 'white',
                                     textAlign: 'left',                      
                                 }}>
                                The gateway to Australian marine and climate science data
                            </Typography>                               
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Collapse>
    );
};

BannerOpenAccess.defaultProps = {
    isDisplay: true
}

export default BannerOpenAccess;
