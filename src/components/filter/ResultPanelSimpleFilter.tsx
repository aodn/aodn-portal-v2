import { FC } from "react";
import { Paper, Stack, SxProps, Typography } from "@mui/material";
import { formatNumber } from "../../utils/StringUtils";
import ResultListLayoutButton, {
  ResultListLayoutButtonType,
  SearchResultLayoutEnum,
} from "../common/buttons/ResultListLayoutButton";
import ResultListSortButton, {
  ResultListSortButtonType,
  SortResultEnum,
} from "../common/buttons/ResultListSortButton";
import useBreakpoint from "../../hooks/useBreakpoint";
import ShareButtonMenu from "../menu/ShareButtonMenu";
import { portalTheme } from "../../styles";

export const SIMPLE_FILTER_DEFAULT_HEIGHT = 40;

export interface ResultPanelSimpleFilterType
  extends ResultListLayoutButtonType<SearchResultLayoutEnum>,
    ResultListSortButtonType<SortResultEnum> {
  count: number;
  total: number;
  sx?: SxProps;
}

interface ResultPanelSimpleFilterProps extends ResultPanelSimpleFilterType {}

const renderShowingResultsText = (
  total: number,
  count: number,
  isAboveDesktop: boolean,
  isMobile: boolean,
  currentLayout: SearchResultLayoutEnum | undefined
) =>
  total === 0
    ? "No result found"
    : total === 1
      ? isAboveDesktop ||
        (currentLayout === SearchResultLayoutEnum.FULL_LIST && !isMobile)
        ? "Showing 1 of total 1 result"
        : "1 of total 1 result"
      : isAboveDesktop ||
          (currentLayout === SearchResultLayoutEnum.FULL_LIST && !isMobile)
        ? `Showing 1 - ${count} of ${formatNumber(total)} results`
        : `1 - ${count} of ${formatNumber(total)} results`;

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({
  count,
  total,
  sx,
  currentLayout,
  onChangeLayout,
  currentSort,
  onChangeSorting,
}) => {
  const { isAboveDesktop, isUnderLaptop, isMobile } = useBreakpoint();

  return (
    <Stack sx={sx} direction="row" spacing={1} width="100%" flexWrap="nowrap">
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          height: SIMPLE_FILTER_DEFAULT_HEIGHT,
          border: `0.5px solid ${portalTheme.palette.grey500}`,
          borderRadius: "6px",
          bgcolor: portalTheme.palette.primary6,
          flexGrow: 1,
        }}
        data-testid="show-result-count"
      >
        <Typography variant="title2Regular" whiteSpace="nowrap" px={2}>
          {renderShowingResultsText(
            total,
            count,
            isAboveDesktop,
            isMobile,
            currentLayout
          )}
        </Typography>
      </Paper>
      <Stack flexDirection="row" flex={1} gap={1} flexWrap="nowrap">
        <ResultListSortButton
          onChangeSorting={onChangeSorting}
          currentSort={currentSort}
          isIconOnly={
            isAboveDesktop && currentLayout !== SearchResultLayoutEnum.FULL_LIST
              ? false
              : undefined
          }
        />
        <ResultListLayoutButton
          onChangeLayout={onChangeLayout}
          currentLayout={currentLayout}
          isIconOnly={
            isAboveDesktop && currentLayout !== SearchResultLayoutEnum.FULL_LIST
              ? false
              : undefined
          }
          excludeOptions={
            isUnderLaptop
              ? [SearchResultLayoutEnum.GRID, SearchResultLayoutEnum.LIST]
              : []
          }
        />
        {isUnderLaptop && (
          <ShareButtonMenu
            hideText
            sx={{
              maxHeight: SIMPLE_FILTER_DEFAULT_HEIGHT,
              maxWidth: SIMPLE_FILTER_DEFAULT_HEIGHT * 2,
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default ResultPanelSimpleFilter;
