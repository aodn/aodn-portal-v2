import { Grid, Switch, SwitchProps } from "@mui/material";
import React, { useCallback } from "react";
import imos_logo from "@/assets/logos/imos-logo-transparent.png";
import { useDispatch } from "react-redux";
import store, { AppDispatch, getComponentState } from "../store/store.tsx";
import {
  ParameterState,
  updateImosOnly,
} from "../store/componentParamReducer.tsx";
import { padding } from "../../../styles/constants.js";

const ImosOnlySwitch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const componentParam: ParameterState = getComponentState(store.getState());

  const onImosOnlySwitch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const p: SwitchProps = event.target as SwitchProps;
      dispatch(updateImosOnly(p.checked));
    },
    [dispatch]
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
      <Grid
        item
        xs={12}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Switch
          defaultChecked={componentParam.isImosOnlyDataset}
          onClick={onImosOnlySwitch}
        />
      </Grid>
    </Grid>
  );
};

export default ImosOnlySwitch;
