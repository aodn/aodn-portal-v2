import React from "react";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ControlProps } from "./Definition";
import { portalTheme } from "../../../../../styles";
import MenuHintTooltip from "./MenuHintTooltip";

interface ResetSelectionsProps extends ControlProps {
  disabled?: boolean;
  onReset?: () => void;
  hint?: string;
}

const RESET_ID = "map-reset-selections-button";

// Standalone control rendered below the MenuControlGroup, not inside it
const resetSelectionsButtonSx = (disabled: boolean) => ({
  "&.MuiIconButton-root.MuiIconButton-root": {
    backgroundColor: "#FFF",
    color: portalTheme.palette.grey700,
    width: "42px",
    height: "42px",
    padding: "2px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.10)",
    cursor: disabled ? "not-allowed" : "pointer",
    "& svg": {
      width: "26px",
      height: "26px",
      opacity: disabled ? 0.5 : 1,
    },
    "&:hover": {
      backgroundColor: portalTheme.palette.primary4,
      "& svg": {
        filter: "brightness(0)",
      },
    },
    "&.Mui-focusVisible": {
      backgroundColor: portalTheme.palette.grey300,
    },
  },
});

const ResetSelections: React.FC<ResetSelectionsProps> = ({
  disabled = false,
  onReset,
  hint = "Reset All Selections",
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <MenuHintTooltip hint={hint} disable={disabled}>
        <IconButton
          aria-label="Reset Selections"
          id={RESET_ID}
          data-testid={RESET_ID}
          onClick={onReset}
          disabled={disabled}
          sx={{
            ...resetSelectionsButtonSx(disabled),
            "&.MuiIconButton-root": { border: "0px solid transparent" },
            "&.Mui-disabled": {
              border: "0px solid transparent",
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </MenuHintTooltip>
    </Box>
  );
};

export default ResetSelections;
