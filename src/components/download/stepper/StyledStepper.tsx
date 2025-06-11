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
import {
  gap,
  padding,
  fontSize,
  fontWeight,
  color,
  borderRadius,
} from "../../../styles/constants";

interface StepItem {
  number: number;
  label: string;
}

interface StyledStepperProps {
  steps: StepItem[] | string[];
  activeStep: number;
  onStepClick?: (step: number) => void;
  sx?: object;
}

const StyledStepper: FC<StyledStepperProps> = ({
  steps,
  activeStep,
  onStepClick,
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleStepClick = (index: number) => {
    if (onStepClick) {
      onStepClick(index);
    }
  };

  const normalizedSteps = steps.map((step, index) =>
    typeof step === "string" ? { number: index + 1, label: step } : step
  );

  return (
    <Stepper
      activeStep={activeStep}
      sx={{
        display: "flex",
        width: isMobile ? "auto" : "640px",
        minWidth: isMobile ? "200px" : "640px",
        maxWidth: "100%",
        height: "28.8px",
        alignItems: "center",
        gap: gap.lg,
        flexShrink: 0,
        mx: "auto",
        "& .MuiStepConnector-root": {
          top: "12px",
          left: "calc(-50% + 12px)",
          right: "calc(50% + 12px)",
          zIndex: 0,
        },
        "& .MuiStepConnector-line": {
          flex: "1 0 0",
        },
        "& .MuiStepConnector-active .MuiStepConnector-line": {
          borderColor: color.brightBlue.dark,
        },
        "& .MuiStepConnector-completed .MuiStepConnector-line": {
          borderColor: color.brightBlue.dark,
        },
        ...sx,
      }}
    >
      {normalizedSteps.map((step, index) => {
        const isActive = activeStep === index;
        const isCompleted = activeStep > index;

        return (
          <Step key={step.label} sx={{ position: "relative" }}>
            <StepLabel
              onClick={() => handleStepClick(index)}
              sx={{
                cursor: onStepClick ? "pointer" : "default",
                flexDirection: "row",
                alignItems: "center",
                "& .MuiStepLabel-labelContainer": {
                  width: "auto",
                  ml: 1,
                },
                "& .MuiStepLabel-iconContainer": {
                  pr: 0,
                  zIndex: 1,
                },
              }}
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: "28.8px",
                    height: "28.8px",
                    flexShrink: 0,
                    borderRadius: borderRadius.circle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      isCompleted || isActive
                        ? color.brightBlue.dark
                        : color.gray.extraLight,
                    color: "white",
                    fontSize: fontSize.label,
                    fontWeight: fontWeight.bold,
                    cursor: onStepClick ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: onStepClick
                        ? isCompleted || isActive
                          ? color.brightBlue.dark
                          : color.gray.light
                        : isCompleted || isActive
                          ? color.brightBlue.dark
                          : color.gray.extraLight,
                    },
                  }}
                >
                  {isCompleted ? (
                    <CheckIcon
                      sx={{ fontSize: fontSize.info, color: "white" }}
                    />
                  ) : (
                    step.number
                  )}
                </Box>
              )}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(0, 0, 0, 0.87)",
                  fontFeatureSettings: "'liga' off, 'clig' off",
                  fontFamily: "Roboto",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "157%",
                  letterSpacing: "0.12px",
                  cursor: onStepClick ? "pointer" : "default",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: isMobile && !isActive ? "none" : "block",
                }}
              >
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default StyledStepper;
