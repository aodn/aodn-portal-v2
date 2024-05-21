import React, { useMemo } from "react";
import StyledResultCardButton from "../../../styles/StyledResultCardButton.tsx";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface DynamicResultCardButtonProps {
  status: string;
  onClick: () => void;
}

interface toolKit {
  text: string;
  color: string;
  icon: React.ReactNode;
}
// currently only the data status button is dynamic. Please refactor if other buttons are dynamic
const DynamicResultCardButton: React.FC<DynamicResultCardButtonProps> = ({
  status,
  onClick,
}) => {
  const theme = useTheme();

  const onGoingKit: toolKit = useMemo(
    () => ({
      text: "On Going",
      color: theme.palette.success.main,
      icon: <DoubleArrowIcon />,
    }),
    [theme]
  );

  const completedKit: toolKit = useMemo(
    () => ({
      text: "Completed",
      color: theme.palette.primary.light,
      icon: <TaskAltSharpIcon />,
    }),
    [theme]
  );

  const unknownKit: toolKit = useMemo(
    () => ({
      text: "no status",
      color: alpha(theme.palette.info.dark, 0.8),
      icon: <QuestionMarkIcon />,
    }),
    [theme]
  );

  let toolKit: toolKit = unknownKit;
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
      determinedColor={toolKit.color}
    >
      {toolKit.text}
    </StyledResultCardButton>
  );
};

export default DynamicResultCardButton;
