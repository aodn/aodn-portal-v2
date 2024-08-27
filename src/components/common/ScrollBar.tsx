import { GlobalStyles } from "@mui/material";
import { color } from "../../styles/constants";

// TODO: firefox browser does not support webkit, need to find a way to fix
const Scrollbar = () => (
  <GlobalStyles
    styles={{
      "*::-webkit-scrollbar": {
        width: "8px",
        borderRadius: "4px",
      },
      "*::-webkit-scrollbar-button": {
        display: "none",
      },
      "*::-webkit-scrollbar-thumb": {
        borderRadius: "4px",
        backgroundColor: color.blue.dark,
        minHeight: "24px",
        border: "none",
        cursor: "pointer",
      },
      "*::-webkit-scrollbar-corner": {
        backgroundColor: color.blue.xLight,
      },
      "*::-webkit-scrollbar-track": {
        backgroundColor: color.blue.xLight,
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      },
    }}
  />
);

export default Scrollbar;
