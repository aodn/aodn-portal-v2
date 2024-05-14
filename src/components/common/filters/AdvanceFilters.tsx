import React from "react";
import {
  Backdrop,
  Box,
  Collapse,
  Grid,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import RemovableDateTimeFilter from "./RemovableDateTimeFilter";
import DepthFilter from "./DepthFilter";
import DataDeliveryModeFilter from "./DataDeliveryModeFilter";
import CategoryVocabFilter from "./CategoryVocabFilter";
import ImosOnlySwitch from "./ImosOnlySwitch.tsx";
import FilterSection from "./FilterSection.tsx";
import { borderRadius, margin, zIndex } from "../../../styles/constants";

export interface NonRemovableFiltersProps {
  showFilters: boolean;
  setShowFilters?: (value: boolean) => void;
  gridColumn: number;
  sx?: SxProps<Theme>;
}

const AdvanceFilters = (props: NonRemovableFiltersProps) => {
  const theme = useTheme();
  return (
    <>
      <Backdrop
        open={props.showFilters}
        sx={{ zIndex: zIndex["FILTER_MODAL"] }}
        onClick={() => {
          props.setShowFilters(false);
        }}
      />
      <Collapse
        orientation="vertical"
        in={props.showFilters}
        sx={{
          // Make it overlay instead of push smart card downwards
          zIndex: zIndex["FILTER_OVERLAY"],
          position: "absolute",
          width: "80%",
        }}
      >
        <Grid
          container
          xs={12}
          justifyContent={"center"}
          sx={{
            marginTop: margin["top"],
            borderRadius: borderRadius["filter"],
            backgroundColor: theme.palette.common.white,
            ...props.sx,
          }}
        >
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h3">Filters</Typography>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{
              margin: `${margin["top"]} ${margin["doubleLeft"]}`,
              justifyContent: "center",
            }}
          >
            <Grid item xs={12}>
              <FilterSection title={"Time Range"}>
                <RemovableDateTimeFilter />
              </FilterSection>
            </Grid>
            <Grid item xs={6}>
              <FilterSection title={"Depth"}>
                <DepthFilter />
              </FilterSection>
            </Grid>
            <Grid item xs={6}>
              <FilterSection isTitleOnlyHeader title={"Parameter"}>
                <CategoryVocabFilter />
              </FilterSection>
            </Grid>
            <Grid item xs={6}>
              <FilterSection isTitleOnlyHeader title={"Data Delivery Mode"}>
                <DataDeliveryModeFilter />
              </FilterSection>
            </Grid>
            <Grid item xs={1}>
              <FilterSection title={""}>
                <ImosOnlySwitch />
              </FilterSection>
            </Grid>
            <Grid item xs={5} />
          </Grid>
        </Grid>
      </Collapse>
    </>
  );
};

AdvanceFilters.defaultProps = {
  showFilters: false,
  gridColumn: 12,
};

export default AdvanceFilters;
