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

//todo: confirm text
const renderShowingResultsText = (total: number, count: number) =>
  total === 0
    ? "No results found"
    : total === 1
      ? "1 of 1 result"
      : `${count} of ${formatNumber(total)} results`;

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
          height: "40px",
          border: `0.5px solid ${rc8Theme.palette.grey500}`,
          borderRadius: "6px",
          bgcolor: rc8Theme.palette.primary6,
          px: "20px",
          py: "10px",
        }}
        data-testid="show-result-count"
      >
        <Typography variant="title2Regular">
          {renderShowingResultsText(total, count)}
        </Typography>
      </Paper>
      <Stack flexDirection="row" flex={1} gap={1} flexWrap="nowrap">
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
