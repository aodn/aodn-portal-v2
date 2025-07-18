import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DataUsageForm, { DataUsageInformation } from "./DataUsageForm";
import rc8Theme from "../../styles/themeRC8";
import { InformationIcon } from "../../assets/icons/download/information";
import { ClearIcon } from "../../assets/icons/download/clear";

interface EmailInputStepProps {
  isMobile: boolean;
  emailInputRef: React.RefObject<HTMLInputElement>;
  email: string;
  emailError?: string;
  dataUsage: DataUsageInformation;
  onDataUsageChange: (dataUsage: DataUsageInformation) => void;
  onClearEmail: () => void;
  setEmailError: (error: string) => void;
}

const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const textFieldStyles = {
  container: { my: "8px" },
  inputRoot: {
    height: "42px",
    backgroundColor: rc8Theme.palette.primary5,
    opacity: 0.7,
    borderRadius: "4px",
    "&:before, &:hover:not(.Mui-disabled):before, &:after": {
      borderBottom: `1px solid ${rc8Theme.palette.grey700}`,
    },
  },
  input: {
    height: "42px",
    pl: "20px",
    mb: "8px",
    boxSizing: "border-box",
  },
};

const adornmentStyles = {
  wrapper: { m: 1, mb: "16px" },
  clearButton: {
    padding: "4px",
    backgroundColor: rc8Theme.palette.primary5,
  },
};

const EmailInputStep: React.FC<EmailInputStepProps> = ({
  isMobile,
  emailInputRef,
  email,
  emailError,
  dataUsage,
  onDataUsageChange,
  onClearEmail,
  setEmailError,
}) => {
  const getCurrentInputValue = () => {
    return emailInputRef.current?.value || "";
  };

  const emailHasValue =
    getCurrentInputValue().trim().length > 0 || email.trim().length > 0;
  const emailHasError = !!emailError;
  const shouldShowClearButton = emailHasValue && !emailHasError;

  const updateEmailValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (emailHasError && newValue.trim()) {
      const isValidEmailFormat = EMAIL_VALIDATION_REGEX.test(newValue.trim());
      if (isValidEmailFormat) {
        setEmailError("");
      }
    }
  };

  const handleClearEmail = () => {
    if (emailInputRef.current) {
      emailInputRef.current.value = "";
    }
    onClearEmail();
  };

  const createErrorAdornment = () => (
    <InputAdornment position="end" sx={adornmentStyles.wrapper}>
      <InformationIcon
        color={rc8Theme.palette.error.main}
        height={30}
        width={30}
      />
    </InputAdornment>
  );

  const createClearAdornment = () => (
    <InputAdornment position="end" sx={adornmentStyles.wrapper}>
      <IconButton
        onClick={handleClearEmail}
        size="small"
        sx={adornmentStyles.clearButton}
        aria-label="Clear email address"
      >
        <ClearIcon />
      </IconButton>
    </InputAdornment>
  );

  const getInputEndAdornment = () => {
    if (emailHasError) return createErrorAdornment();
    if (shouldShowClearButton) return createClearAdornment();
    return undefined;
  };

  const EmailTextField = () => (
    <TextField
      required
      id="email"
      name="email"
      label="Email Address"
      placeholder="example@email.com"
      type="email"
      fullWidth
      variant={emailHasError ? "outlined" : "standard"}
      inputRef={emailInputRef}
      error={emailHasError}
      onChange={updateEmailValue}
      defaultValue={email}
      InputProps={{
        endAdornment: getInputEndAdornment(),
      }}
      sx={{
        ...textFieldStyles.container,
        "& .MuiInputBase-root": textFieldStyles.inputRoot,
        "& .MuiInputBase-root.MuiInput-root .MuiInputBase-input": {
          ...textFieldStyles.input,
          ...rc8Theme.typography.title2Regular,
        },
      }}
    />
  );

  const ErrorMessage = () => {
    if (!emailHasError) return null;

    return (
      <Typography
        variant="body1Medium"
        sx={{
          color: rc8Theme.palette.error.main,
          pl: "20px",
        }}
      >
        {emailError}
      </Typography>
    );
  };

  const DownloadInstructions = () => (
    <Box sx={{ ml: "20px", my: "8px" }}>
      <Typography variant="body2Regular">
        Processing dataset download may take some time. It is varied by the size
        of the dataset, the selected conditions, and the server load (may take
        several seconds to several hours or even more). Please provide your
        email address to receive the download link and necessary information.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ pl: isMobile ? 1 : 2 }}>
      <Typography variant="title1Medium">Email Address</Typography>

      <EmailTextField />
      <ErrorMessage />
      <DownloadInstructions />

      <DataUsageForm
        isMobile={isMobile}
        dataUsage={dataUsage}
        setDataUsage={onDataUsageChange}
      />
    </Box>
  );
};

export default EmailInputStep;
