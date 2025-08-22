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
import { ICON_SELECT_DEFAULT_HEIGHT } from "../common/dropdown/IconSelect";
import useBreakpoint from "../../hooks/useBreakpoint";
import ShareButtonMenu from "../menu/ShareButtonMenu";
import rc8Theme from "../../styles/themeRC8";

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
  isUnderLaptop: boolean
) =>
  total === 0
    ? "No result found"
    : total === 1
      ? isUnderLaptop
        ? "1 of total 1 result"
        : "Showing 1 of total 1 result"
      : isUnderLaptop
        ? `1 - ${count} of ${formatNumber(total)} results`
        : `Showing 1 - ${count} of ${formatNumber(total)} results`;

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({
  count,
  total,
  sx,
  currentLayout,
  onChangeLayout,
  currentSort,
  onChangeSorting,
}) => {
  const { isUnderLaptop, isMobile } = useBreakpoint();

  return (
    <Stack sx={sx} direction="row" spacing={1} width="100%" flexWrap="nowrap">
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          height: "40px",
          border: `0.5px solid ${rc8Theme.palette.grey500}`,
          borderRadius: "6px",
          bgcolor: rc8Theme.palette.primary6,
          px: isUnderLaptop ? (isMobile ? "0" : "4px") : "20px",
          py: "10px",
          flexShrink: 0,
        }}
        data-testid="show-result-count"
      >
        <Typography
          variant="title2Regular"
          whiteSpace="nowrap"
          sx={{
            fontSize: "16px",
          }}
          px={2}
        >
          {renderShowingResultsText(total, count, isUnderLaptop)}
        </Typography>
      </Paper>
      <Stack
        flexDirection="row"
        flex={1}
        gap={1}
        flexWrap="nowrap"
        minWidth={0}
      >
        <ResultListSortButton
          onChangeSorting={onChangeSorting}
          currentSort={currentSort}
          isIconOnly={isMobile}
        />
        <ResultListLayoutButton
          onChangeLayout={onChangeLayout}
          currentLayout={currentLayout}
          isIconOnly={isMobile}
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
              maxHeight: ICON_SELECT_DEFAULT_HEIGHT,
              maxWidth: ICON_SELECT_DEFAULT_HEIGHT * 2,
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default ResultPanelSimpleFilter;
