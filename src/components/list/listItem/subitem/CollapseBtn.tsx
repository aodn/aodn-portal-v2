import React from "react";
import { IconButton } from "@mui/material";
import { ExpandLess } from "../../../../assets/icons/details/expandLess";
import { ExpandMore } from "../../../../assets/icons/details/expendMore";
import rc8Theme from "../../../../styles/themeRC8";

interface CollapseBtnProps {
  onClick: () => void;
  isExpanded: boolean;
}

const CollapseBtn: React.FC<CollapseBtnProps> = ({ onClick, isExpanded }) => {
  return (
    <IconButton
      aria-label="expand or collapse"
      onClick={onClick}
      sx={{
        ":hover": { bgcolor: "transparent" },
      }}
    >
      {isExpanded ? (
        <ExpandLess color={rc8Theme.palette.text2} />
      ) : (
        <ExpandMore color={rc8Theme.palette.text2} />
      )}
    </IconButton>
  );
};

export default CollapseBtn;
