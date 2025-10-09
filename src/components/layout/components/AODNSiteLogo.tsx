import { Box, Divider, Typography } from "@mui/material";
import IMOS from "@/assets/logos/imos_logo_with_title.png";
import {
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";
import useRedirectHome from "../../../hooks/useRedirectHome";
import { openInNewTab } from "../../../utils/LinkUtils";
import useBreakpoint from "../../../hooks/useBreakpoint";
import { AODN_SITE_LOGO_WIDTH, AODN_SITE_LOGO_WIDTH_MOBILE } from "../constant";

const AODNSiteLogo = () => {
  const { isMobile } = useBreakpoint();
  const redirectHome = useRedirectHome();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          cursor: "pointer",
        }}
        onClick={() => openInNewTab("https://imos.org.au/")}
      >
        <img
          height={isMobile ? AODN_SITE_LOGO_WIDTH_MOBILE : AODN_SITE_LOGO_WIDTH}
          src={IMOS}
          alt="IMOS Logo"
          style={{ paddingRight: padding.medium }}
          data-testid="imos-logo"
        />
      </Box>
      <Divider orientation="vertical" flexItem></Divider>
      <Box
        sx={{
          cursor: "pointer",
        }}
        onClick={() => redirectHome("AODNSiteLogo", true)}
      >
        <Typography
          textAlign="left"
          fontFamily={fontFamily.helvetica}
          fontSize={
            isMobile
              ? fontSize.AODNSiteLogoTextMobile
              : fontSize.AODNSiteLogoText
          }
          fontWeight={fontWeight.medium}
          color={fontColor.blue.header}
          padding={0}
          paddingLeft={padding.medium}
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
