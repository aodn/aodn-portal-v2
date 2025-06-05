import { FC } from "react";
import { Button, useTheme } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import {
  color,
  fontSize,
  fontFamily,
  fontWeight,
  gap,
} from "../../../styles/constants";

interface StepperButtonProps {
  id?: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

const StepperButton: FC<StepperButtonProps> = ({
  id,
  title,
  onClick,
  disabled = false,
  fullWidth = false,
}) => {
  const theme = useTheme();

  return (
    <Button
      id={id}
      data-testid={id}
      disabled={disabled}
      endIcon={
        <DoubleArrowIcon
          sx={{
            color: theme.palette.primary.light,
            width: "23px",
            height: "23px",
          }}
        />
      }
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "40px",
        width: fullWidth ? "100%" : "auto",
        gap: gap.lg,
        px: "32px",
        mx: gap.xlg,
        border: `1px solid ${theme.palette.primary.light}`,
        backgroundColor: theme.palette.common.white,
        color: color.gray.dark,
        "&:hover": {
          border: `2px solid ${theme.palette.primary.light}`,
          bgcolor: color.white.sixTenTransparent,
        },
        "&:disabled": {
          backgroundColor: theme.palette.action.disabledBackground,
          color: theme.palette.action.disabled,
          border: `2px solid ${theme.palette.action.disabled}`,
          opacity: 0.6,
        },
        borderRadius: theme.borderRadius?.sm || "5px",
        textAlign: "center",
        textTransform: "none",
        fontWeight: fontWeight.regular,
        fontSize: fontSize.slideCardTitle,
        fontFamily: fontFamily.openSans,
        lineHeight: "22px",
        transition: "all 0.2s ease-in-out",
      }}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default StepperButton;
