import { FC } from "react";
import { Paper, Stack, SxProps, Typography } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontSize,
  padding,
} from "../../styles/constants";
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
import useClipboard from "../../hooks/useClipboard";
import ShareButtonMenu from "../menu/ShareButtonMenu";

export interface ResultPanelSimpleFilterType
  extends ResultListLayoutButtonType<SearchResultLayoutEnum>,
    ResultListSortButtonType<SortResultEnum> {
  count: number;
  total: number;
  sx?: SxProps;
}

const RESULT_COUNT_INFO_WIDTH_MOBILE = 200;
const RESULT_COUNT_INFO_WIDTH_TABLET = 220;

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
}) => {
  const { isUnderLaptop, isMobile } = useBreakpoint();

  return (
    <Stack sx={sx} direction="row" spacing={1} width="100%">
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: {
            xs: RESULT_COUNT_INFO_WIDTH_MOBILE,
            sm: RESULT_COUNT_INFO_WIDTH_TABLET,
          },
          border: `${border.xs} ${color.blue.darkSemiTransparent}`,
          borderRadius: borderRadius.small,
          bgcolor: color.white.sixTenTransparent,
          paddingX: padding.extraSmall,
        }}
        data-testid="show-result-count"
      >
        <Typography
          padding={0}
          lineHeight={`${ICON_SELECT_DEFAULT_HEIGHT}px`}
          sx={{
            whiteSpace: "nowrap",
            fontSize: { xs: fontSize.label, sm: fontSize.info },
          }}
        >
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
