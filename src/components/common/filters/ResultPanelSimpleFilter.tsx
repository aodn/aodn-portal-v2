import { Grid, Paper, SxProps, Theme, Typography } from "@mui/material";

import { FC } from "react";
import { borderRadius, color, fontSize } from "../../../styles/constants";
import { formatNumber } from "../../../utils/StringUtils";
import MapViewButton from "../buttons/MapViewButon";
import ResultListSortButton from "../buttons/ResultListSortButton";
import { MapListToggleButtonProps } from "../buttons/MapListToggleButton";
import { SortButtonProps } from "../buttons/SortButton";

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
            borderRadius: borderRadius.small,
            bgcolor: color.white.sixTenTransparent,
          }}
        >
          {total === 1 ? (
            <Typography fontSize={fontSize.info} padding={0}>
              Showing 1 of total 1 result
            </Typography>
          ) : (
            <Typography fontSize={fontSize.info} padding={0}>
              Showing 1-{count} of {formatNumber(total)} results
            </Typography>
          )}
        </Paper>
      </Grid>
      <Grid item md={3} xs={6}>
        <ResultListSortButton onChangeSorting={onChangeSorting} />
      </Grid>
      <Grid item md={3} xs={6}>
        <MapViewButton onChangeLayout={onChangeLayout} />
      </Grid>
    </Grid>
  );
};

export default ResultPanelSimpleFilter;
