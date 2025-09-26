import React from "react";
import { IconButton } from "@mui/material";
import rc8Theme from "../../../../styles/themeRC8";
import { ExpandLess } from "../../../../assets/icons/details/expandLess";
import { ExpandMore } from "../../../../assets/icons/details/expendMore";

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
