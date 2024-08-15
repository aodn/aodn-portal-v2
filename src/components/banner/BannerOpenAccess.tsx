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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "end",
          }}
        >
          <Typography
            sx={{
              fontSize: fontSize.bannerTitleMedium,
              fontWeight: fontWeight.extraLight,
              color: "white",
              textAlign: "left",
              padding: 0,
              textShadow: theme.shadows[3],
            }}
          >
            Open Access to
          </Typography>
          <Typography
            sx={{
              fontSize: fontSize.bannerTitleLarge,
              fontWeight: fontWeight.bold,
              color: "white",
              textAlign: "left",
              padding: 0,
              mt: -4,
              textShadow: theme.shadows[3],
            }}
          >
            Ocean Data
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
              fontWeight: fontWeight.light,
              letterSpacing: gap.sm,
              pr: padding.small,
              textShadow: theme.shadows[4],
            }}
          >
            &quot;The gateway to Australian marine and climate science
            data&rdquo;
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BannerOpenAccess;
