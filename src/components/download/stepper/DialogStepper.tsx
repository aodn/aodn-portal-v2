import { FC } from "react";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import rc8Theme from "../../../styles/themeRC8";

interface StepItem {
  number: number;
  label: string;
}

interface DialogStepperProps {
  steps: StepItem[] | string[];
  activeStep: number;
  onStepClick?: (step: number) => void;
  sx?: object;
  testId?: string;
}

const DialogStepper: FC<DialogStepperProps> = ({
  steps,
  activeStep,
  onStepClick,
  sx = {},
  testId = "dialog-stepper",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleStepClick = (index: number) => {
    if (onStepClick) {
      onStepClick(index);
    }
  };

  // Convert string steps to objects with number and label
  const normalizedSteps = steps.map((step, index) =>
    typeof step === "string" ? { number: index + 1, label: step } : step
  );

  // Check if step is active or completed
  const getStepStatus = (index: number) => {
    const isActive = activeStep === index;
    const isCompleted = activeStep > index;
    return { isActive, isCompleted };
  };

  // Get background color for step icon
  const getIconBackgroundColor = (isActive: boolean, isCompleted: boolean) => {
    if (isCompleted || isActive) {
      return rc8Theme.palette.primary1;
    }
    return rc8Theme.palette.grey300;
  };

  // Get hover background color for step icon
  const getIconHoverBackgroundColor = (
    isActive: boolean,
    isCompleted: boolean
  ) => {
    if (!onStepClick) {
      return isCompleted || isActive
        ? rc8Theme.palette.primary1
        : rc8Theme.palette.grey100;
    }

    return isCompleted || isActive
      ? rc8Theme.palette.secondary1
      : rc8Theme.palette.grey300;
  };

  // Render the circular step icon with number or check mark
  const renderStepIcon = (step: StepItem, index: number) => {
    const { isActive, isCompleted } = getStepStatus(index);

    return (
      <Box
        sx={{
          typography: "title1Medium",
          fontWeight: 500,
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: getIconBackgroundColor(isActive, isCompleted),
          color: isActive ? "white" : rc8Theme.palette.text2,
          cursor: onStepClick ? "pointer" : "default",
          "&:hover": {
            backgroundColor: getIconHoverBackgroundColor(isActive, isCompleted),
          },
        }}
      >
        {isCompleted ? (
          <CheckIcon sx={{ fontSize: 14, color: "white" }} />
        ) : (
          step.number
        )}
      </Box>
    );
  };

  // Render step label text (hidden on mobile unless active)
  const renderStepLabel = (step: StepItem, index: number) => {
    const { isActive } = getStepStatus(index);
    const shouldShowLabel = !isMobile || isActive;

    if (!shouldShowLabel) {
      return null;
    }

    return <Typography variant="heading4">{step.label}</Typography>;
  };

  return (
    <Stepper
      activeStep={activeStep}
      data-testid={testId}
      sx={{
        width: isMobile ? "auto" : "640px",
        minWidth: isMobile ? "200px" : "640px",
        height: "28px",
        gap: "4px",
        mx: "auto",
        ...sx,
      }}
    >
      {normalizedSteps.map((step, index) => (
        <Step key={step.label} sx={{ position: "relative" }}>
          <StepLabel
            onClick={() => handleStepClick(index)}
            StepIconComponent={() => renderStepIcon(step, index)}
          >
            {renderStepLabel(step, index)}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default DialogStepper;
