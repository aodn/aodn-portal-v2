import { IconButton } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React from "react";

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
      {isExpanded ? <ExpandLess /> : <ExpandMore />}
    </IconButton>
  );
};

export default CollapseBtn;
