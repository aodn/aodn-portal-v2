import { styled } from "@mui/system";
import { Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { borderRadius } from "./constants";

interface StyledResultCardButtonProps {
  determinedcolor?: string;
  isbordered?: string;
}

const StyledResultCardButton = styled(Button)<StyledResultCardButtonProps>(
  ({
    theme,
    determinedcolor = alpha(theme.palette.info.dark, 0.8),
    isbordered,
  }) => ({
    color: determinedcolor,
    height: theme.spacing(4),
    borderRadius: borderRadius.small,
    boxShadow: isbordered === "true" ? (theme as any).shadows[1] : "none",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    whiteSpace: "nowrap",
  })
);

export default StyledResultCardButton;
