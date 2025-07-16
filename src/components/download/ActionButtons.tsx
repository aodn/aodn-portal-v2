import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Cancel as CancelIcon } from "@mui/icons-material";
import { SuccessIcon } from "../../assets/icons/download/success";
import StepperButton from "./stepper/StepperButton";

interface ActionButtonProps {
  isSuccess: boolean;
  isProcessing: boolean;
  processingStatus: string;
  getStepperButtonTitle: () => string;
  getProcessStatusText: () => string;
  handleStepperButtonClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  isSuccess,
  isProcessing,
  processingStatus,
  getStepperButtonTitle,
  getProcessStatusText,
  handleStepperButtonClick,
}) => {
  const isFailure = processingStatus && !processingStatus.startsWith("2");

  if (isSuccess) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          backgroundColor: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          cursor: "default",
        }}
      >
        <SuccessIcon />
        <Typography sx={{ p: 0 }}>{getProcessStatusText()}</Typography>
      </Box>
    );
  }

  if (isFailure) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          backgroundColor: "#ffffff",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={handleStepperButtonClick}
      >
        <CancelIcon sx={{ color: "#dc2626", fontSize: "1.5rem" }} />
        <Typography sx={{ color: "#dc2626", p: 0 }}>
          {getProcessStatusText()}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <StepperButton
        title={getStepperButtonTitle()}
        onClick={handleStepperButtonClick}
        disabled={isProcessing}
      />
      {isProcessing && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
            color: "#2E7D9A",
          }}
        />
      )}
    </Box>
  );
};

export default ActionButton;
