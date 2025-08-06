import { ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/system";
import rc8Theme from "../../../styles/themeRC8";

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "14px 12px",
  margin: "8px 20px",
  "& .MuiToggleButton-root": {
    borderRadius: "6px",
    textTransform: "capitalize",
    ...rc8Theme.typography.body1Medium,
    color: rc8Theme.palette.text1,
  },
});
