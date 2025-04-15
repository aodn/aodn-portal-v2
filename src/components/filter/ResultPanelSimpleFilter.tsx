import { FC, useMemo } from "react";
import { Box, Grid, Paper, Stack, SxProps, Typography } from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";
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
import ShareButtonMenu, { ShareMenuItem } from "../menu/ShareButtonMenu";

export interface ResultPanelSimpleFilterType
  extends ResultListLayoutButtonType<SearchResultLayoutEnum>,
    ResultListSortButtonType<SortResultEnum> {
  count: number;
  total: number;
  sx?: SxProps;
}

const RESULT_COUNT_INFO_WIDTH = 200;

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
  const { checkIfCopied, copyToClipboard } = useClipboard();

  const copyUrl = window.location.href;
  const isCopied = checkIfCopied(copyUrl);
  const shareItems: ShareMenuItem[] = useMemo(
    () => [
      {
        name: isCopied ? "Link Copied" : "Copy Link",
        icon: isCopied ? (
          <DoneAllIcon fontSize="small" color="primary" />
        ) : (
          <ContentCopy fontSize="small" color="primary" />
        ),
        handler: () => copyToClipboard(copyUrl),
      },
    ],
    [isCopied, copyToClipboard, copyUrl]
  );

  return (
    <Stack sx={sx} direction="row" spacing={1} width="100%">
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: RESULT_COUNT_INFO_WIDTH,
          border: `${border.xs} ${color.blue.darkSemiTransparent}`,
          borderRadius: borderRadius.small,
          bgcolor: color.white.sixTenTransparent,
          paddingX: padding.extraSmall,
        }}
        data-testid="show-result-count"
      >
        <Typography
          fontSize={fontSize.label}
          padding={0}
          lineHeight={`${ICON_SELECT_DEFAULT_HEIGHT}px`}
          sx={{ whiteSpace: "nowrap" }}
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
        <ShareButtonMenu
          menuItems={shareItems}
          hideText
          sx={{
            maxHeight: ICON_SELECT_DEFAULT_HEIGHT,
            maxWidth: ICON_SELECT_DEFAULT_HEIGHT * 2,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default ResultPanelSimpleFilter;
