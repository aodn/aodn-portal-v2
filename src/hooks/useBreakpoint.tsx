import { useMediaQuery, useTheme } from "@mui/material";
import { BREAKPOINT } from "../components/layout/constant";

const useBreakpoint = () => {
  const theme = useTheme();
  return {
    isSmallMobile: useMediaQuery(`(max-width:${BREAKPOINT.SMALL_MOBILE}px)`), // 320–360; temporary for very tight mobile layouts
    isLargeMobile: useMediaQuery(`(max-width:${BREAKPOINT.LARGE_MOBILE}px)`), // ≤ 430; temporary for phone layouts (covers small mobile)
    isMobile: useMediaQuery(theme.breakpoints.down("sm")), // < 768
    isTablet: useMediaQuery(theme.breakpoints.between("sm", "md")), // 768–1024
    isLaptop: useMediaQuery(theme.breakpoints.between("md", "lg")), // 1024–1440
    isDesktop: useMediaQuery(theme.breakpoints.between("lg", "xl")), // 1440–1920
    is4K: useMediaQuery(theme.breakpoints.up("xl")), // 1920+
    isAboveDesktop: useMediaQuery(theme.breakpoints.up("lg")), // 1440+
    isUnderLaptop: useMediaQuery(theme.breakpoints.down("md")), // < 1024
  };
};

export default useBreakpoint;
