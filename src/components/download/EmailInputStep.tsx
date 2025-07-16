import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DataUsageForm, { DataUsageInformation } from "./DataUsageForm";
import { fontColor } from "../../styles/constants";
import rc8Theme from "../../styles/themeRC8";
import { InformationIcon } from "../../assets/icons/download/information";
import { ClearIcon } from "@mui/x-date-pickers/icons";

interface EmailInputStepProps {
  isMobile: boolean;
  emailInputRef: React.RefObject<HTMLInputElement>;
  emailError?: string;
  email: string;
  dataUsage: DataUsageInformation;
  onDataUsageChange: (newDataUsage: DataUsageInformation) => void;
  onClearEmail: () => void;
}

const EmailInputStep: React.FC<EmailInputStepProps> = ({
  isMobile,
  emailInputRef,
  emailError,
  email,
  dataUsage,
  onDataUsageChange,
  onClearEmail,
}) => {
  return (
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
        variant={emailError ? "outlined" : "standard"}
        inputRef={emailInputRef}
        error={!!emailError}
        InputProps={{
          endAdornment: emailError ? (
            <InputAdornment position="end" sx={{ m: 1 }}>
              <InformationIcon
                color={rc8Theme.palette.error.main}
                height={30}
                width={30}
              />
            </InputAdornment>
          ) : email ? (
            <InputAdornment position="end" sx={{ m: 1 }}>
              <IconButton
                onClick={onClearEmail}
                size="small"
                sx={{ padding: "4px" }}
              >
                <ClearIcon sx={{ fontSize: "18px", color: "#666" }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
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

      {emailError && (
        <Typography
          variant="body1Medium"
          sx={{
            color: rc8Theme.palette.error.main,
          }}
        >
          {emailError}
        </Typography>
      )}

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
        setDataUsage={onDataUsageChange}
      />
    </Box>
  );
};

export default EmailInputStep;
