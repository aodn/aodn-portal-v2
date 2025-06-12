import React, { useCallback } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from "@mui/material";
import { fontColor } from "../../styles/constants";

const FORM_CONFIG = {
  title: "Data Usage Information (optional)",

  purpose: {
    title: "a. For what purpose do you intend to use the data?",
    options: [
      "Education",
      "Scientific research",
      "Industry operations",
      "Recreational",
    ],
  },

  sector: {
    title: "b. If not recreational - what sector do you work for?",
    options: ["Academic", "Industry", "Government", "Other"],
  },

  contact: {
    title:
      "c. Do you consent to being contacted by IMOS to further understand your data needs and the use of our products and services?",
    options: ["Yes", "No"],
  },
};

export interface DataUsageInformation {
  purposes: string[];
  sectors: string[];
  allow_contact: boolean | null;
}

interface DataUsageFormProps {
  isMobile: boolean;
  dataUsage: DataUsageInformation;
  setDataUsage: (usage: DataUsageInformation) => void;
}

const DataUsageForm: React.FC<DataUsageFormProps> = ({
  isMobile,
  dataUsage,
  setDataUsage,
}) => {
  const handlePurposeChange = useCallback(
    (purpose: string, checked: boolean) => {
      (
        setDataUsage as React.Dispatch<
          React.SetStateAction<DataUsageInformation>
        >
      )((prev) => ({
        ...prev,
        purposes: checked
          ? [...prev.purposes, purpose]
          : prev.purposes.filter((p) => p !== purpose),
      }));
    },
    [setDataUsage]
  );

  const handleSectorChange = useCallback(
    (sector: string, checked: boolean) => {
      (
        setDataUsage as React.Dispatch<
          React.SetStateAction<DataUsageInformation>
        >
      )((prev) => ({
        ...prev,
        sectors: checked
          ? [...prev.sectors, sector]
          : prev.sectors.filter((s) => s !== sector),
      }));
    },
    [setDataUsage]
  );

  const handleContactChange = useCallback(
    (value: boolean) => {
      (
        setDataUsage as React.Dispatch<
          React.SetStateAction<DataUsageInformation>
        >
      )((prev) => ({
        ...prev,
        allow_contact: prev.allow_contact === value ? null : value,
      }));
    },
    [setDataUsage]
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, mt: 6 }}>
        {FORM_CONFIG.title}
      </Typography>

      <FormControl component="fieldset" sx={{ ml: 2, mb: 2, width: "100%" }}>
        <FormLabel
          component="legend"
          sx={{
            fontSize: "0.875rem",
            color: fontColor.gray.dark,
            mb: 1,
            fontWeight: 500,
          }}
        >
          {FORM_CONFIG.purpose.title}
        </FormLabel>
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: isMobile ? "nowrap" : "wrap",
            gap: 1,
            alignItems: "flex-start",
          }}
        >
          {FORM_CONFIG.purpose.options.map((purpose) => (
            <FormControlLabel
              key={purpose}
              control={
                <Checkbox
                  size="small"
                  checked={dataUsage.purposes.includes(purpose)}
                  onChange={(e) =>
                    handlePurposeChange(purpose, e.target.checked)
                  }
                  sx={{
                    padding: "4px 8px",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: isMobile ? "0.875rem" : "0.9rem",
                    lineHeight: 1.4,
                    color: fontColor.gray.dark,
                    padding: 0,
                  }}
                >
                  {purpose}
                </Typography>
              }
              sx={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                width: isMobile ? "100%" : "auto",
                minWidth: isMobile ? "auto" : "fit-content",
                "& .MuiFormControlLabel-label": {
                  paddingLeft: "8px",
                  flex: isMobile ? 1 : "none",
                },
              }}
            />
          ))}
        </FormGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ ml: 2, mb: 2, width: "100%" }}>
        <FormLabel
          component="legend"
          sx={{
            fontSize: "0.875rem",
            color: fontColor.gray.dark,
            mb: 1,
            fontWeight: 500,
          }}
        >
          {FORM_CONFIG.sector.title}
        </FormLabel>
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: isMobile ? "nowrap" : "wrap",
            gap: 1,
            alignItems: "flex-start",
          }}
        >
          {FORM_CONFIG.sector.options.map((sector) => (
            <FormControlLabel
              key={sector}
              control={
                <Checkbox
                  size="small"
                  checked={dataUsage.sectors.includes(sector)}
                  onChange={(e) => handleSectorChange(sector, e.target.checked)}
                  sx={{
                    padding: "4px 8px",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: isMobile ? "0.875rem" : "0.9rem",
                    lineHeight: 1.4,
                    color: fontColor.gray.dark,
                    padding: 0,
                  }}
                >
                  {sector}
                </Typography>
              }
              sx={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                width: isMobile ? "100%" : "auto",
                minWidth: isMobile ? "auto" : "fit-content",
                "& .MuiFormControlLabel-label": {
                  paddingLeft: "8px",
                  flex: isMobile ? 1 : "none",
                },
              }}
            />
          ))}
        </FormGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ ml: 2, width: "100%" }}>
        <FormLabel
          component="legend"
          sx={{
            fontSize: "0.875rem",
            color: fontColor.gray.dark,
            mb: 1,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {FORM_CONFIG.contact.title}
        </FormLabel>
        <FormGroup>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 1 : 2,
              alignItems: "flex-start",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={dataUsage.allow_contact === true}
                  onChange={() => handleContactChange(true)}
                  sx={{
                    padding: "4px 8px",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: isMobile ? "0.875rem" : "0.9rem",
                    lineHeight: 1.4,
                    color: fontColor.gray.dark,
                    padding: 0,
                  }}
                >
                  {FORM_CONFIG.contact.options[0]}
                </Typography>
              }
              sx={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                width: isMobile ? "100%" : "auto",
                "& .MuiFormControlLabel-label": {
                  paddingLeft: "8px",
                  flex: isMobile ? 1 : "none",
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={dataUsage.allow_contact === false}
                  onChange={() => handleContactChange(false)}
                  sx={{
                    padding: "4px 8px",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: isMobile ? "0.875rem" : "0.9rem",
                    lineHeight: 1.4,
                    color: fontColor.gray.dark,
                    padding: 0,
                  }}
                >
                  {FORM_CONFIG.contact.options[1]}
                </Typography>
              }
              sx={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                width: isMobile ? "100%" : "auto",
                "& .MuiFormControlLabel-label": {
                  paddingLeft: "8px",
                  flex: isMobile ? 1 : "none",
                },
              }}
            />
          </Box>
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default DataUsageForm;
