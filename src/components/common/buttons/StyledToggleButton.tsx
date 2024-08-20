import { ToggleButton } from "@mui/material";
import { styled } from "@mui/system";
import { color } from "../../../styles/constants";

export const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  boxShadow: (theme as any).shadows[2],
  border: "none",
  borderRadius: 0,
  backgroundColor: "#fff",
  "&.Mui-selected": {
    backgroundColor: color.blue.dark,
    color: "white",
    "&:hover": {
      backgroundColor: color.blue.dark,
    },
  },
}));
