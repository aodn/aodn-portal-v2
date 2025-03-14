import { FC } from "react";
import { Grid, Paper, SxProps, Typography } from "@mui/material";
import { border, borderRadius, color, fontSize } from "../../styles/constants";
import { formatNumber } from "../../utils/StringUtils";
import ResultListLayoutButton, {
  ResultListLayoutButtonType,
  SearchResultLayoutEnum,
} from "../common/buttons/ResultListLayoutButton";
import ResultListSortButton, {
  ResultListSortButtonType,
  SortResultEnum,
} from "../common/buttons/ResultListSortButton";
import { ICON_SELECT_DEFAULT_HEIGHT } from "../common/dropdown/IconSelect";
import useBreakpoint from "../../hooks/useBreakpoint";

export interface ResultPanelSimpleFilterType
  extends ResultListLayoutButtonType<SearchResultLayoutEnum>,
    ResultListSortButtonType<SortResultEnum> {
  count: number;
  total: number;
  sx?: SxProps;
}

interface ResultPanelSimpleFilterProps extends ResultPanelSimpleFilterType {}

const renderShowingResultsText = (total: number, count: number) =>
  total === 0
    ? "No result found"
    : total === 1
      ? "Showing 1 of total 1 result"
      : `Showing 1 - ${count} of ${formatNumber(total)} results`;

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({
  count,
  total,
  sx,
  currentLayout,
  onChangeLayout,
  currentSort,
  onChangeSorting,
  isIconOnly,
}) => {
  const { isUnderLaptop } = useBreakpoint();
  return (
    <Grid sx={sx} container justifyContent="center" spacing={1}>
      <Grid item md={6} xs={8}>
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
          <Typography
            fontSize={fontSize.info}
            padding={0}
            lineHeight={`${ICON_SELECT_DEFAULT_HEIGHT}px`}
          >
            {renderShowingResultsText(total, count)}
          </Typography>
        </Paper>
      </Grid>
      <Grid item md={3} xs={2}>
        <ResultListSortButton
          onChangeSorting={onChangeSorting}
          currentSort={currentSort}
          isIconOnly={isIconOnly}
        />
      </Grid>
      <Grid item md={3} xs={2}>
        <ResultListLayoutButton
          onChangeLayout={onChangeLayout}
          currentLayout={currentLayout}
          isIconOnly={isIconOnly}
          excludeOptions={
            isUnderLaptop
              ? [SearchResultLayoutEnum.GRID, SearchResultLayoutEnum.LIST]
              : []
          }
        />
      </Grid>
    </Grid>
  );
};

export default ResultPanelSimpleFilter;
