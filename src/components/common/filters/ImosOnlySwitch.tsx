import { Grid, Switch, SwitchProps } from "@mui/material";
import React, { useCallback } from "react";
import imos_logo from "@/assets/logos/imos-logo-transparent.png";
import { useDispatch } from "react-redux";
import store, { AppDispatch, getComponentState } from "../store/store";
import { ParameterState, updateImosOnly } from "../store/componentParamReducer";

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
    <Grid>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{
          padding: "20px 0px",
        }}
      >
        <Grid item xs={10}>
          <img
            src={imos_logo}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              //   width: "calc(100% + 40px)",
              //   height: "calc(100% + 40px)",
              //   margin: "-20px 0px 0px -20px",
            }}
          />
        </Grid>
        <Grid item>
          <Switch
            defaultChecked={componentParam.isImosOnlyDataset}
            onClick={onImosOnlySwitch}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ImosOnlySwitch;
