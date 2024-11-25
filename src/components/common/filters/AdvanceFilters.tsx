import { Dispatch, FC, SetStateAction, useCallback, useEffect } from "react";
import { ParameterState } from "../store/componentParamReducer";
import store, { getComponentState } from "../store/store";
import {
  Box,
  Button,
  Grid,
  IconButton,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ParameterVocabFilter from "./ParameterVocabFilter";
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
} from "../../../styles/constants";

interface AdvanceFiltersProps {
  handleCloseFilter: () => void;
  filter: ParameterState;
  setFilter: Dispatch<SetStateAction<ParameterState>>;
  handleApplyFilter: (filter: ParameterState) => void;
  sx?: SxProps<Theme>;
}

const AdvanceFilters: FC<AdvanceFiltersProps> = ({
  handleCloseFilter,
  filter,
  setFilter,
  handleApplyFilter,
  sx = {},
}) => {
  const theme = useTheme();

  const componentParam = getComponentState(store.getState());

  useEffect(() => {
    if (componentParam) {
      setFilter(componentParam);
    }
  }, [componentParam, setFilter]);

  const handleClose = useCallback(() => {
    handleCloseFilter();
    setFilter({});
  }, [handleCloseFilter, setFilter]);

  const onClearAll = useCallback(() => {
    setFilter({});
  }, [setFilter]);

  return (
    <>
      <Box sx={{ width: "100%", ...sx }}>
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
            <IconButton onClick={handleClose}>
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
            <Grid item xs={5}>
              <FilterSection
                title="Depth"
                toolTip="Filter by the depth of the measurements"
              >
                <DepthFilter filter={filter} setFilter={setFilter} />
              </FilterSection>
            </Grid>
            <Grid item xs={7}>
              <FilterSection
                isTitleOnlyHeader
                title="Parameters"
                toolTip="Filter by the parameter that has been measured or observed"
              >
                <ParameterVocabFilter filter={filter} setFilter={setFilter} />
              </FilterSection>
            </Grid>
            <Grid item xs={5}>
              <FilterSection
                isTitleOnlyHeader
                title={"Data Delivery Mode"}
                toolTip="Filter by the how up to date the data is"
              >
                <DataDeliveryModeFilter filter={filter} setFilter={setFilter} />
              </FilterSection>
            </Grid>
            <Grid item xs={2}>
              <Box width="70%" height="100%">
                <FilterSection title={""}>
                  <ImosOnlySwitch filter={filter} setFilter={setFilter} />
                </FilterSection>
              </Box>
            </Grid>
            <Grid
              item
              xs={5}
              display="flex"
              justifyContent="end"
              alignItems="end"
            >
              <Button
                sx={{
                  width: "100px",
                  border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                  "&:hover": {
                    backgroundColor: color.blue.darkSemiTransparent,
                  },
                }}
                onClick={() => handleApplyFilter(filter)}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AdvanceFilters;
