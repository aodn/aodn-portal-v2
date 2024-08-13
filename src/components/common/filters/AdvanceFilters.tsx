import { FC, useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Fade,
  Grid,
  IconButton,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import RemovableDateTimeFilter from "./RemovableDateTimeFilter";
import DepthFilter from "./DepthFilter";
import DataDeliveryModeFilter from "./DataDeliveryModeFilter";
import CategoryVocabFilter from "./CategoryVocabFilter";
import ImosOnlySwitch from "./ImosOnlySwitch";
import FilterSection from "./FilterSection";
import {
  border,
  borderRadius,
  color,
  margin,
  padding,
  zIndex,
} from "../../../styles/constants";
import CloseIcon from "@mui/icons-material/Close";
import { ParameterState } from "../store/componentParamReducer";
import store, { getComponentState } from "../store/store";
import DateRangeSlider from "./DateRangeFilter";

export interface NonRemovableFiltersProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  sx?: SxProps<Theme>;
}

const AdvanceFilters: FC<NonRemovableFiltersProps> = ({
  showFilters = false,
  setShowFilters = () => {},
  sx = {},
}) => {
  const theme = useTheme();

  const componentParam: ParameterState = getComponentState(store.getState());

  // state used to store the provisional filter options selected
  // only dispatch when 'apply' button is hit
  const [filter, setFilter] = useState<ParameterState>({});
  console.log("filter=====", filter);

  // initialize filter
  useEffect(() => {
    if (componentParam) {
      setFilter(componentParam);
    }
  }, [componentParam]);

  const onCloseFilter = useCallback(() => {
    setShowFilters(false);
  }, [setShowFilters]);

  const onClearAll = useCallback(() => {}, []);

  const onApplyFilter = useCallback(() => {}, []);

  return (
    <>
      <Dialog
        open={showFilters}
        onClose={() => {
          setShowFilters(false);
        }}
        TransitionComponent={Fade}
        transitionDuration={{ enter: 500, exit: 300 }}
        fullWidth
      >
        <Box
          sx={{
            zIndex: zIndex.FILTER_OVERLAY,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "90%",
            maxHeight: "90%",
            overflow: "auto",
            ...sx,
          }}
        >
          <Box sx={{ minWidth: "1000px" }}>
            <Grid
              container
              justifyContent="center"
              sx={{
                borderRadius: borderRadius.filter,
                backgroundColor: theme.palette.common.white,
              }}
            >
              <Box
                position="absolute"
                top={margin.sm}
                right={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button onClick={onClearAll} sx={{ paddingX: padding.medium }}>
                  Clear All
                </Button>
                <IconButton onClick={onCloseFilter}>
                  <CloseIcon />
                </IconButton>
              </Box>
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
                  padding: padding.double,
                  paddingTop: padding.small,
                  justifyContent: "center",
                }}
              >
                <Grid item xs={12}>
                  <FilterSection title={"Time Range"}>
                    <DateRangeSlider filter={filter} setFilter={setFilter} />
                  </FilterSection>
                </Grid>
                <Grid item xs={5}>
                  <FilterSection title={"Depth"}>
                    <DepthFilter />
                  </FilterSection>
                </Grid>
                <Grid item xs={7}>
                  <FilterSection isTitleOnlyHeader title={"Parameter"}>
                    <CategoryVocabFilter />
                  </FilterSection>
                </Grid>
                <Grid item xs={5}>
                  <FilterSection isTitleOnlyHeader title={"Data Delivery Mode"}>
                    <DataDeliveryModeFilter />
                  </FilterSection>
                </Grid>
                <Grid item xs={2}>
                  <Box width="70%" height="100%">
                    <FilterSection title={""}>
                      <ImosOnlySwitch />
                    </FilterSection>
                  </Box>
                </Grid>
                <Grid item xs={5} display="flex" justifyContent="end">
                  <Box alignContent="end">
                    <Button
                      sx={{
                        width: "100px",
                        border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                        "&:hover": {
                          backgroundColor: color.blue.darkSemiTransparent,
                        },
                      }}
                      onClick={onApplyFilter}
                    >
                      Apply
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default AdvanceFilters;
