import { Box, Divider, Typography } from "@mui/material";
import IMOS from "@/assets/logos/imos_logo_with_title.png";
import {
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";
import useRedirectHome from "../../../hooks/useRedirectHome";
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
        " &:hover": {
          cursor: "pointer",
        },
      }}
      onClick={() => redirectHome("AODNSiteLogo", true)}
    >
      <img
        height={isMobile ? AODN_SITE_LOGO_WIDTH_MOBILE : AODN_SITE_LOGO_WIDTH}
        src={IMOS}
        alt="IMOS Logo"
        style={{ paddingRight: padding.medium }}
      />
      <Divider orientation="vertical" flexItem></Divider>
      <Typography
        textAlign="left"
        fontSize={
          isMobile ? fontSize.AODNSiteLogoTextMobile : fontSize.AODNSiteLogoText
        }
        fontWeight={fontWeight.medium}
        color={fontColor.blue.dark}
        padding={0}
        paddingLeft={padding.medium}
      >
        Australian Ocean <br />
        Data Network
      </Typography>
    </Box>
  );
};

export default AODNSiteLogo;
