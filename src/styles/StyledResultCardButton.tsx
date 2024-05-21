import { styled } from "@mui/system";
import { Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { borderRadius } from "./constants";

interface StyledResultCardButtonProps {
  determinedColor?: string;
}

const StyledResultCardButton = styled(Button)<StyledResultCardButtonProps>(
  ({ theme, determinedColor = alpha(theme.palette.info.dark, 0.8) }) => ({
    color: determinedColor,
    height: theme.spacing(4),
    borderRadius: borderRadius.small,
    boxShadow: theme.shadows[1],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    whiteSpace: "nowrap",
  })
);

export default StyledResultCardButton;
