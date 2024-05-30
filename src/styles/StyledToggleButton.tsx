import { ToggleButton } from "@mui/material";
import { styled } from "@mui/system";
import { fontSize, fontWeight } from "./constants";

export const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: 0,
  backgroundColor: theme.palette.common.white,
  fontSize: fontSize.mapMenuItem,
  fontWeight: fontWeight.bold,
  fontFamily: "Noto Sans",
  textTransform: "capitalize",
  "&.Mui-selected": {
    backgroundColor: theme.palette.info.dark,
    color: "white",
    "&:hover": {
      // no need to extract this color into constant.js, because it will change in the future
      backgroundColor: "#274e65",
    },
  },
}));
