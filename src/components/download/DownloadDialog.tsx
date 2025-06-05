import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";
import { DatasetDownloadRequest } from "../../pages/detail-page/context/DownloadDefinitions";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../common/store/hooks";
import { processDatasetDownload } from "../common/store/searchReducer";
import {
  getDateConditionFrom,
  getMultiPolygonFrom,
} from "../../utils/DownloadConditionUtils";
import {
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  margin,
  padding,
} from "../../styles/constants";
import AppTheme from "../../utils/AppTheme";
import StepperButton from "./stepper/StepperButton";
import StyledStepper from "./stepper/StyledStepper";
import DataSelection from "./DataSelection";
import LicenseContent from "./LicenseContent";
import DataUsageForm, { DataUsageInformation } from "./DataUsageForm";

interface DownloadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface Step {
  number: number;
  label: string;
}

const TIMEOUT_LIMIT = 8000;

const steps: Step[] = [
  { number: 1, label: "Input your email address" },
  { number: 2, label: "Usage limitation and licenses" },
];

const DownloadDialog: React.FC<DownloadDialogProps> = ({ open, setOpen }) => {
  const { uuid } = useParams<{ uuid: string }>();
  const dispatch = useAppDispatch();
  const { downloadConditions } = useDetailPageContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const emailInputRef = useRef<HTMLInputElement>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dataUsage, setDataUsage] = useState<DataUsageInformation>({
    purposes: [],
    sectors: [],
    allowContact: null,
  });

  const hasDownloadConditions = useMemo(() => {
    return downloadConditions && downloadConditions.length > 0;
  }, [downloadConditions]);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setProcessingStatus("");
      setEmail("");
      setDataUsage({
        purposes: [],
        sectors: [],
        allowContact: null,
      });
      if (emailInputRef.current) {
        emailInputRef.current.value = "";
      }
    }
  }, [open]);

  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        setProcessingStatus("408");
        setIsProcessing(false);
      }, TIMEOUT_LIMIT);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  const dateRange = useMemo(
    () => getDateConditionFrom(downloadConditions),
    [downloadConditions]
  );

  const multiPolygon = useMemo(
    () => getMultiPolygonFrom(downloadConditions),
    [downloadConditions]
  );

  const handleClose = useCallback(() => {
    setProcessingStatus("");
    setActiveStep(0);
    setEmail("");
    setDataUsage({
      purposes: [],
      sectors: [],
      allowContact: null,
    });
    setIsProcessing(false);
    setOpen(false);
  }, [setOpen]);

  const handleStepClick = useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  const handleNext = useCallback(() => {
    if (activeStep === 0) {
      setActiveStep(1);
    }
  }, [activeStep]);

  const submitJob = useCallback(
    (email: string) => {
      if (!uuid) {
        setIsProcessing(false);
        return;
      }

      const normalizedEmail = email.toLowerCase();

      const request: DatasetDownloadRequest = {
        inputs: {
          uuid: uuid,
          recipient: normalizedEmail,
          start_date: dateRange.start,
          end_date: dateRange.end,
          multi_polygon: multiPolygon,
        },
      };

      dispatch(processDatasetDownload(request))
        .unwrap()
        .then((response) => {
          if (response && response.status && response.status.message) {
            setProcessingStatus(response.status.message);
          } else {
            setProcessingStatus("200");
          }
          setIsProcessing(false);
        })
        .catch((error) => {
          if (error && error.response && error.response.status) {
            setProcessingStatus(error.response.status.toString());
          } else {
            setProcessingStatus("500");
          }
          setIsProcessing(false);
        });
    },
    [dateRange.end, dateRange.start, dispatch, multiPolygon, uuid]
  );

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsProcessing(true);
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const emailFromForm = formJson.email;

      if (emailFromForm) {
        submitJob(emailFromForm);
      } else {
        setIsProcessing(false);
      }
    },
    [submitJob]
  );

  const handleButtonClick = useCallback(() => {
    if (activeStep === 0) {
      // Step 1: Validate and save email
      const emailValue = emailInputRef.current?.value?.trim() || "";

      // Email required validation
      if (!emailValue) {
        alert("Please enter your email address");
        emailInputRef.current?.focus();
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        alert("Please enter a valid email address");
        emailInputRef.current?.focus();
        return;
      }

      setEmail(emailValue); // Save to state for display in step 2
      handleNext();
    } else {
      // Step 2: Submit download request
      // Get current value from ref first, then from saved state
      const emailToSubmit = emailInputRef.current?.value?.trim() || email;

      if (!emailToSubmit) {
        alert("Email address is required");
        return;
      }

      if (!uuid) {
        alert("Dataset UUID is missing");
        return;
      }

      setIsProcessing(true);
      submitJob(emailToSubmit);
    }
  }, [activeStep, email, handleNext, submitJob, uuid]);

  const getProcessStatusText = useCallback((): string => {
    if (processingStatus === "") {
      return "";
    }
    if (/^5\d{2}$/.test(processingStatus)) {
      return "Failed! Please try again later";
    }
    if (/^2\d{2}$/.test(processingStatus)) {
      return "Succeeded! An email will be sent to you shortly";
    }
    if (processingStatus === "408") {
      return "Request timeout! Please try again later";
    }
    if (/^4\d{2}$/.test(processingStatus)) {
      return "Failed! Please try again later";
    }
    return "Something went wrong";
  }, [processingStatus]);

  const getButtonTitle = useCallback(() => {
    if (activeStep === 0) {
      return "Next";
    } else {
      return "I understand, process download";
    }
  }, [activeStep]);

  // Step 1: Email input content with data usage
  const EmailInputContent: React.FC = () => (
    <Box sx={{ pl: isMobile ? 1 : 2 }}>
      <Typography variant="h6">Your Email Address</Typography>

      <TextField
        required
        id="email"
        name="email"
        label="Email Address"
        placeholder="example@email.com"
        type="email"
        fullWidth
        variant="standard"
        inputRef={emailInputRef}
        sx={{
          mt: 0.5,
          mb: 2,
          height: "41px",
          flexShrink: 0,
          "& .MuiInputBase-root": {
            height: "41px",
            backgroundColor: "#E5EEF5",
            opacity: 0.7,
            borderRadius: 0,
            "&:before": {
              borderBottom: "1px solid #595959",
            },
            "&:hover:not(.Mui-disabled):before": {
              borderBottom: "1px solid #595959",
            },
            "&:after": {
              borderBottom: "2px solid #595959",
            },
          },
          "& .MuiInputBase-input": {
            fontSize: isMobile ? "0.875rem" : "1rem",
            backgroundColor: "#E5EEF5",
            padding: "8px 12px",
            height: "calc(41px - 16px)",
            boxSizing: "border-box",
          },
          "& .MuiInputLabel-root": {
            fontSize: isMobile ? "0.875rem" : "1rem",
            "&.Mui-focused": {
              color: "#595959",
            },
          },
        }}
      />

      <Box sx={{ ml: 2, my: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: fontColor.gray.dark,
            lineHeight: isMobile ? 1.4 : 1.5,
          }}
        >
          Processing dataset download may take some time. It is varied by the
          size of the dataset, the selected conditions, and the server load (may
          take several seconds to several hours or even more). Please provide
          your email address to receive the download link and necessary
          information.
        </Typography>
      </Box>

      <DataUsageForm
        isMobile={isMobile}
        dataUsage={dataUsage}
        setDataUsage={setDataUsage}
      />
    </Box>
  );

  // Step 2: License content only
  const LicenseContentOnly: React.FC = () => (
    <Box sx={{ flex: 1 }}>
      <input
        type="hidden"
        name="email"
        value={email || emailInputRef.current?.value || ""}
      />
      <LicenseContent />
    </Box>
  );

  const ProcessingStatus: React.FC = () => {
    if (!processingStatus) return null;

    return (
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            color: processingStatus.startsWith("2")
              ? "success.main"
              : "error.main",
          }}
        >
          {getProcessStatusText()}
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullScreen={isMobile}
      PaperProps={{
        component: activeStep === 1 ? "form" : "div", // Only use form on step 2
        onSubmit: activeStep === 1 ? handleFormSubmit : undefined,
        sx: {
          borderRadius: 0.5,
          position: isMobile ? "static" : "fixed",
          transform: isMobile ? "none" : "translateY(0)",
          width: isMobile ? "auto" : "1024px",
          height: isMobile ? "auto" : "720px",
          maxWidth: isMobile ? "calc(100vw - 16px)" : "1024px",
          maxHeight: isMobile ? "calc(100vh - 32px)" : "673px",
          minWidth: isMobile ? "auto" : "600px",
          margin: isMobile ? "16px 8px" : "auto",
          [theme.breakpoints.between("md", "lg")]: {
            width: "90vw",
            maxWidth: "900px",
            height: "auto",
            maxHeight: "80vh",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          background: "#FFF",
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
            onClick={handleClose}
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
        <Box sx={{ mb: 3 }}>
          <StyledStepper
            steps={steps}
            activeStep={activeStep}
            onStepClick={handleStepClick}
          />
        </Box>

        {activeStep === 0 ? (
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
              <EmailInputContent />
              <ProcessingStatus />
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1 }}>
            <LicenseContentOnly />
            <ProcessingStatus />
          </Box>
        )}
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
        <Box sx={{ position: "relative" }}>
          <StepperButton
            title={getButtonTitle()}
            onClick={handleButtonClick}
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
      </DialogActions>
    </Dialog>
  );
};

export default DownloadDialog;
