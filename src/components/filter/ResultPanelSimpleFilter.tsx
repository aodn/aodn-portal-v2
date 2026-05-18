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
  isSmallMobile: boolean,
  currentLayout: SearchResultLayoutEnum | undefined
) => {
  if (total === 0) return "No result found";

  const isLongForm =
    isAboveDesktop ||
    (currentLayout === SearchResultLayoutEnum.FULL_LIST && !isMobile);

  if (total === 1) {
    if (isLongForm) return "Showing 1 of total 1 result";
    return isSmallMobile ? "1 of total 1" : "1 of total 1 result";
  }

  const range = `1 - ${count} of ${formatNumber(total)}`;
  if (isLongForm) return `Showing ${range} results`;
  return isSmallMobile ? range : `${range} results`;
};

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({
  count,
  total,
  sx,
  currentLayout,
  onChangeLayout,
  currentSort,
  onChangeSorting,
}) => {
  const { isAboveDesktop, isUnderLaptop, isMobile, isSmallMobile } =
    useBreakpoint();

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
            isSmallMobile,
            currentLayout
          )}
        </Typography>
      </Paper>
      <Stack flexDirection="row" flex={1} gap={1} flexWrap="nowrap">
        <ResultListSortButton
          onChangeSorting={onChangeSorting}
          currentSort={currentSort}
          isIconOnly={
            isMobile
              ? true
              : isAboveDesktop &&
                  currentLayout !== SearchResultLayoutEnum.FULL_LIST
                ? false
                : undefined
          }
        />
        <ResultListLayoutButton
          onChangeLayout={onChangeLayout}
          currentLayout={currentLayout}
          isIconOnly={
            isMobile
              ? true
              : isAboveDesktop &&
                  currentLayout !== SearchResultLayoutEnum.FULL_LIST
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
