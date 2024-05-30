import { ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/system";

import { gap, padding } from "./constants";

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: gap.md,
  padding: padding.extraSmall,
});
