import { SvgIcon } from "@mui/material";
import rc8Theme from "../../styles/themeRC8";

const PlusIcon = () => {
  return (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M11.5 4.35156V17.8516M18.25 11.1016H4.75"
        stroke={rc8Theme.palette.primary1}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default PlusIcon;
