import { useMediaQuery, useTheme } from "@mui/material";

const useBreakpoint = () => {
  const theme = useTheme();
  return {
    isMobile: useMediaQuery(theme.breakpoints.down("sm")),
    isTablet: useMediaQuery(theme.breakpoints.between("sm", "md")),
    isLaptop: useMediaQuery(theme.breakpoints.between("md", "lg")),
    isDesktop: useMediaQuery(theme.breakpoints.between("lg", "xl")),
    is4K: useMediaQuery(theme.breakpoints.up("xl")),
    isAboveLaptop: useMediaQuery(theme.breakpoints.up("md")),
    isUnderLaptop: useMediaQuery(theme.breakpoints.down("md")),
  };
};

export default useBreakpoint;
