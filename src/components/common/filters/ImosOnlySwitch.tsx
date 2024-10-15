import { Grid, Switch, SwitchProps, Tooltip } from "@mui/material";
import React, { FC, useCallback } from "react";
import imos_logo from "@/assets/logos/imos-logo-transparent.png";
import { ParameterState } from "../store/componentParamReducer";
import { padding } from "../../../styles/constants.js";

interface imosOnlySwitchProps {
  filter: ParameterState;
  setFilter: React.Dispatch<React.SetStateAction<ParameterState>>;
}

const ImosOnlySwitch: FC<imosOnlySwitchProps> = ({ filter, setFilter }) => {
  const { isImosOnlyDataset } = filter;

  const onImosOnlySwitch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const p: SwitchProps = event.target as SwitchProps;
      setFilter((prevFilter) => ({
        ...prevFilter,
        isImosOnlyDataset: p.checked,
      }));
    },
    [setFilter]
  );

  return (
    <Grid
      container
      sx={{
        paddingTop: padding["large"],
        paddingBottom: padding["small"],
        paddingX: padding["small"],
        height: "100%",
      }}
    >
      <Tooltip title="Search for IMOS data only" placement="top">
        <Grid item xs={12}>
          <img
            src={imos_logo}
            alt="imos_logo"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </Grid>
      </Tooltip>

      <Grid
        item
        xs={12}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Switch
          checked={isImosOnlyDataset ?? false}
          onClick={onImosOnlySwitch}
        />
      </Grid>
    </Grid>
  );
};

export default ImosOnlySwitch;
