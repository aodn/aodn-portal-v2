import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import useBreakpoint from "@/hooks/useBreakpoint";
import useRedirectHome from "@/hooks/useRedirectHome";
import {
  AODN_SITE_LOGO_HEIGHT,
  AODN_SITE_LOGO_HEIGHT_MOBILE,
} from "@/app/layout/constant";
import { pageDefault } from "@/components/common/constants";
import { ImosMobileLogoIcon } from "@/components/icon/ImosMobileLogoIcon";
import imosLogoMark from "@/assets/logos/imos-logo-mark.webp";
import { portalTheme } from "@/styles";

const LOGO_MARK_TO_DIVIDER_GAP = "18px";
const LOGO_DIVIDER_TO_TEXT_GAP = "16px";
const LOGO_DIVIDER_HEIGHT = "64px";

const DesktopLogo = () => (
  <Box
    data-testid="imos-logo"
    sx={{ display: "flex", alignItems: "center", height: "100%" }}
  >
    <img
      src={imosLogoMark}
      width={282}
      height={145}
      alt="Integrated Marine Observing System"
      decoding="async"
      style={{ height: "100%", width: "auto", display: "block" }}
    />
    <Box
      aria-hidden
      sx={{
        width: "1px",
        height: LOGO_DIVIDER_HEIGHT,
        ml: LOGO_MARK_TO_DIVIDER_GAP,
        mr: LOGO_DIVIDER_TO_TEXT_GAP,
        backgroundColor: portalTheme.palette.primary1,
        opacity: 0.5,
        flexShrink: 0,
      }}
    />
    <Box
      component="span"
      sx={{
        fontFamily: portalTheme.designTokens.typography.fontFamily.poppins,
        fontWeight: 300,
        fontSize: "17px",
        lineHeight: "22px",
        color: portalTheme.palette.primary1,
        whiteSpace: "nowrap",
      }}
    >
      Australian Ocean
      <br />
      Data Network
    </Box>
  </Box>
);

const AODNSiteLogo = () => {
  const { isMobile } = useBreakpoint();
  const { pathname } = useLocation();
  const redirectHome = useRedirectHome();
  const isLandingPage = pathname === pageDefault.landing;

  return (
    <Box
      component={"a"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        height: isMobile ? AODN_SITE_LOGO_HEIGHT_MOBILE : AODN_SITE_LOGO_HEIGHT,
        minWidth: isMobile ? "0" : "320px",
        cursor: isLandingPage ? "default" : "pointer",
        textDecoration: "none",
        "& svg": {
          maxWidth: "100%",
          height: "auto",
        },
      }}
      href={pageDefault.landing}
      aria-label="AODN Portal home"
      onClick={(e) => {
        e.preventDefault();
        redirectHome("AODNSiteLogo", true);
      }}
      data-testid="aodn-home-link"
    >
      {isMobile ? (
        <ImosMobileLogoIcon data-testid="imos-logo" />
      ) : (
        <DesktopLogo />
      )}
    </Box>
  );
};

export default AODNSiteLogo;
