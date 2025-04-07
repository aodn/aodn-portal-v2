import { styled } from "@mui/system";
import { Button, ButtonProps } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { borderRadius } from "../../../styles/constants";

interface StyledResultCardButtonProps extends ButtonProps {
  determinedcolor?: string;
  isbordered?: boolean; // Changed to boolean
}

const StyledResultCardButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== "determinedcolor" && prop !== "isbordered",
})<StyledResultCardButtonProps>(({ theme, determinedcolor, isbordered }) => ({
  color: determinedcolor ?? alpha(theme.palette.info.dark, 0.8),
  height: theme.spacing(4),
  borderRadius: borderRadius.small,
  boxShadow: isbordered ? (theme.shadows as Array<string>)[1] : "none",
  padding: theme.spacing(0, 2), // Combined paddingLeft and paddingRight
  whiteSpace: "nowrap" as const, // Type assertion for CSS property
}));

export default StyledResultCardButton;
