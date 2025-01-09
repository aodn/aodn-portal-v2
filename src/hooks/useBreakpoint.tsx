/*
320px  - xs (mobile)
768px  - sm (tablet)
1280px - md (laptop/desktop)
1440px - lg (large desktop)
1920px - xl (extra large/4K)
*/

import { useMediaQuery, useTheme } from "@mui/material";

const useBreakpoint = () => {
  const theme = useTheme();
  return {
    isMobile: useMediaQuery(theme.breakpoints.down("sm")),
    isTablet: useMediaQuery(theme.breakpoints.between("sm", "md")),
    isLaptop: useMediaQuery(theme.breakpoints.between("md", "lg")),
    isDesktop: useMediaQuery(theme.breakpoints.between("lg", "xl")),
    is4K: useMediaQuery(theme.breakpoints.up("xl")),
  };
};

export default useBreakpoint;
