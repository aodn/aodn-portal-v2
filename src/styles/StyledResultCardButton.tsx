import { styled } from "@mui/system";
import { Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { borderRadius } from "./constants";

interface StyledResultCardButtonProps {
  isOnGoing?: string;
}

const StyledResultCardButton = styled(Button)<StyledResultCardButtonProps>(
  ({ theme, isOnGoing = undefined }) => ({
    color:
      isOnGoing === "true"
        ? theme.palette.success.main
        : isOnGoing === "false"
          ? theme.palette.primary.light
          : alpha(theme.palette.info.dark, 0.8),
    height: theme.spacing(4),
    borderRadius: borderRadius.small,
    boxShadow: theme.shadows[1],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  })
);

export default StyledResultCardButton;
