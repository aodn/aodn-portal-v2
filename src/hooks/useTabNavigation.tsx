import { useNavigate } from "react-router-dom";

const useTabNavigation = () => {
  const navigate = useNavigate();

  const navigateToTab = (pageUrl: string, tab: string) => {
    navigate(`${pageUrl}&tab=${tab}`);
  };

  return navigateToTab;
};

export default useTabNavigation;
