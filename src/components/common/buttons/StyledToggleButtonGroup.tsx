import { ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/system";

import { fontFamily, fontSize, gap, padding } from "../../../styles/constants";

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: gap.lg,
  padding: padding.extraSmall,
  "& .MuiToggleButton-root": {
    textTransform: "capitalize",
    padding: padding.extraSmall,
    fontSize: fontSize.label,
    fontFamily: fontFamily.general,
  },
});
