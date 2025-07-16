import React from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  margin,
  padding,
} from "../../styles/constants";
import AppTheme from "../../utils/AppTheme";
import StyledStepper from "./stepper/StyledStepper";
import DataSelection from "./DataSelection";
import LicenseContent from "./LicenseContent";
import { useDownloadDialog } from "../../hooks/useDownloadDialog";
import EmailInputStep from "./EmailInputStep";
import ActionButton from "./ActionButtons";

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

const LicenseStep: React.FC<{
  email: string;
  emailInputRef: React.RefObject<HTMLInputElement>;
}> = ({ email, emailInputRef }) => {
  return (
    <Box sx={{ flex: 1 }}>
      <input
        type="hidden"
        name="email"
        value={email || emailInputRef.current?.value || ""}
      />
      <LicenseContent />
    </Box>
  );
};

const DialogHeader: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  return (
    <DialogTitle
      sx={{
        position: "relative",
        boxShadow: "0px 1.8px 10px 0px rgba(0, 0, 0, 0.15)",
        height: "48px",
        flexShrink: 0,
        paddingTop: 1,
        paddingBottom: 0.5,
        marginBottom: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: AppTheme.palette.primary.main,
            textAlign: "center",
            textShadow: "0px 0px 5.074px #FFF",
            fontFamily: fontFamily.openSans,
            fontSize: fontSize.detailPageHeading,
            fontStyle: "normal",
            fontWeight: fontWeight.bold,
            lineHeight: "24.356px",
            padding: padding.nil,
            margin: margin.nil,
          }}
        >
          Dataset Download
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close dialog"
          sx={{
            position: "absolute",
            right: 0,
            color: fontColor.gray.medium,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: "1.3rem" }} />
        </IconButton>
      </Box>
    </DialogTitle>
  );
};

const DownloadDialog: React.FC<DownloadDialogProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 0 : hasDownloadConditions ? 3 : 0,
            flex: 1,
          }}
        >
          {hasDownloadConditions && (
            <Box
              sx={{
                width: isMobile ? "100%" : "300px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: isMobile ? 0 : 2.5,
                }}
              >
                Data Selection
              </Typography>
              <DataSelection />
            </Box>
          )}

          {isMobile && hasDownloadConditions && <Divider sx={{ my: 2 }} />}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <EmailInputStep
              isMobile={isMobile}
              emailInputRef={emailInputRef}
              email={email}
              dataUsage={dataUsage}
              onDataUsageChange={handleDataUsageChange}
              emailError={emailError}
              onClearEmail={handleClearEmail}
            />
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ flex: 1 }}>
        <LicenseStep email={email} emailInputRef={emailInputRef} />
      </Box>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleIsClose}
      maxWidth={false}
      fullScreen={isMobile}
      PaperProps={{
        component: activeStep === 1 ? "form" : "div",
        onSubmit: activeStep === 1 ? handleFormSubmit : undefined,
        sx: {
          borderRadius: 0.5,
          position: isMobile ? "static" : "fixed",
          transform: isMobile ? "none" : "translateY(0)",
          width: isMobile ? "auto" : "1024px",
          height: isMobile ? "auto" : "720px",
          maxWidth: isMobile ? "calc(100vw - 16px)" : "1024px",
          maxHeight: isMobile ? "calc(100vh - 32px)" : "720px",
          minWidth: isMobile ? "auto" : "600px",
          margin: isMobile ? "16px 8px" : "auto",
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
      <DialogHeader onClose={handleIsClose} />

      <Box
        sx={{
          px: isMobile ? 2 : 4,
          py: 2,
          flexShrink: 0,
          backgroundColor: "#fff",
          zIndex: 1,
        }}
      >
        <StyledStepper
          steps={steps}
          activeStep={activeStep}
          onStepClick={handleStepClick}
        />
      </Box>

      <DialogContent
        sx={{
          px: isMobile ? 2 : 4,
          py: 2,
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderStepContent()}
      </DialogContent>

      <DialogActions
        sx={{
          p: isMobile ? 2 : 3,
          pt: 1,
          justifyContent: isMobile ? "center" : "flex-end",
          gap: 2,
          my: 1,
          flexShrink: 0,
        }}
      >
        <ActionButton
          isSuccess={isSuccess}
          isProcessing={isProcessing}
          processingStatus={processingStatus}
          getStepperButtonTitle={getStepperButtonTitle}
          getProcessStatusText={getProcessStatusText}
          handleStepperButtonClick={handleStepperButtonClick}
        />
      </DialogActions>
    </Dialog>
  );
};

export default DownloadDialog;
