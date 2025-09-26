import React from "react";
import { IconButton } from "@mui/material";
import rc8Theme from "../../../../styles/themeRC8";
import { ExpandLess } from "../../../../assets/icons/details/expandLess";
import { ExpandMore } from "../../../../assets/icons/details/expendMore";

interface CollapseBtnProps {
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isExpanded: boolean;
  iconColor?: string;
}

const CollapseBtn: React.FC<CollapseBtnProps> = ({
  setIsExpanded,
  isExpanded,
  iconColor,
}) => {
  return (
    <IconButton
      aria-label="expand or collapse"
      onClick={() => setIsExpanded((prev) => !prev)}
    >
      {isExpanded ? (
        <ExpandLess color={iconColor} />
      ) : (
        <ExpandMore color={iconColor} />
      )}
    </IconButton>
  );
};

export default CollapseBtn;
