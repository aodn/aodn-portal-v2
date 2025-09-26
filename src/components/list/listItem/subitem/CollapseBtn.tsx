import { IconButton } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import React from "react";
import rc8Theme from "../../../../styles/themeRC8";
import { ExpandMore } from "@mui/icons-material";

interface CollapseBtnProps {
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isExpanded: boolean;
}

const CollapseBtn: React.FC<CollapseBtnProps> = ({
  setIsExpanded,
  isExpanded,
}) => {
  return (
    <IconButton
      aria-label="expand or collapse"
      onClick={() => setIsExpanded((prev) => !prev)}
    >
      {isExpanded ? (
        <ExpandLess sx={{ color: rc8Theme.palette.primary1 }} />
      ) : (
        <ExpandMore sx={{ color: rc8Theme.palette.primary1 }} />
      )}
    </IconButton>
  );
};

export default CollapseBtn;
