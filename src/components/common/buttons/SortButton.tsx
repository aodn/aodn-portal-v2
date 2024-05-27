import { IconButton } from "@mui/material";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import React from "react";
import ActionButtonPaper from "./ActionButtonPaper";
import RelevancyIcon from "../../icon/RelevancyIcon";

const SortButton = () => {
  return (
    <ActionButtonPaper>
      <IconButton>
        <RelevancyIcon />
        <ArrowDropDownSharpIcon />
      </IconButton>
    </ActionButtonPaper>
  );
};

export default SortButton;
