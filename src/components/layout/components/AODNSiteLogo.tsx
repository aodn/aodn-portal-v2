import { Box, Divider, Typography } from "@mui/material";
import IMOS from "@/assets/logos/imos_logo_with_title.png";
import {
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  padding,
} from "../../../styles/constants";
import useRedirectHome from "../../../hooks/useRedirectHome";
import { openInNewTab } from "../../../utils/LinkUtils";
import useBreakpoint from "../../../hooks/useBreakpoint";
import {
  AODN_SITE_LOGO_HEIGHT,
  AODN_SITE_LOGO_HEIGHT_MOBILE,
} from "../constant";
import rc8Theme from "../../../styles/themeRC8";

const AODNSiteLogo = () => {
  const { isMobile } = useBreakpoint();
  const redirectHome = useRedirectHome();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: isMobile ? AODN_SITE_LOGO_HEIGHT_MOBILE : AODN_SITE_LOGO_HEIGHT,
      }}
    >
      <Box
        sx={{
          cursor: "pointer",
          height: "100%",
        }}
        onClick={() => openInNewTab("https://imos.org.au/")}
      >
        <img
          src={IMOS}
          alt="IMOS Logo"
          style={{
            height: "100%",
            width: "auto",
            objectFit: "contain",
          }}
          data-testid="imos-logo"
        />
      </Box>
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          bgcolor: `${rc8Theme.palette.primary1}`,
          opacity: "50%",
          width: "1px",
          mx: { xs: "12px", md: "18px" },
          my: "6px",
        }}
      />
      <Box
        sx={{
          cursor: "pointer",
        }}
        onClick={() => redirectHome("AODNSiteLogo", true)}
      >
        <Typography
          textAlign="left"
          lineHeight={lineHeight.heading}
          fontFamily={fontFamily.poppins}
          fontSize={{
            xs: fontSize.AODNSiteLogoTextMobile,
            md: fontSize.AODNSiteLogoText,
          }}
          fontWeight={fontWeight.light}
          color={fontColor.blue.header}
          padding={0}
          data-testid="aodn-home-link"
        >
          Australian Ocean <br />
          Data Network
        </Typography>
      </Box>
    </Box>
  );
};

export default AODNSiteLogo;
