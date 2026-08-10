import React from "react";
import { IconButton } from "@mui/material";
import { ExpandLess } from "../../../../assets/icons/details/expandLess";
import { ExpandMore } from "../../../../assets/icons/details/expendMore";
import { portalTheme } from "../../../../styles";

interface CollapseBtnProps {
  onClick: () => void;
  isExpanded: boolean;
}

// Invisible area around the 36x23 button that reaches the 44px touch target
const TOUCH_AREA_EXTENSION = "-11px -8px";

const CollapseBtn: React.FC<CollapseBtnProps> = ({ onClick, isExpanded }) => {
  return (
    <IconButton
      aria-label="expand or collapse"
      onClick={onClick}
      edge="end"
      sx={{
        ":hover": { bgcolor: "transparent" },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: TOUCH_AREA_EXTENSION,
        },
      }}
    >
      {isExpanded ? (
        <ExpandLess color={portalTheme.palette.text2} />
      ) : (
        <ExpandMore color={portalTheme.palette.text2} />
      )}
    </IconButton>
  );
};

export default CollapseBtn;
