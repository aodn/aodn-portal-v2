import { ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/system";

import { padding } from "./constants";

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "auto auto auto auto",
    gridGap: theme.spacing(1.25),
    padding: padding.small,
  })
);
