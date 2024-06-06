import React, { useMemo } from "react";
import StyledResultCardButton from "../../../styles/StyledResultCardButton";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface DynamicResultCardButtonProps {
  status: string;
  onClick: () => void;
  isbordered?: string;
}

interface ToolKit {
  text: string;
  color: string;
  icon: React.ReactNode;
}
// currently only the data status button is dynamic. Please refactor if other buttons are dynamic
const DynamicResultCardButton: React.FC<DynamicResultCardButtonProps> = ({
  status = "un known",
  onClick,
  isbordered = "true",
}) => {
  const theme = useTheme();

  const onGoingKit: ToolKit = useMemo(
    () => ({
      text: "On Going",
      color: theme.palette.success.main,
      icon: <DoubleArrowIcon />,
    }),
    [theme]
  );

  const completedKit: ToolKit = useMemo(
    () => ({
      text: "Completed",
      color: theme.palette.primary.light,
      icon: <TaskAltSharpIcon />,
    }),
    [theme]
  );

  const unknownKit: ToolKit = useMemo(
    () => ({
      text: "No Status",
      color: alpha(theme.palette.info.dark, 0.8),
      icon: <QuestionMarkIcon />,
    }),
    [theme]
  );

  let toolKit: ToolKit = unknownKit;
  if (status?.toLowerCase().trim() === "ongoing") {
    toolKit = onGoingKit;
  } else if (status?.toLowerCase().trim() === "completed") {
    toolKit = completedKit;
  }

  return (
    <StyledResultCardButton
      size="small"
      startIcon={toolKit.icon}
      onClick={onClick}
      disabled={onClick === undefined}
      determinedcolor={toolKit.color}
      isbordered={isbordered}
    >
      {toolKit.text}
    </StyledResultCardButton>
  );
};

export default DynamicResultCardButton;
