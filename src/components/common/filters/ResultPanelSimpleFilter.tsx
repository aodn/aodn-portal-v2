import { FC } from "react";
import { Grid, Paper, SxProps, Theme, Typography } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontSize,
} from "../../../styles/constants";
import { formatNumber } from "../../../utils/StringUtils";
import ResultListLayoutButton from "../buttons/ResultListLayoutButton";
import ResultListSortButton from "../buttons/ResultListSortButton";
import { useSearchPageContext } from "../../../pages/search-page/context/SearchPageContext";
import { useSelector } from "react-redux";
import { RootState, searchQueryResult } from "../store/store";
import { CollectionsQueryType } from "../store/searchReducer";

interface ResultPanelSimpleFilterProps {
  sx?: SxProps<Theme>;
}

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({ sx }) => {
  const { currentLayout, onChangeLayout, currentSort, onChangeSorting } =
    useSearchPageContext();

  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );

  const count = reduxContents.result.collections.length;
  const total = reduxContents.result.total;

  if (!reduxContents) return;

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
