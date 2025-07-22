import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  FormEvent,
} from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../components/common/store/hooks";
import { DataUsageInformation } from "../components/download/DataUsageForm";
import { useDetailPageContext } from "../pages/detail-page/context/detail-page-context";
import {
  getDateConditionFrom,
  getMultiPolygonFrom,
} from "../utils/DownloadConditionUtils";
import { DatasetDownloadRequest } from "../pages/detail-page/context/DownloadDefinitions";
import { processDatasetDownload } from "../components/common/store/searchReducer";

// ================== CONSTANTS ==================
const STATUS_CODES = {
  TIMEOUT: "408",
  SERVER_ERROR: "500",
  SUCCESS: "200",
} as const;

const STATUS_MESSAGES = {
  TIMEOUT: "Request timeout! Please try again later",
  SERVER_ERROR: "Server error! Please try again later",
  SUCCESS: "Download email will be sent shortly.",
  DATASET_ERROR: "Dataset unavailable! Please try again later",
} as const;

const TIMEOUT_LIMIT = 8000;

export const useDownloadDialog = (
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void
) => {
  // ================== DEPENDENCIES & CONTEXT ==================
  const { uuid } = useParams<{ uuid: string }>();
  const dispatch = useAppDispatch();
  const { downloadConditions } = useDetailPageContext();

  // ================== STATE MANAGEMENT ==================
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dataUsage, setDataUsage] = useState<DataUsageInformation>({
    purposes: [],
    sectors: [],
    allow_contact: null,
  });
  const [emailError, setEmailError] = useState<string>("");

  // ================== VALIDATION HELPERS ==================
  const isEmailValid = useCallback((emailValue: string): boolean => {
    if (!emailValue.trim()) {
      setEmailError("Please enter your email address");
      emailInputRef.current?.focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
      emailInputRef.current?.focus();
      return false;
    }

    setEmailError("");
    return true;
  }, []);

  // ================== COMPUTED VALUES ==================
  const hasDownloadConditions = useMemo(() => {
    return downloadConditions && downloadConditions.length > 0;
  }, [downloadConditions]);

  const dateRange = useMemo(
    () => getDateConditionFrom(downloadConditions),
    [downloadConditions]
  );

  const multiPolygon = useMemo(
    () => getMultiPolygonFrom(downloadConditions),
    [downloadConditions]
  );

  // ================== INITIALIZATION & PERSISTENCE ==================
  // Initialize email input field value
  useEffect(() => {
    if (emailInputRef.current && email) {
      emailInputRef.current.value = email;
    }
  }, [email, activeStep]);

  // Load saved data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setProcessingStatus("");
      setIsSuccess(false);

      // Restore saved email
      const savedEmail = localStorage.getItem("download_dialog_email") || "";
      setEmail(savedEmail);
      if (emailInputRef.current) {
        emailInputRef.current.value = savedEmail;
      }

      // Restore saved data usage preferences
      const savedDataUsage = localStorage.getItem("download_dialog_dataUsage");
      if (savedDataUsage) {
        try {
          setDataUsage(JSON.parse(savedDataUsage));
        } catch (e) {
          setDataUsage({
            purposes: [],
            sectors: [],
            allow_contact: null,
          });
        }
      } else {
        setDataUsage({
          purposes: [],
          sectors: [],
          allow_contact: null,
        });
      }
    }
  }, [isOpen]);

  // Handle processing timeout
  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        setProcessingStatus(STATUS_CODES.TIMEOUT);
        setIsProcessing(false);
      }, TIMEOUT_LIMIT);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  // ================== DIALOG MANAGEMENT ==================
  // Close dialog and reset all state
  const handleIsClose = useCallback(() => {
    setIsSuccess(false);
    setProcessingStatus("");
    setActiveStep(0);
    setEmail("");
    setDataUsage({
      purposes: [],
      sectors: [],
      allow_contact: null,
    });
    setIsProcessing(false);
    localStorage.removeItem("download_dialog_email");
    localStorage.removeItem("download_dialog_dataUsage");
    setIsOpen(false);
  }, [setIsOpen]);

  // ================== STEP NAVIGATION ==================
  // Handle step changes with validation
  const handleStepChange = useCallback(
    (targetStep: number) => {
      const currentEmailValue = emailInputRef.current?.value?.trim() || "";

      // Validate email when moving forward from step 0
      if (activeStep === 0 && targetStep > 0) {
        if (!isEmailValid(currentEmailValue)) {
          return;
        }

        setEmail(currentEmailValue);
        localStorage.setItem("download_dialog_email", currentEmailValue);
      }

      // Save email when staying on step 0
      if (activeStep === 0 && targetStep === 0 && currentEmailValue) {
        setEmail(currentEmailValue);
        localStorage.setItem("download_dialog_email", currentEmailValue);
      }

      setActiveStep(targetStep);

      // Restore email input value when returning to step 0
      if (targetStep === 0) {
        setTimeout(() => {
          const savedEmail =
            localStorage.getItem("download_dialog_email") || email;
          if (emailInputRef.current && savedEmail) {
            emailInputRef.current.value = savedEmail;
          }
        }, 0);
      }
    },
    [activeStep, email, isEmailValid]
  );

  const handleStepClick = useCallback(
    (step: number) => {
      handleStepChange(step);
    },
    [handleStepChange]
  );

  // ================== DATA USAGE MANAGEMENT ==================
  // Handle data usage form changes with persistence
  const handleDataUsageChange = useCallback(
    (newDataUsage: DataUsageInformation) => {
      const currentEmail =
        email ||
        emailInputRef.current?.value ||
        localStorage.getItem("download_dialog_email") ||
        "";

      setDataUsage(newDataUsage);

      // Save both data usage and email to localStorage
      Promise.resolve().then(() => {
        localStorage.setItem(
          "download_dialog_dataUsage",
          JSON.stringify(newDataUsage)
        );

        if (currentEmail) {
          localStorage.setItem("download_dialog_email", currentEmail);
          if (
            emailInputRef.current &&
            emailInputRef.current.value !== currentEmail
          ) {
            emailInputRef.current.value = currentEmail;
          }
          if (email !== currentEmail) {
            setEmail(currentEmail);
          }
        }
      });
    },
    [email, setDataUsage]
  );

  // ================== DOWNLOAD REQUEST PROCESSING ==================
  // Submit download job to backend
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
          data_usage: dataUsage,
        },
        outputs: {},
        subscriber: {
          successUri: "place_holder",
          inProgressUri: "place_holder",
          failedUri: "place_holder",
        },
      };

      dispatch(processDatasetDownload(request))
        .unwrap()
        .then((response: { status: { message: string } }) => {
          if (response?.status?.message) {
            const statusCode = response.status.message;
            setProcessingStatus(statusCode);

            // Only 2xx status codes are considered successful
            if (/^2\d{2}$/.test(statusCode)) {
              setIsSuccess(true);
              // Clear saved data after successful submission
              localStorage.removeItem("download_dialog_email");
              localStorage.removeItem("download_dialog_dataUsage");
            }
          } else {
            console.log("Internal server error.");
            setProcessingStatus(STATUS_CODES.SERVER_ERROR);
          }
          setIsProcessing(false);
        })
        .catch(
          (error: { response: { status: { toString: () => string } } }) => {
            if (error?.response?.status) {
              setProcessingStatus(error.response.status.toString());
            } else {
              console.log("Internal server error.");
              setProcessingStatus(STATUS_CODES.SERVER_ERROR);
            }
            setIsProcessing(false);
          }
        );
    },
    [dateRange.end, dateRange.start, dispatch, multiPolygon, uuid, dataUsage]
  );

  // ================== FORM SUBMISSION HANDLERS ==================
  // Handle email input
  const handleClearEmail = useCallback(() => {
    setEmail("");
    setEmailError("");
    if (emailInputRef.current) {
      emailInputRef.current.value = "";
    }
    localStorage.removeItem("download_dialog_email");
  }, []);

  // Handle form submission (step 2)
  const handleFormSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      setIsProcessing(true);
      const formData = new FormData(event.currentTarget as HTMLFormElement);
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

  // Handle stepper button clicks
  const handleStepperButtonClick = useCallback(() => {
    // Step 0: Navigate to license agreement
    if (activeStep === 0) {
      handleStepChange(1);
      return;
    }

    // Step 1: Submit download request
    const emailToSubmit = emailInputRef.current?.value?.trim() || email;

    if (!isEmailValid(emailToSubmit)) {
      return;
    }

    setIsProcessing(true);
    submitJob(emailToSubmit);
  }, [activeStep, email, handleStepChange, submitJob, isEmailValid]);

  // ================== UI HELPERS ==================
  // Get processing status message for display
  const getProcessStatusText = useCallback((): string => {
    if (!processingStatus) return "";

    if (processingStatus === STATUS_CODES.TIMEOUT) {
      return STATUS_MESSAGES.TIMEOUT;
    }
    if (/^5\d{2}$/.test(processingStatus)) {
      return STATUS_MESSAGES.SERVER_ERROR;
    }
    if (/^2\d{2}$/.test(processingStatus)) {
      return STATUS_MESSAGES.SUCCESS;
    }
    if (/^4\d{2}$/.test(processingStatus)) {
      return processingStatus === "400"
        ? STATUS_MESSAGES.DATASET_ERROR
        : "Request failed! Please try again later";
    }
    return "Something went wrong";
  }, [processingStatus]);

  // Get button title based on current step
  const getStepperButtonTitle = useCallback(() => {
    if (activeStep === 0) {
      return "Next";
    } else {
      return "I understand, process download";
    }
  }, [activeStep]);

  return {
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
  };
};
