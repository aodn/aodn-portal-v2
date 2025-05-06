import { memo, useEffect } from "react";
import { useLocation } from "react-router-dom";

// ScrollToTop component scrolls window to top when route changes
const ScrollToTop = memo(() => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
});
ScrollToTop.displayName = "ScrollToTop";
export default ScrollToTop;
