import { ToggleButton } from "@mui/material";
import { styled } from "@mui/system";

export const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  boxShadow: "1px 1px 10px 1px #d4d4d4",
  borderRadius: "0px",
  backgroundColor: theme.palette.common.white,
  fontSize: "14px",
  fontWeight: "600",
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
