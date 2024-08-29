import {
  Grid,
  InputBase,
  Paper,
  styled,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import MapListToggleButton, {
  MapListToggleButtonProps,
} from "../buttons/MapListToggleButton";
import SortButton, { SortButtonProps } from "../buttons/SortButton";
import { FC } from "react";
import { borderRadius, fontSize } from "../../../styles/constants";

interface ResultPanelSimpleFilterProps
  extends MapListToggleButtonProps,
    SortButtonProps {
  count: number;
  total: number;
  sx?: SxProps<Theme>;
}

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({
  count,
  total,
  sx,
  onChangeLayout,
  onChangeSorting,
}) => {
  return (
    <Grid sx={sx} container justifyContent="center" spacing={1}>
      <Grid item md={6} xs={12}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            borderRadius: borderRadius.medium,
          }}
        >
          <Typography fontSize={fontSize.info} padding={0}>
            Showing 1-{count} of {total} results
          </Typography>
        </Paper>
      </Grid>
      <Grid item md={3} xs={6}>
        <SortButton onChangeSorting={onChangeSorting} />
      </Grid>
      <Grid item md={3} xs={6}>
        <MapListToggleButton onChangeLayout={onChangeLayout} />
      </Grid>
    </Grid>
  );
};

export default ResultPanelSimpleFilter;
