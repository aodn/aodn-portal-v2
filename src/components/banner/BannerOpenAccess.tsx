import { Box, Grid, Typography, useTheme } from "@mui/material";
import {
  fontSize,
  fontWeight,
  gap,
  margin,
  padding,
} from "../../styles/constants";

const BannerOpenAccess = () => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        marginY: margin.quadruple,
      }}
    >
      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <Typography
            sx={{
              fontSize: fontSize.bannerTitle,
              color: "white",
              textAlign: "left",
              pr: padding.small,
              textShadow: theme.shadows[3],
            }}
            variant="h1"
          >
            Open Access <br /> to Ocean Data
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ justifyContent: "right", display: "flex" }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
              whiteSpace: "nowrap",
              fontSize: fontSize.bannerSubtitle,
              fontWeight: fontWeight.extraLight,
              letterSpacing: gap.sm,
              pr: padding.small,
              textShadow: theme.shadows[4],
            }}
          >
            The gateway to Australian marine and climate science data
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BannerOpenAccess;
