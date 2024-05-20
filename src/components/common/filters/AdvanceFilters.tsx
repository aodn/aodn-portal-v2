import {
  Box,
  Fade,
  Grid,
  Modal,
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
      <Modal
        open={props.showFilters}
        onClose={() => {
          props.setShowFilters(false);
        }}
      >
        <Fade in={props.showFilters} timeout={{ enter: 500, exit: 300 }}>
          <Box
            sx={{
              zIndex: zIndex["FILTER_OVERLAY"],
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50%",
              minWidth: "1090px",
              maxWidth: "2000px",
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
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

AdvanceFilters.defaultProps = {
  showFilters: false,
  gridColumn: 12,
};

export default AdvanceFilters;
