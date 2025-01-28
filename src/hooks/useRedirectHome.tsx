import { useNavigate } from "react-router-dom";
import { pageDefault } from "../components/common/constants";

const useRedirectHome = () => {
  const navigate = useNavigate();

  return (referer: string, fromNavigate: boolean = true) => {
    navigate(pageDefault.landing, {
      state: {
        referer: referer,
        fromNavigate: fromNavigate,
      },
    });
  };
};

export default useRedirectHome;
