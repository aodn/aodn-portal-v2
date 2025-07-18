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
import rc8Theme from "../../styles/themeRC8";

interface FormFieldConfig {
  key: string;
  title: string;
  type: "multi-select" | "yes-no" | "single-select";
  options: string[];
  required?: boolean;
}

// Configuration - modify this to change the entire form
const FORM_CONFIG = {
  title: "Data Usage Information (optional)",
  fields: [
    {
      key: "purposes",
      title: "a. For what purpose do you intend to use the data?",
      type: "multi-select",
      options: [
        "Education",
        "Scientific research",
        "Industry operations",
        "Recreational",
      ],
      required: false,
    },
    {
      key: "sectors",
      title: "b. If not recreational - what sector do you work for?",
      type: "multi-select",
      options: ["Academic", "Industry", "Government", "Other"],
      required: false,
    },
    {
      key: "allow_contact",
      title:
        "c. Do you consent to being contacted by IMOS to further understand your data needs and the use of our products and services?",
      type: "yes-no",
      options: ["Yes", "No"],
      required: false,
    },
    // Add new fields here and they'll automatically appear
    // {
    //   key: "experience_level",
    //   title: "d. What is your experience level with oceanographic data?",
    //   type: "single-select",
    //   options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    //   required: true,
    // },
  ] as FormFieldConfig[],
};

// most fields are string arrays, except yes-no which is boolean
export interface DataUsageInformation {
  purposes: string[];
  sectors: string[];
  allow_contact: boolean | null;
  // Add new fields here as needed
  // experience_level?: string[];
}

interface DataUsageFormProps {
  isMobile: boolean;
  dataUsage: DataUsageInformation;
  setDataUsage: (dataUsage: DataUsageInformation) => void;
}

const commonStyles = {
  formControl: {
    ml: 2,
    mb: "16px",
    width: "100%",
  },
  formLabel: {
    ...rc8Theme.typography.body2Regular,
    color: rc8Theme.palette.text2,
    mb: "8px",
  },
  checkbox: {
    padding: "4px 14px",
  },
  labelText: {
    ...rc8Theme.typography.body2Regular,
    color: rc8Theme.palette.text2,
    padding: 0,
  },
  formControlLabel: (isMobile: boolean) => ({
    margin: 0,
    display: "flex",
    alignItems: "center",
    width: isMobile ? "100%" : "auto",
    minWidth: isMobile ? "auto" : "fit-content",
    "& .MuiFormControlLabel-label": {
      paddingLeft: "8px",
      flex: isMobile ? 1 : "none",
    },
  }),
  formGroup: (isMobile: boolean) => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    flexWrap: isMobile ? "nowrap" : "wrap",
    gap: 1,
    alignItems: "flex-start",
  }),
};

// Type-safe field renderer function signature
type FieldRenderer = (
  field: FormFieldConfig,
  dataUsage: DataUsageInformation,
  onChange: (
    fieldKey: string,
    value: string | boolean | string[],
    isChecked?: boolean
  ) => void,
  isMobile: boolean
) => React.ReactNode[];

// Field type renderers dictionary
const fieldRenderers: Record<FormFieldConfig["type"], FieldRenderer> = {
  "multi-select": (field, dataUsage, onChange, isMobile) => {
    const multiSelectValues =
      (dataUsage[field.key as keyof DataUsageInformation] as string[]) || [];
    return field.options.map((option) => (
      <FormControlLabel
        key={option}
        control={
          <Checkbox
            size="small"
            checked={multiSelectValues.includes(option)}
            onChange={(e) => onChange(field.key, option, e.target.checked)}
            sx={commonStyles.checkbox}
          />
        }
        label={<Typography sx={commonStyles.labelText}>{option}</Typography>}
        sx={commonStyles.formControlLabel(isMobile)}
      />
    ));
  },

  "single-select": (field, dataUsage, onChange, isMobile) => {
    const singleSelectValue = dataUsage[
      field.key as keyof DataUsageInformation
    ] as string[];
    return field.options.map((option) => (
      <FormControlLabel
        key={option}
        control={
          <Checkbox
            size="small"
            checked={singleSelectValue?.includes(option) || false}
            onChange={(e) => {
              // For single select, clear others and set this one
              onChange(field.key, e.target.checked ? [option] : []);
            }}
            sx={commonStyles.checkbox}
          />
        }
        label={<Typography sx={commonStyles.labelText}>{option}</Typography>}
        sx={commonStyles.formControlLabel(isMobile)}
      />
    ));
  },

  "yes-no": (field, dataUsage, onChange, isMobile) => {
    const yesNoValue = dataUsage[field.key as keyof DataUsageInformation] as
      | boolean
      | null;
    return field.options.map((option, index) => {
      const boolValue = index === 0; // First option is true, second is false
      return (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              size="small"
              checked={yesNoValue === boolValue}
              onChange={() => onChange(field.key, boolValue)}
              sx={commonStyles.checkbox}
            />
          }
          label={<Typography sx={commonStyles.labelText}>{option}</Typography>}
          sx={commonStyles.formControlLabel(isMobile)}
        />
      );
    });
  },
};

// Generic field renderer
const FieldRenderer: React.FC<{
  field: FormFieldConfig;
  dataUsage: DataUsageInformation;
  onChange: (
    fieldKey: string,
    value: string | boolean | string[],
    isChecked?: boolean
  ) => void;
  isMobile: boolean;
}> = ({ field, dataUsage, onChange, isMobile }) => {
  const renderOptions = () => {
    const renderer = fieldRenderers[field.type];
    return renderer ? renderer(field, dataUsage, onChange, isMobile) : null;
  };

  return (
    <FormControl component="fieldset" sx={commonStyles.formControl}>
      <FormLabel component="legend" sx={commonStyles.formLabel}>
        {field.title}
        {field.required && <span style={{ color: "red" }}> *</span>}
      </FormLabel>
      <FormGroup sx={commonStyles.formGroup(isMobile)}>
        {renderOptions()}
      </FormGroup>
    </FormControl>
  );
};

// Type-safe field change handler function signature
type FieldChangeHandler = (
  prev: DataUsageInformation,
  fieldKey: string,
  value: string | boolean | string[],
  isChecked?: boolean
) => string[] | boolean | null;

// Field change handlers dictionary
const fieldChangeHandlers: Record<FormFieldConfig["type"], FieldChangeHandler> =
  {
    "multi-select": (prev, fieldKey, value, isChecked) => {
      const currentArray =
        (prev[fieldKey as keyof DataUsageInformation] as string[]) || [];
      const stringValue = value as string;
      return isChecked
        ? [...currentArray, stringValue]
        : currentArray.filter((item) => item !== stringValue);
    },

    "single-select": (prev, fieldKey, value) => {
      return value as string[];
    },

    "yes-no": (prev, fieldKey, value) => {
      const currentBoolValue = prev[fieldKey as keyof DataUsageInformation] as
        | boolean
        | null;
      const boolValue = value as boolean;
      return currentBoolValue === boolValue ? null : boolValue;
    },
  };

const DataUsageForm: React.FC<DataUsageFormProps> = ({
  isMobile,
  dataUsage,
  setDataUsage,
}) => {
  // Universal change handler that works for all field types
  const handleFieldChange = useCallback(
    (
      fieldKey: string,
      value: string | boolean | string[],
      isChecked?: boolean
    ) => {
      const updatedDataUsage = (() => {
        const field = FORM_CONFIG.fields.find((f) => f.key === fieldKey);
        if (!field) return dataUsage;

        const handler = fieldChangeHandlers[field.type];
        const newValue = handler
          ? handler(dataUsage, fieldKey, value, isChecked)
          : value;

        return {
          ...dataUsage,
          [fieldKey]: newValue,
        } as DataUsageInformation;
      })();

      setDataUsage(updatedDataUsage);
    },
    [dataUsage, setDataUsage]
  );

  return (
    <Box sx={{ mt: "24px" }}>
      <Typography variant="title1Medium">{FORM_CONFIG.title}</Typography>
      <Box sx={{ mt: "16px" }}>
        {FORM_CONFIG.fields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            dataUsage={dataUsage}
            onChange={handleFieldChange}
            isMobile={isMobile}
          />
        ))}
      </Box>
    </Box>
  );
};

export default DataUsageForm;
