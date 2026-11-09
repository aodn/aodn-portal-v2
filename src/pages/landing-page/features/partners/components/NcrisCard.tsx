import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { portalTheme } from "@/styles";
import useBreakpoint from "@/hooks/useBreakpoint";
import NCRISLogo from "@/assets/partners/ncris-logo.webp";
import { PARTNERS_COLOURS } from "../constants";

const NcrisCard: FC = () => {
  const { isMobile } = useBreakpoint();

  return (
    <Box
      data-testid="ncris-card"
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? "16px" : "34px",
        mt: isMobile ? "40px" : "53px",
        p: isMobile ? "20px" : "22px 40px",
        bgcolor: portalTheme.palette.neutral2,
        border: `1px solid ${PARTNERS_COLOURS.cardBorder}`,
        borderRadius: portalTheme.borderRadius.lg,
        boxShadow: `0 1px 3px ${alpha(PARTNERS_COLOURS.imosCard1, 0.06)}`,
      }}
    >
      <Box
        component="img"
        src={NCRISLogo}
        alt="National Research Infrastructure for Australia (NCRIS)"
        loading="lazy"
        decoding="async"
        sx={{
          flex: "none",
          width: "auto",
          height: isMobile ? "84px" : "110px",
        }}
      />
      <Typography
        component="p"
        variant="title2Regular"
        sx={{ maxWidth: "1070px", color: PARTNERS_COLOURS.bodyText }}
      >
        Australia&rsquo;s Integrated Marine Observing System (IMOS) is enabled
        by the National Collaborative Research Infrastructure Strategy (NCRIS).
        It is operated by a consortium of institutions as an unincorporated
        joint venture, with the University of Tasmania as Lead Agent.
      </Typography>
    </Box>
  );
};

export default NcrisCard;
