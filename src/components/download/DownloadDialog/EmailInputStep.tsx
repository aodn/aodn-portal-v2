import React, {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useCallback,
  useState,
  useEffect,
  startTransition,
} from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DataUsageForm, { DataUsageInformation } from "./DataUsageForm";
import { portalTheme } from "../../../styles";
import { InformationIcon } from "../../../assets/icons/download/information";
import { ClearIcon } from "../../../assets/icons/download/clear";

interface EmailInputStepProps {
  isUnderLaptop: boolean;
  email: string;
  emailError?: string;
  dataUsage: DataUsageInformation;
  onDataUsageChange: (dataUsage: DataUsageInformation) => void;
  onClearEmail: () => void;
  setEmail: Dispatch<SetStateAction<string>>;
  setEmailError: Dispatch<SetStateAction<string>>;
}

const textFieldStyles = {
  container: { my: "8px" },
  inputRoot: {
    height: "42px",
    backgroundColor: portalTheme.palette.primary5,
    opacity: 0.7,
    borderRadius: "4px",
    "&:before, &:hover:not(.Mui-disabled):before, &:after": {
      borderBottom: `1px solid ${portalTheme.palette.grey700}`,
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
    backgroundColor: portalTheme.palette.primary5,
  },
};

const createErrorMessage = (
  emailHasError: boolean,
  emailError: string | undefined
) => {
  if (!emailHasError) return null;

  return (
    <Typography
      variant="body1Medium"
      sx={{
        color: portalTheme.palette.error.main,
        px: "20px",
      }}
    >
      {emailError}
    </Typography>
  );
};

const createDownloadInstructions = () => (
  <Box sx={{ mx: "20px", my: "8px" }}>
    <Typography variant="body2Regular">
      Processing dataset download may take some time. It is varied by the size
      of the dataset, the selected conditions, and the server load (may take
      several seconds to several hours or even more). Please provide your email
      address to receive the download link and necessary information.
    </Typography>
  </Box>
);

const EmailInputStep: React.FC<EmailInputStepProps> = ({
  isUnderLaptop,
  email,
  emailError,
  dataUsage,
  onDataUsageChange,
  onClearEmail,
  setEmail,
  setEmailError,
}) => {
  const [localEmail, setLocalEmail] = useState(email);

  useEffect(() => {
    startTransition(() => setLocalEmail(email));
  }, [email]);

  const emailHasValue = localEmail.trim().length > 0;
  const emailHasError = !!emailError;
  const shouldShowClearButton = emailHasValue && !emailHasError;

  const updateEmailValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalEmail(newValue);
    setEmail(newValue);
    setEmailError("");
  };

  const handleClearEmail = () => {
    setEmail("");
    onClearEmail();
  };

  const createErrorAdornment = useCallback(
    () => (
      <InputAdornment position="end" sx={adornmentStyles.wrapper}>
        <InformationIcon
          color={portalTheme.palette.error.main}
          height={30}
          width={30}
        />
      </InputAdornment>
    ),
    []
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

  const createEmailTextField = () => (
    <TextField
      required
      id="email"
      name="email"
      label="Email Address"
      placeholder="example@email.com"
      type="email"
      fullWidth
      variant={emailHasError ? "outlined" : "standard"}
      error={emailHasError}
      onChange={updateEmailValue}
      value={localEmail}
      InputProps={{
        endAdornment: getInputEndAdornment(),
      }}
      sx={{
        ...textFieldStyles.container,
        "& .MuiInputBase-root": textFieldStyles.inputRoot,
        "& .MuiInputBase-root.MuiInput-root .MuiInputBase-input": {
          ...textFieldStyles.input,
          ...portalTheme.typography.title2Regular,
        },
      }}
      data-testid="download-email-input"
    />
  );

  return (
    <Box sx={{ pl: isUnderLaptop ? 1 : 2 }}>
      <Typography variant="title1Medium">Email Address</Typography>

      {createEmailTextField()}
      {createErrorMessage(emailHasError, emailError)}
      {createDownloadInstructions()}

      <DataUsageForm
        isUnderLaptop={isUnderLaptop}
        dataUsage={dataUsage}
        setDataUsage={onDataUsageChange}
      />
    </Box>
  );
};

export default EmailInputStep;
