import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ParameterState,
  updateCategories,
  updateDateTimeFilterRange,
} from "../store/componentParamReducer";
import store, { AppDispatch, getComponentState } from "../store/store";
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
import CloseIcon from "@mui/icons-material/Close";
import DateRangeSlider from "./DateRangeFilter";
import CategoryFilter from "./CategoryFilter";
import DepthFilter from "./DepthFilter";
import DataDeliveryModeFilter from "./DataDeliveryModeFilter";
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
  const dispatch = useDispatch<AppDispatch>();
  const componentParam: ParameterState = getComponentState(store.getState());

  // state used to store the provisional filter options selected
  // only dispatch to redux when 'apply' button is hit
  const [filter, setFilter] = useState<ParameterState>({});
  console.log("filter=====", filter);

  // initialize filter
  useEffect(() => {
    if (componentParam) {
      setFilter(componentParam);
    }
  }, [componentParam]);

  const handleCloseFilter = useCallback(() => {
    setShowFilters(false);
    setFilter({});
  }, [setShowFilters]);

  const onClearAll = useCallback(() => {
    setFilter({});
  }, []);

  // TODO: refactor: default-empty filter
  const handleApplyFilter = useCallback(() => {
    if (filter.dateTimeFilterRange) {
      dispatch(updateDateTimeFilterRange(filter.dateTimeFilterRange));
    } else {
      dispatch(updateDateTimeFilterRange({ start: undefined, end: undefined }));
    }
    if (filter.categories) {
      dispatch(updateCategories(filter.categories));
    } else {
      dispatch(updateCategories([]));
    }
    setShowFilters(false);
    setFilter({});
  }, [dispatch, filter.categories, filter.dateTimeFilterRange, setShowFilters]);

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
                <IconButton onClick={handleCloseFilter}>
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
                    <CategoryFilter filter={filter} setFilter={setFilter} />
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
                      onClick={handleApplyFilter}
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
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
