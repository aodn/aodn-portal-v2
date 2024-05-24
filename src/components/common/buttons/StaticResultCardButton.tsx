import StyledResultCardButton from "../../../styles/StyledResultCardButton";
import React from "react";

interface StaticResultCardButtonProps {
  text: string;
  startIcon?: React.ReactNode;
  onClick: (event: any) => void;
  isbordered?: string;
}

const StaticResultCardButton: React.FC<StaticResultCardButtonProps> = ({
  text,
  startIcon,
  onClick,
  isbordered = "true",
}) => {
  return (
    <StyledResultCardButton
      size="small"
      startIcon={startIcon}
      onClick={onClick}
      disabled={onClick === undefined}
      isbordered={isbordered}
    >
      {text}
    </StyledResultCardButton>
  );
};

export default StaticResultCardButton;
