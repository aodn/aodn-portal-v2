import { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Box,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { borderRadius } from "../constants";
import blue from "../colors/blue";

interface DataDeliveryModeFilterProps {
  sx?: SxProps<Theme>;
}

const DataDeliveryModeFilter = (props: DataDeliveryModeFilterProps) => {
  const [values, setValues] = useState<Array<string>>([]);
  const [modes, setModes] = useState<Array<Category>>([
    "Real-time",
    "Delayed",
    "One-off",
  ]);

  const handleChange = useCallback((event, newAlignment) => {
    // TODO
  }, []);

  return (
    <Grid
      container
      sx={{
        backgroundColor: blue["bgParam"],
        border: "none",
        borderRadius: borderRadius["filter"],
        justifyContent: "center",
        ...props.sx,
      }}
    >
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" alignItems="center">
          Data Delivery Mode
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
            gridGap: "10px",
            padding: "10px",
          }}
          value={values}
          exclusive={false}
          onChange={handleChange}
        >
          {modes.map((v) => (
            <ToggleButton
              sx={{
                boxShadow: "1px 1px 10px 1px #d4d4d4",
              }}
              value={v}
              key={v}
            >
              {v}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default DataDeliveryModeFilter;
