import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ScrollToTop component scrolls window to top when route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
