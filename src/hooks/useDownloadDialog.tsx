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
  getFormatFrom,
  getKeyFrom,
  getMultiPolygonFrom,
} from "../utils/DownloadConditionUtils";
import {
  DatasetDownloadRequest,
  DownloadConditionType,
} from "../pages/detail-page/context/DownloadDefinitions";
import { processDatasetDownload } from "../components/common/store/searchReducer";
import { trackCustomEvent } from "../analytics/customEventTracker";
import { AnalyticsEvent } from "../analytics/analyticsEvents";
import { calculateBboxes } from "../analytics/downloadCODataEvent";

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

  // ================== COMPUTED VALUES ==================
  const {
    hasDownloadConditions,
    subsettingSelectionCount,
    dateRange,
    multiPolygon,
    format,
    keys,
  } = useMemo(() => {
    const hasDownloadConditions =
      downloadConditions && downloadConditions.length > 0;
    const subsettingSelectionCount =
      downloadConditions?.filter(
        (condition) => condition.type !== DownloadConditionType.FORMAT
      ).length || 0;
    const dateRange = getDateConditionFrom(downloadConditions);
    const multiPolygon = getMultiPolygonFrom(downloadConditions);
    const format = getFormatFrom(downloadConditions);
    const keys = getKeyFrom(downloadConditions);

    return {
      hasDownloadConditions,
      subsettingSelectionCount,
      dateRange,
      multiPolygon,
      format,
      keys,
    };
  }, [downloadConditions]);

  // ================== REFS FOR STABLE CALLBACKS ==================
  const emailInputRef = useRef<HTMLInputElement>(null);
  const latestValuesRef = useRef({
    dataUsage,
    dateRange,
    format,
    multiPolygon,
    keys,
    subsettingSelectionCount,
  });

  // ================== VALIDATION HELPERS ==================
  const isEmailValid = useCallback((emailValue: string): boolean => {
    if (!emailValue.trim()) {
      setEmailError("Please enter your email address.");
      emailInputRef.current?.focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address.");
      emailInputRef.current?.focus();
      return false;
    }

    setEmailError("");
    return true;
  }, []);

  // ================== INITIALIZATION - Only when dialog opens ==================
  useEffect(() => {
    if (!isOpen) return;

    // Reset all state when dialog opens
    setActiveStep(0);
    setProcessingStatus("");
    setIsSuccess(false);
    setIsProcessing(false);

    // Load saved data from localStorage
    try {
      const savedEmail = localStorage.getItem("download_dialog_email") || "";
      const savedDataUsageString = localStorage.getItem(
        "download_dialog_dataUsage"
      );

      setEmail(savedEmail);

      if (savedDataUsageString) {
        try {
          const savedDataUsage = JSON.parse(savedDataUsageString);
          setDataUsage(savedDataUsage);
        } catch {
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
    } catch (error) {
      console.warn("Error loading saved data:", error);
    }
  }, [isOpen]); // Only depend on isOpen

  // ================== SYNC LATEST VALUES ==================
  useEffect(() => {
    // Sync email input
    if (emailInputRef.current && email) {
      emailInputRef.current.value = email;
    }

    // Sync ref values
    latestValuesRef.current = {
      dataUsage,
      dateRange,
      format,
      multiPolygon,
      keys,
      subsettingSelectionCount,
    };
  }, [
    email,
    activeStep,
    dataUsage,
    dateRange,
    format,
    multiPolygon,
    keys,
    subsettingSelectionCount,
  ]);
  // ================== PROCESSING TIMEOUT ==================
  useEffect(() => {
    if (!isProcessing) return;

    const timer = setTimeout(() => {
      setProcessingStatus(STATUS_CODES.TIMEOUT);
      setIsProcessing(false);
    }, TIMEOUT_LIMIT);

    return () => clearTimeout(timer);
  }, [isProcessing]);

  // ================== DIALOG MANAGEMENT ==================
  const handleIsClose = useCallback(() => {
    setIsSuccess(false);
    setProcessingStatus("");
    setActiveStep(0);
    setEmail("");
    setEmailError("");
    setDataUsage({
      purposes: [],
      sectors: [],
      allow_contact: null,
    });
    setIsProcessing(false);

    // Clear localStorage
    try {
      // localStorage.removeItem("download_dialog_email");
      // localStorage.removeItem("download_dialog_dataUsage");
    } catch (error) {
      console.warn("Error clearing localStorage:", error);
    }

    setIsOpen(false);
  }, [setIsOpen]);

  // ================== STEP NAVIGATION ==================
  const handleStepChange = useCallback(
    (targetStep: number) => {
      const currentEmailValue = emailInputRef.current?.value?.trim() || "";

      // Validate email when moving forward from step 0
      if (activeStep === 0 && targetStep > 0) {
        if (!isEmailValid(currentEmailValue)) {
          return;
        }
        setEmail(currentEmailValue);
        // Save to localStorage
        try {
          localStorage.setItem("download_dialog_email", currentEmailValue);
        } catch (error) {
          console.warn("Error saving email:", error);
        }
      }

      // Save email when staying on step 0
      if (activeStep === 0 && targetStep === 0 && currentEmailValue) {
        setEmail(currentEmailValue);
        try {
          localStorage.setItem("download_dialog_email", currentEmailValue);
        } catch (error) {
          console.warn("Error saving email:", error);
        }
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
  const handleDataUsageChange = useCallback(
    (newDataUsage: DataUsageInformation) => {
      const currentEmail = email || emailInputRef.current?.value || "";

      setDataUsage(newDataUsage);

      // Save to localStorage immediately
      try {
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
      } catch (error) {
        console.warn("Error saving data usage:", error);
      }
    },
    [email]
  );

  // ================== DOWNLOAD REQUEST PROCESSING ==================
  const submitJob = useCallback(
    (emailToSubmit: string) => {
      if (!uuid) {
        setIsProcessing(false);
        return;
      }

      const normalizedEmail = emailToSubmit.toLowerCase();

      // Get latest values from ref
      const { dataUsage, dateRange, format, multiPolygon, keys } =
        latestValuesRef.current;

      const request: DatasetDownloadRequest = {
        inputs: {
          uuid: uuid,
          keys: keys,
          recipient: normalizedEmail,
          start_date: dateRange.start,
          end_date: dateRange.end,
          multi_polygon: multiPolygon,
          format: format,
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
              try {
                // localStorage.removeItem("download_dialog_email");
                // localStorage.removeItem("download_dialog_dataUsage");
              } catch (error) {
                console.warn("Error clearing saved data:", error);
              }
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
    [uuid, dispatch]
  );

  // ================== FORM SUBMISSION HANDLERS ==================
  const handleClearEmail = useCallback(() => {
    setEmail("");
    setEmailError("");
    if (emailInputRef.current) {
      emailInputRef.current.value = "";
    }
    try {
      localStorage.removeItem("download_dialog_email");
    } catch (error) {
      console.warn("Error clearing email:", error);
    }
  }, []);

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

    // Get latest values from ref
    const {
      dataUsage,
      dateRange,
      format,
      multiPolygon,
      subsettingSelectionCount,
    } = latestValuesRef.current;

    // Track download event with obfuscated email (. becomes *, @ becomes #)
    const bboxes = calculateBboxes(multiPolygon);

    trackCustomEvent(AnalyticsEvent.DOWNLOAD_CO_DATA, {
      dataset_uuid: uuid,
      email: emailToSubmit.replace(/\./g, "*").replace("@", "#"),
      purposes: dataUsage.purposes,
      sectors: dataUsage.sectors,
      allow_contact: dataUsage.allow_contact,
      start_date: dateRange.start,
      end_date: dateRange.end,
      format: format,
      ...(subsettingSelectionCount > 0 &&
        Object.keys(bboxes).length > 0 &&
        bboxes),
      ...(subsettingSelectionCount > 0 && {
        spatial_extent_count: multiPolygon?.coordinates?.length || 0,
      }),
      subsetting_count: subsettingSelectionCount,
    });

    setIsProcessing(true);
    submitJob(emailToSubmit);
  }, [activeStep, email, handleStepChange, submitJob, isEmailValid, uuid]);

  // ================== UI HELPERS ==================
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
  };
};
