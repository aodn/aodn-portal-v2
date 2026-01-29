import { Box } from "@mui/material";
import useBreakpoint from "../../../hooks/useBreakpoint";
import {
  AODN_SITE_LOGO_HEIGHT,
  AODN_SITE_LOGO_HEIGHT_MOBILE,
} from "../constant";
import { pageDefault } from "../../common/constants";
import { IconImosLogoWithTitle } from "../../../assets/images/banner_logo_with_title";

const AODNSiteLogo = () => {
  const { isMobile } = useBreakpoint();
  return (
    <Box
      component={"a"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: isMobile ? AODN_SITE_LOGO_HEIGHT_MOBILE : AODN_SITE_LOGO_HEIGHT,
        minWidth: "320px",
        cursor: "pointer",
      }}
      href={pageDefault.landing}
    >
      <IconImosLogoWithTitle data-testid="imos-logo" />
    </Box>
  );
};

export default AODNSiteLogo;
