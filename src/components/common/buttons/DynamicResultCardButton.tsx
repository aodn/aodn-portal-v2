import React, { useCallback } from "react";
import StyledResultCardButton from "./StyledResultCardButton";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface DynamicResultCardButtonProps {
  status?: "unknown" | "onGoing" | "completed";
  onClick: () => void;
  isBordered?: boolean;
}

interface ToolKit {
  text: string;
  color: string;
  icon: React.ReactNode;
}

// currently only the data status button is dynamic. Please refactor if other buttons are dynamic
const DynamicResultCardButton: React.FC<DynamicResultCardButtonProps> = ({
  status = "unknown",
  onClick,
  isBordered = true,
}) => {
  const theme = useTheme();

  const tk = useCallback(
    (status: string | undefined): ToolKit => {
      const STATUS_MAP: Record<string, ToolKit> = {
        onGoing: {
          text: "On Going",
          color: theme.palette.success.main,
          icon: <DoubleArrowIcon />,
        },
        completed: {
          text: "Completed",
          color: theme.palette.primary.light,
          icon: <TaskAltSharpIcon />,
        },
        unknown: {
          text: "No Status",
          color: alpha(theme.palette.info.dark, 0.8),
          icon: <QuestionMarkIcon />,
        },
      };
      return STATUS_MAP[status ? status : "unknown"];
    },
    [theme]
  );

  return (
    <StyledResultCardButton
      size="small"
      startIcon={tk(status).icon}
      onClick={onClick}
      disabled={onClick === undefined}
      determinedcolor={tk(status).color}
      isbordered={isBordered}
    >
      {tk(status).text}
    </StyledResultCardButton>
  );
};

export default DynamicResultCardButton;
