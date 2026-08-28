import React from "react";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ControlProps } from "./Definition";
import { switcherIconButtonSx } from "./MenuControl";
import MenuHintTooltip from "./MenuHintTooltip";

interface ResetSelectionsProps extends ControlProps {
  disabled?: boolean;
  onReset?: () => void;
  hint?: string;
}

const RESET_ID = "map-reset-selections-button";

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
            ...switcherIconButtonSx(false),
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
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
