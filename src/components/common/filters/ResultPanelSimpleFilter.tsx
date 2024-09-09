import { Grid, Paper, SxProps, Theme, Typography } from "@mui/material";

import { FC } from "react";
import { borderRadius, color, fontSize } from "../../../styles/constants";
import { formatNumber } from "../../../utils/StringUtils";
import MapViewButton, {
  MapViewButtonProps,
  SearchResultLayoutEnum,
} from "../buttons/MapViewButton";
import ResultListSortButton, {
  ResultListSortButtonProps,
  SortResultEnum,
} from "../buttons/ResultListSortButton";

interface ResultPanelSimpleFilterProps
  extends MapViewButtonProps<SearchResultLayoutEnum>,
    ResultListSortButtonProps<SortResultEnum> {
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
          {total === 0 ? (
            <Typography fontSize={fontSize.info} padding={0}>
              No result found
            </Typography>
          ) : total === 1 ? (
            <Typography fontSize={fontSize.info} padding={0}>
              Showing 1 of total 1 result
            </Typography>
          ) : (
            <Typography fontSize={fontSize.info} padding={0}>
              {/* TODO: here is a bug that the count might be larger than total, need to fix together with ogcapi */}
              Showing 1-{count <= total ? count : total} of
              {formatNumber(total)} results
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
