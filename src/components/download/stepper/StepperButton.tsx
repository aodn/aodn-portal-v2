import { Button, CircularProgress } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import rc8Theme from "../../../styles/themeRC8";
import { SuccessIcon } from "../../../assets/icons/download/success";
import { CancelIcon } from "../../../assets/icons/download/cancel";

type ButtonStatus = "default" | "loading" | "completed" | "error";

interface StepperButtonProps {
  id?: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  status?: ButtonStatus;
  statusText?: string;
}

// Base button styles shared across all states
const COMMON_BUTTON_STYLES = {
  ...rc8Theme.typography.title1Medium,
  color: rc8Theme.palette.text1,
  height: "40px",
  gap: "10px",
  px: "46px",
  mx: "10px",
  borderRadius: "4px",
  // Prevent text wrapping
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  // Ensure button grows to accommodate content
  minWidth: "fit-content",
} as const;

const StepperButton = ({
  id,
  title,
  onClick,
  disabled = false,
  status = "default",
  statusText,
}: StepperButtonProps) => {
  const createStatusIcons = () => ({
    loadingSpinner: () => (
      <CircularProgress size={20} sx={{ color: rc8Theme.palette.secondary1 }} />
    ),

    successCheckmark: () => <SuccessIcon />,

    errorCross: () => <CancelIcon color={rc8Theme.palette.error.main} />,

    nextArrow: (shouldBeDisabled: boolean) => (
      <DoubleArrowIcon
        sx={{
          color: shouldBeDisabled
            ? rc8Theme.palette.grey500
            : rc8Theme.palette.secondary1,
          width: "23px",
          height: "23px",
        }}
      />
    ),
  });

  const createDefaultStateStyles = () => {
    const isCurrentlyDisabled = disabled;

    return {
      color: rc8Theme.palette.text1,
      border: isCurrentlyDisabled
        ? `1px solid ${rc8Theme.palette.grey500}`
        : `1px solid ${rc8Theme.palette.secondary1}`,
      "&:hover": {
        border: isCurrentlyDisabled
          ? `1px solid ${rc8Theme.palette.grey500}`
          : `2px solid ${rc8Theme.palette.secondary1}`,
      },
      "&:disabled": {
        border: `1px solid ${rc8Theme.palette.grey500}`,
        color: rc8Theme.palette.text1,
      },
    };
  };

  const createNonDefaultStateStyles = () => ({
    color: rc8Theme.palette.text1,
    border: `1px solid ${rc8Theme.palette.grey500}`,
    "&:hover": {
      border: `1px solid ${rc8Theme.palette.grey500}`,
    },
    "&:disabled": {
      border: `1px solid ${rc8Theme.palette.grey500}`,
      color: rc8Theme.palette.text1,
    },
  });

  // Maps each status to its complete UI configuration
  const STATUS_TO_UI_CONFIG = {
    loading: {
      startIcon: createStatusIcons().loadingSpinner(),
      endIcon: null,
      styles: createNonDefaultStateStyles(),
      shouldDisableButton: true,
    },

    completed: {
      startIcon: createStatusIcons().successCheckmark(),
      endIcon: null,
      styles: createNonDefaultStateStyles(),
      shouldDisableButton: true,
    },

    error: {
      startIcon: createStatusIcons().errorCross(),
      endIcon: null,
      styles: createNonDefaultStateStyles(),
      shouldDisableButton: false,
    },

    default: {
      startIcon: null,
      endIcon: createStatusIcons().nextArrow(disabled),
      styles: createDefaultStateStyles(),
      shouldDisableButton: disabled,
    },
  } as const;

  const { startIcon, endIcon, styles, shouldDisableButton } =
    STATUS_TO_UI_CONFIG[status];

  const displayText = statusText || title;

  return (
    <Button
      id={id}
      data-testid={id}
      disabled={shouldDisableButton}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        ...COMMON_BUTTON_STYLES,
        ...styles,
      }}
      onClick={onClick}
    >
      {displayText}
    </Button>
  );
};

export default StepperButton;
