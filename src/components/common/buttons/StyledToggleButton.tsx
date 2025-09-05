import { ToggleButton } from "@mui/material";
import { styled } from "@mui/system";
import rc8Theme from "../../../styles/themeRC8";

export const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: "none",
  backgroundColor: rc8Theme.palette.primary6,
  padding: "10px 10px",
  "&.Mui-selected": {
    border: `3px solid ${rc8Theme.palette.primary1}`,
    backgroundColor: "#fff",
    color: "#FFF",
    "&:hover": {
      backgroundColor: "rc8Theme.palette.primary1",
    },
  },
}));
