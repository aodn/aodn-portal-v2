import { FC } from "react";
import { Grid, Paper, SxProps, Theme, Typography } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontSize,
} from "../../../styles/constants";
import { formatNumber } from "../../../utils/StringUtils";
import ResultListLayoutButton, {
  ResultListLayoutButtonProps,
  SearchResultLayoutEnum,
} from "../buttons/ResultListLayoutButton";
import ResultListSortButton, {
  ResultListSortButtonProps,
  SortResultEnum,
} from "../buttons/ResultListSortButton";

interface ResultPanelSimpleFilterProps
  extends ResultListLayoutButtonProps<SearchResultLayoutEnum>,
    ResultListSortButtonProps<SortResultEnum> {
  count: number;
  total: number;
  sx?: SxProps<Theme>;
}

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({
  count,
  total,
  sx,
  currentLayout,
  onChangeLayout,
  currentSort,
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
            border: `${border.xs} ${color.blue.darkSemiTransparent}`,
            borderRadius: borderRadius.small,
            bgcolor: color.white.sixTenTransparent,
          }}
          data-testid="show-result-count"
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
              {/* TODO: here is a bug that the count number might be larger than total number */}
              Showing 1&nbsp;-&nbsp;{count}&nbsp;of&nbsp;{formatNumber(total)}
              &nbsp;results
            </Typography>
          )}
        </Paper>
      </Grid>
      <Grid item md={3} xs={6}>
        <ResultListSortButton
          onChangeSorting={onChangeSorting}
          currentSort={currentSort}
        />
      </Grid>
      <Grid item md={3} xs={6}>
        <ResultListLayoutButton
          onChangeLayout={onChangeLayout}
          currentLayout={currentLayout}
        />
      </Grid>
    </Grid>
  );
};

export default ResultPanelSimpleFilter;
