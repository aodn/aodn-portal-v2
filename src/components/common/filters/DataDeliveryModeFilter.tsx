import { useCallback, useState } from "react";
import { Grid, SxProps, Theme } from "@mui/material";
import { StyledToggleButton } from "../../../styles/StyledToggleButton";
import { StyledToggleButtonGroup } from "../../../styles/StyledToggleButtonGroup";

interface DataDeliveryModeFilterProps {
  sx?: SxProps<Theme>;
}

const DataDeliveryModeFilter = (props: DataDeliveryModeFilterProps) => {
  const [values, setValues] = useState<Array<string>>([]);
  const [modes, setModes] = useState<Array<string>>([
    "Real-time",
    "Delayed",
    "One-off",
  ]);

  const handleChange = useCallback((_: any, newAlignment: any) => {
    setValues(newAlignment);
  }, []);

  return (
    <Grid container sx={{ ...props.sx }}>
      <Grid item xs={12}>
        <StyledToggleButtonGroup
          value={values}
          exclusive
          onChange={handleChange}
        >
          {modes.map((v) => (
            <StyledToggleButton value={v} key={v}>
              {v}
            </StyledToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default DataDeliveryModeFilter;
