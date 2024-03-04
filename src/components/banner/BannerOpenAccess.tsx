import { Box, Grid, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';

interface BannerProps {
  isDisplay?: boolean;
}

const BannerOpenAccess = (props: BannerProps) => {
  return (
    <Collapse in={props.isDisplay}>
      <Grid container>
        <Grid
          item
          xs={11}
          sx={{
            marginTop: '40px',
            marginBottom: '40px',
          }}
        >
          <Grid container justifyContent="left">
            <Grid xs={7} item>
              &nbsp;
            </Grid>
            <Grid item xs={5}>
              <Grid item xs={10}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '70px',
                      color: 'white',
                      textAlign: 'left',
                      textShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    }}
                    variant="h1"
                  >
                    Open Access <br /> to Ocean Data
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography
                    sx={{
                      color: 'white',
                      whiteSpace: 'nowrap',
                      textAlign: 'right',
                      fontSize: '20px',
                      fontWeight: 200,
                      letterSpacing: '0.1em',
                      textShadow: '0 0 30px rgba(0, 0, 0, 1.9)',
                    }}
                  >
                    "The gateway to Australian marine and climate science data."
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Collapse>
  );
};

BannerOpenAccess.defaultProps = {
  isDisplay: true,
};

export default BannerOpenAccess;
