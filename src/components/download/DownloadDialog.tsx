import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import { useMemo } from "react";
import DataSelection from "./DataSelection";
import LicenseContent from "./LicenseContent";
import { useDownloadDialog } from "../../hooks/useDownloadDialog";
import EmailInputStep from "./EmailInputStep";
import { DialogHeader } from "./DialogHeader";
import DialogStepper from "./stepper/DialogStepper";
import StepperButton from "./stepper/StepperButton";
import useBreakpoint from "../../hooks/useBreakpoint";

interface DownloadDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface Step {
  number: number;
  label: string;
}

const steps: Step[] = [
  { number: 1, label: "Input your email address" },
  { number: 2, label: "Usage limitation and licenses" },
];

const DownloadDialog = ({ isOpen, setIsOpen }: DownloadDialogProps) => {
  const theme = useTheme();
  const { isUnderLaptop } = useBreakpoint();

  const {
    emailInputRef,
    activeStep,
    isProcessing,
    isSuccess,
    processingStatus,
    email,
    emailError,
    dataUsage,
    hasDownloadConditions,
    subsettingSelectionCount,
    handleIsClose,
    handleStepClick,
    handleStepperButtonClick,
    handleDataUsageChange,
    handleClearEmail,
    handleFormSubmit,
    getProcessStatusText,
    getStepperButtonTitle,
    setEmailError,
  } = useDownloadDialog(isOpen, setIsOpen);

  // Determine if DataSelection should be shown
  const shouldShowDataSelection =
    hasDownloadConditions && subsettingSelectionCount >= 1;

  const getButtonStatus = () => {
    const isFailure = processingStatus && !processingStatus.startsWith("2");
    if (isSuccess) return "completed";
    if (isFailure) return "error";
    if (isProcessing) return "loading";
    return "default";
  };

  const getDisplayText = () => {
    const isFailure = processingStatus && !processingStatus.startsWith("2");
    if (isSuccess || isFailure) {
      return getProcessStatusText();
    }
    return getStepperButtonTitle();
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: isUnderLaptop ? "column" : "row",
            gap: isUnderLaptop ? 0 : shouldShowDataSelection ? 3 : 0,
            flex: 1,
          }}
        >
          {/* Only show DataSelection when subsettingSelectionCount >= 1 */}
          {shouldShowDataSelection && (
            <Box
              sx={{
                width: isUnderLaptop ? "100%" : "300px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: isUnderLaptop ? 0 : 2.5,
                }}
              >
                Data Selection
              </Typography>
              <DataSelection />
            </Box>
          )}

          {/* Only show divider when DataSelection is visible on mobile */}
          {isUnderLaptop && shouldShowDataSelection && (
            <Divider sx={{ my: 2 }} />
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <EmailInputStep
              isUnderLaptop={isUnderLaptop}
              emailInputRef={emailInputRef}
              email={email}
              dataUsage={dataUsage}
              onDataUsageChange={handleDataUsageChange}
              emailError={emailError}
              onClearEmail={handleClearEmail}
              setEmailError={setEmailError}
            />
          </Box>
        </Box>
      );
    }

    // Step 1: License Agreement
    return (
      <Box sx={{ flex: 1 }}>
        <Box sx={{ flex: 1 }}>
          <input
            type="hidden"
            name="email"
            value={email || emailInputRef.current?.value || ""}
          />
          <LicenseContent />
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleIsClose}
      maxWidth={false}
      fullScreen={isUnderLaptop}
      PaperProps={{
        component: activeStep === 1 ? "form" : "div",
        onSubmit: activeStep === 1 ? handleFormSubmit : undefined,
        sx: {
          borderRadius: 0.5,
          position: isUnderLaptop ? "static" : "fixed",
          transform: isUnderLaptop ? "none" : "translateY(0)",
          width: isUnderLaptop ? "auto" : "1024px",
          height: isUnderLaptop ? "auto" : "720px",
          maxWidth: isUnderLaptop ? "calc(100vw - 16px)" : "1024px",
          maxHeight: isUnderLaptop ? "calc(100vh - 32px)" : "720px",
          minWidth: isUnderLaptop ? "auto" : "600px",
          margin: isUnderLaptop ? "16px 8px" : "auto",
          display: "flex",
          flexDirection: "column",
          [theme.breakpoints.between("md", "lg")]: {
            width: "90vw",
            maxWidth: "1024px",
            height: "auto",
            maxHeight: "80vh",
          },
        },
      }}
    >
      {/* Dialog Header */}
      <DialogHeader onClose={handleIsClose} />

      {/* Stepper Section */}
      <Box
        sx={{
          px: isUnderLaptop ? 2 : 4,
          py: 2,
          flexShrink: 0,
          backgroundColor: "#fff",
          zIndex: 1,
        }}
      >
        <DialogStepper
          steps={steps}
          activeStep={activeStep}
          onStepClick={handleStepClick}
          testId="dialog-stepper"
        />
      </Box>

      {/* Main Content */}
      <DialogContent
        sx={{
          px: isUnderLaptop ? 2 : 4,
          py: 2,
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderStepContent()}
      </DialogContent>

      {/* Action Buttons */}
      <DialogActions
        sx={{
          p: isUnderLaptop ? 2 : 3,
          pt: 1,
          justifyContent: isUnderLaptop ? "center" : "flex-end",
          gap: 2,
          my: 1,
          flexShrink: 0,
        }}
      >
        <StepperButton
          title={getStepperButtonTitle()}
          statusText={getDisplayText()}
          onClick={handleStepperButtonClick}
          disabled={isProcessing || !!emailError}
          status={getButtonStatus()}
        />
      </DialogActions>
    </Dialog>
  );
};

export default DownloadDialog;
