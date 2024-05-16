import StyledResultCardButton from "../../../styles/StyledResultCardButton.tsx";
import React from "react";

interface ResultCardButtonProps {
  text: string;
  startIcon?: React.ReactNode;
  onClick: (event: any) => void;
}

const ResultCardButton: React.FC<ResultCardButtonProps> = ({
  text,
  startIcon,
  onClick,
}) => {
  const judgeIsOnGoing = (): string => {
    if (text.toLowerCase().trim() === "on going") {
      return "true";
    }
    if (text.toLowerCase().trim() === "completed") {
      return "false";
    }
    return undefined;
  };

  return (
    <StyledResultCardButton
      isOnGoing={judgeIsOnGoing()}
      size="small"
      startIcon={startIcon}
      onClick={onClick}
      disabled={onClick === undefined}
    >
      {text}
    </StyledResultCardButton>
  );
};

export default ResultCardButton;
