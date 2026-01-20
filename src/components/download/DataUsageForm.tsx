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
import { portalTheme } from "../../styles";

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
  ] as FormFieldConfig[],
};

// most fields are string arrays, except yes-no which is boolean
export interface DataUsageInformation {
  purposes: string[];
  sectors: string[];
  allow_contact: boolean | null;
}

interface DataUsageFormProps {
  isUnderLaptop: boolean;
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
    ...portalTheme.typography.body2Regular,
    color: portalTheme.palette.text2,
    mb: "8px",
  },
  checkbox: {
    padding: "4px 10px",
  },
  labelText: {
    ...portalTheme.typography.body2Regular,
    color: portalTheme.palette.text2,
    padding: 0,
  },
  formControlLabel: (isUnderLaptop: boolean) => ({
    margin: 0,
    display: "flex",
    alignItems: "center",
    width: isUnderLaptop ? "100%" : "auto",
    minWidth: isUnderLaptop ? "auto" : "fit-content",
    "& .MuiFormControlLabel-label": {
      paddingLeft: "8px",
      flex: isUnderLaptop ? 1 : "none",
    },
  }),
  formGroup: (isUnderLaptop: boolean) => ({
    display: "flex",
    flexDirection: isUnderLaptop ? "column" : "row",
    flexWrap: isUnderLaptop ? "nowrap" : "wrap",
    gap: 1,
    alignItems: "flex-start",
  }),
};

// Field type renderers dictionary
const fieldRenderers = {
  "multi-select": (
    field: FormFieldConfig,
    dataUsage: DataUsageInformation,
    onChange: (
      fieldKey: string,
      value: string | boolean | string[],
      isChecked?: boolean
    ) => void,
    isUnderLaptop: boolean
  ) => {
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
        sx={commonStyles.formControlLabel(isUnderLaptop)}
      />
    ));
  },

  "single-select": (
    field: FormFieldConfig,
    dataUsage: DataUsageInformation,
    onChange: (
      fieldKey: string,
      value: string | boolean | string[],
      isChecked?: boolean
    ) => void,
    isUnderLaptop: boolean
  ) => {
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
        sx={commonStyles.formControlLabel(isUnderLaptop)}
      />
    ));
  },

  "yes-no": (
    field: FormFieldConfig,
    dataUsage: DataUsageInformation,
    onChange: (
      fieldKey: string,
      value: string | boolean | string[],
      isChecked?: boolean
    ) => void,
    isUnderLaptop: boolean
  ) => {
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
          sx={commonStyles.formControlLabel(isUnderLaptop)}
        />
      );
    });
  },
};

interface FieldRendererProps {
  field: FormFieldConfig;
  dataUsage: DataUsageInformation;
  onChange: (
    fieldKey: string,
    value: string | boolean | string[],
    isChecked?: boolean
  ) => void;
  isUnderLaptop: boolean;
}

// Generic field renderer component with proper typing
function FieldRendererComponent({
  field,
  dataUsage,
  onChange,
  isUnderLaptop,
}: FieldRendererProps): React.JSX.Element {
  const renderOptions = (): React.ReactNode[] => {
    const renderer = fieldRenderers[field.type];
    return renderer ? renderer(field, dataUsage, onChange, isUnderLaptop) : [];
  };

  return (
    <FormControl component="fieldset" sx={commonStyles.formControl}>
      <FormLabel component="legend" sx={commonStyles.formLabel}>
        {field.title}
        {field.required && <span style={{ color: "red" }}> *</span>}
      </FormLabel>
      <FormGroup sx={commonStyles.formGroup(isUnderLaptop)}>
        {renderOptions()}
      </FormGroup>
    </FormControl>
  );
}

// Field change handlers dictionary
const fieldChangeHandlers = {
  "multi-select": (
    prev: DataUsageInformation,
    fieldKey: string,
    value: string | boolean | string[],
    isChecked?: boolean
  ) => {
    const currentArray =
      (prev[fieldKey as keyof DataUsageInformation] as string[]) || [];
    const stringValue = value as string;
    return isChecked
      ? [...currentArray, stringValue]
      : currentArray.filter((item) => item !== stringValue);
  },

  "single-select": (
    prev: DataUsageInformation,
    fieldKey: string,
    value: string | boolean | string[]
  ) => {
    return value as string[];
  },

  "yes-no": (
    prev: DataUsageInformation,
    fieldKey: string,
    value: string | boolean | string[]
  ) => {
    const currentBoolValue = prev[fieldKey as keyof DataUsageInformation] as
      | boolean
      | null;
    const boolValue = value as boolean;
    return currentBoolValue === boolValue ? null : boolValue;
  },
};

function DataUsageForm({
  isUnderLaptop,
  dataUsage,
  setDataUsage,
}: DataUsageFormProps): React.JSX.Element {
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
          <FieldRendererComponent
            key={field.key}
            field={field}
            dataUsage={dataUsage}
            onChange={handleFieldChange}
            isUnderLaptop={isUnderLaptop}
          />
        ))}
      </Box>
    </Box>
  );
}

export default DataUsageForm;
