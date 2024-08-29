import { FC, useCallback, useEffect, useState } from "react";
import { Grid, SxProps, Theme } from "@mui/material";
import { StyledToggleButton } from "../buttons/StyledToggleButton";
import { StyledToggleButtonGroup } from "../buttons/StyledToggleButtonGroup";
import { ParameterState } from "../store/componentParamReducer";
import { DatasetFrequency } from "../store/searchReducer";

interface DataDeliveryModeFilterProps {
  filter: ParameterState;
  setFilter: React.Dispatch<React.SetStateAction<ParameterState>>;
  sx?: SxProps<Theme>;
}

const DELIVERY_MODES = new Map<string, DatasetFrequency>([
  ["Real-time", DatasetFrequency.REALTIME],
  ["Delayed", DatasetFrequency.DELAYED],
  ["Other", DatasetFrequency.OTHER],
]);

const findDeliveryModesLabel = (
  mode: DatasetFrequency | undefined
): string | undefined => {
  if (mode) {
    for (const [key, val] of DELIVERY_MODES) {
      if (val === mode) {
        return key;
      }
    }
  }
  return undefined;
};

const DataDeliveryModeFilter: FC<DataDeliveryModeFilterProps> = ({
  filter,
  setFilter,
  sx,
}) => {
  // TODO: implement DataDeliveryModeFilter when backend supports this query
  const [values, setValues] = useState<string | undefined>(
    findDeliveryModesLabel(filter.updateFreq)
  );

  const handleChange = useCallback(
    (_: any, newAlignment: string) => {
      // If user already selected it, click on it again should
      // unselect
      setValues((v) => (v === newAlignment ? undefined : newAlignment));

      setFilter((filter) => {
        // For exclusive toggle, it must be string
        switch (newAlignment) {
          case "Real-time":
          case "Delayed":
          case "Other":
            filter.updateFreq = DELIVERY_MODES.get(newAlignment);
            break;
          default:
            filter.updateFreq = undefined;
        }
        return { ...filter };
      });
    },
    [setFilter]
  );

  useEffect(() => {
    findDeliveryModesLabel(filter.updateFreq);
  }, [filter.updateFreq]);

  return (
    <Grid container sx={{ ...sx }}>
      <Grid item xs={12}>
        <StyledToggleButtonGroup
          value={values}
          exclusive
          onChange={handleChange}
        >
          {Array.from(DELIVERY_MODES.keys()).map((mode, index) => (
            <StyledToggleButton value={mode} key={index}>
              {mode}
            </StyledToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default DataDeliveryModeFilter;
