import React from "react";
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

export interface DataUsageInformation {
  purposes: string[];
  sectors: string[];
  allowContact: boolean | null;
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
  const handlePurposeChange = (purpose: string, checked: boolean) => {
    const newPurposes = checked
      ? [...dataUsage.purposes, purpose]
      : dataUsage.purposes.filter((p) => p !== purpose);
    setDataUsage({ ...dataUsage, purposes: newPurposes });
  };

  const handleSectorChange = (sector: string, checked: boolean) => {
    const newSectors = checked
      ? [...dataUsage.sectors, sector]
      : dataUsage.sectors.filter((s) => s !== sector);
    setDataUsage({ ...dataUsage, sectors: newSectors });
  };

  const handleContactChange = (value: boolean) => {
    const newValue = dataUsage.allowContact === value ? null : value;
    setDataUsage({ ...dataUsage, allowContact: newValue });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Data Usage Information (optional)
      </Typography>

      {/* Purpose of data use */}
      <FormControl component="fieldset" sx={{ ml: 2, mb: 3, width: "100%" }}>
        <FormLabel
          component="legend"
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            color: fontColor.gray.dark,
            mb: 2,
            fontWeight: 500,
          }}
        >
          a. For what purpose do you intend to use the data?
        </FormLabel>
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: isMobile ? "nowrap" : "wrap",
            gap: isMobile ? 1 : 2,
            alignItems: "flex-start",
          }}
        >
          {[
            "Education",
            "Scientific research",
            "Industry operations",
            "Recreational",
          ].map((purpose) => (
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

      {/* Work sector */}
      <FormControl component="fieldset" sx={{ ml: 2, mb: 3, width: "100%" }}>
        <FormLabel
          component="legend"
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            color: fontColor.gray.dark,
            mb: 2,
            fontWeight: 500,
          }}
        >
          b. If not recreational - what sector do you work for?
        </FormLabel>
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: isMobile ? "nowrap" : "wrap",
            gap: isMobile ? 1 : 2,
            alignItems: "flex-start",
          }}
        >
          {["Academic", "Industry", "Government", "Other"].map((sector) => (
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

      {/* Contact consent */}
      <FormControl component="fieldset" sx={{ ml: 2, width: "100%" }}>
        <FormLabel
          component="legend"
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            color: fontColor.gray.dark,
            mb: 2,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          c. Do you consent to being contacted by IMOS to further understand
          your data needs and the use of our products and services?
        </FormLabel>
        <FormGroup>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 1 : 3,
              alignItems: "flex-start",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={dataUsage.allowContact === true}
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
                  Yes
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
                  checked={dataUsage.allowContact === false}
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
                  No
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
