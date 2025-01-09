import { Box, Stack, Typography, useTheme } from "@mui/material";
import {
  fontSize,
  fontWeight,
  gap,
  margin,
  padding,
} from "../../../../styles/constants";

const BannerOpenAccess = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        marginY: { xs: margin.md, sm: margin.quadruple },
        width: "100%",
      }}
    >
      <Stack direction="column" justifyContent="center" alignItems="end">
        <Typography
          sx={{
            fontSize: { xs: "32px", sm: fontSize.bannerTitleMedium },
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
            fontSize: { xs: "38px", sm: fontSize.bannerTitleLarge },
            fontWeight: fontWeight.bold,
            color: "white",
            textAlign: "left",
            padding: 0,
            mt: -2,
            textShadow: theme.shadows[3],
          }}
        >
          Ocean Data
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: fontSize.bannerSubtitle },
            fontWeight: fontWeight.light,
            letterSpacing: gap.sm,
            color: "white",
            whiteSpace: "wrap",
            textAlign: "right",
            pr: padding.small,
            textShadow: theme.shadows[4],
          }}
        >
          &quot;The gateway to Australian marine and climate science data&rdquo;
        </Typography>
      </Stack>
    </Box>
  );
};

export default BannerOpenAccess;
