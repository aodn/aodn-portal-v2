import { ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/system";

import {
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  gap,
  padding,
} from "./constants";

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: gap.lg,
  padding: padding.extraSmall,
  "& .MuiToggleButton-root": {
    padding: padding.extraSmall,
    fontSize: fontSize.label,
    fontFamily: fontFamily.general,
    fontWeight: fontWeight.medium,
    color: `${fontColor.gray.medium}`,
  },
});
