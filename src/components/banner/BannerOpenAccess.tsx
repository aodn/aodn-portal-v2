import { Box, Grid, Typography } from "@mui/material";

const BannerOpenAccess = () => {
  return (
    <Grid container>
      <Grid
        item
        xs={11}
        sx={{
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <Grid container justifyContent="left">
          <Grid xs={6} item>
            &nbsp;
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={10}>
              <Box sx={{ justifyContent: "right", display: "flex" }}>
                <Typography
                  sx={{
                    fontSize: "70px",
                    color: "white",
                    textAlign: "left",
                    pr: "10px",
                    textShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  }}
                  variant="h1"
                >
                  Open Access <br /> to Ocean Data
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={10}>
              <Box sx={{ justifyContent: "right", display: "flex" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "white",
                    whiteSpace: "nowrap",
                    fontSize: "20px",
                    fontWeight: 200,
                    letterSpacing: "0.1em",
                    pr: "10px",
                    textShadow: "0 0 30px rgba(0, 0, 0, 1.9)",
                  }}
                >
                  The gateway to Australian marine and climate science data
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BannerOpenAccess;
