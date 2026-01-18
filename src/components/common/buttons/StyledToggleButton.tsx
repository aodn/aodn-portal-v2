import { ToggleButton } from "@mui/material";
import { styled } from "@mui/system";
import { portalTheme } from "../../../styles";

export const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: "none",
  backgroundColor: portalTheme.palette.primary6,
}));
