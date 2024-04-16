import React, { useCallback } from "react";
import {
  Grid,
  Collapse,
  SxProps,
  Theme,
  Divider,
  Switch,
  FormControlLabel,
  Box,
  SwitchProps,
} from "@mui/material";
import RemovableDateTimeFilter from "./RemovableDateTimeFilter";
import DepthFilter from "./DepthFilter";
import DataDeliveryModeFilter from "./DataDeliveryModeFilter";
import CategoryVocabFilter from "./CategoryVocabFilter";
import { border, margin, zIndex, borderRadius } from "../constants";
import BorderButton from "../buttons/BorderButton";
import grey from "../colors/grey";
import { Tune, Layers, People, DataThresholding } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import store, { AppDispatch, getComponentState } from "../store/store";
import { ParameterState, updateImosOnly } from "../store/componentParamReducer";
import imos_logo from "@/assets/logos/imos-logo.png";

export interface NonRemovableFiltersProps {
  showFilters: boolean;
  gridColumn: number;
  sx?: SxProps<Theme>;
}

const AdvanceFilters = (props: NonRemovableFiltersProps) => {
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
    <Collapse
      orientation="vertical"
      in={props.showFilters}
      sx={{
        // Make it overlay instead of push smart card downwards
        zIndex: zIndex["FILTER_OVERLAY"],
        position: "absolute",
      }}
    >
      <Grid container justifyContent={"center"}>
        <Grid item xs={props.gridColumn}>
          <Grid
            container
            item
            xs={12}
            sx={{
              marginTop: margin["top"],
              borderRadius: borderRadius["filter"],
              backgroundColor: "white",
              ...props.sx,
            }}
          >
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  Filters
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  marginLeft: margin["doubleLeft"],
                  marginRight: margin["doubleRight"],
                }}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{
                    marginTop: margin["top"],
                    marginBottom: margin["bottom"],
                    justifyContent: "center",
                  }}
                >
                  <Grid item xs={12}>
                    <RemovableDateTimeFilter title="Time Range" />
                  </Grid>
                  <Grid item xs={6}>
                    <DepthFilter />
                  </Grid>
                  <Grid item xs={6}>
                    <CategoryVocabFilter />
                  </Grid>
                  <Grid item xs={6}>
                    <DataDeliveryModeFilter />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked={componentParam.isImosOnlyDataset}
                          onClick={onImosOnlySwitch}
                        />
                      }
                      label={
                        <React.Fragment>
                          <img
                            src={imos_logo}
                            alt=""
                            width="40px"
                            height="10px"
                          />
                          IMOS Only
                        </React.Fragment>
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Collapse>
  );
};

AdvanceFilters.defaultProps = {
  showFilters: false,
  gridColumn: 10,
};

export default AdvanceFilters;
