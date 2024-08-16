import { FC, useCallback, useState } from "react";
import { Grid, SxProps, Theme } from "@mui/material";
import { StyledToggleButton } from "../buttons/StyledToggleButton";
import { StyledToggleButtonGroup } from "../buttons/StyledToggleButtonGroup";
import { ParameterState } from "../store/componentParamReducer";

interface DataDeliveryModeFilterProps {
  filter: ParameterState;
  setFilter: React.Dispatch<React.SetStateAction<ParameterState>>;
  sx?: SxProps<Theme>;
}

const DELIVERY_MODES = ["Real-time", "Delayed", "One-off"];

const DataDeliveryModeFilter: FC<DataDeliveryModeFilterProps> = ({
  filter,
  setFilter,
  sx,
}) => {
  // TODO: implement DataDeliveryModeFilter when backend supports this query
  const [values, setValues] = useState<Array<string>>([]);
  const handleChange = useCallback((_: any, newAlignment: any) => {
    setValues(newAlignment);
  }, []);

  return (
    <Grid container sx={{ ...sx }}>
      <Grid item xs={12}>
        <StyledToggleButtonGroup
          value={values}
          exclusive
          onChange={handleChange}
        >
          {DELIVERY_MODES.map((mode, index) => (
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
