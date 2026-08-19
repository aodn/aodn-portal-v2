import { FC } from "react";
import { Box, Grid } from "@mui/material";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { TemporalIcon } from "@/assets/icons/details/temporal";
import { DataAccessIcon } from "@/assets/icons/result/link";
import { DownloadsIcon } from "@/assets/icons/result/download";
import { DetailsIcon } from "@/assets/icons/result/details";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import ResultCardButton, {
  DEFAULT_RESULT_CARD_BUTTON_SIZE,
  ResultCardButtonConfig,
  ResultCardButtonSize,
} from "../common/buttons/ResultCardButton";
import { color, padding } from "@/styles/constants";
import { OpenType } from "../../hooks/useTabNavigation";

interface ResultCardButtonGroupProps {
  content: OGCCollection;
  isGridView?: boolean;
  shouldHideText?: boolean;
  onLinks?: (type: OpenType | undefined) => void;
  onDownload?: (type: OpenType | undefined) => void;
  onDetail?: (type: OpenType | undefined) => void;
  resultCardButtonConfig?: ResultCardButtonConfig;
}

// Lowercased status values accepted for each button, as the records use several
// spellings for the same status and may combine codes into one string
const Status = {
  Ongoing: ["ongoing", "ongoing | historicalarchive"],
  Completed: ["completed", "complete"],
};

// Rendered size per icon, chosen so each glyph measures the same ink box as the
// design. They differ because each icon fills a different share of its viewBox.
const iconSize = {
  [ResultCardButtonSize.SMALL]: {
    onGoing: 13,
    completed: 16,
    noStatus: 16,
    dataAccess: 16,
    downloads: 16,
    details: 16,
  },
  [ResultCardButtonSize.MEDIUM]: {
    onGoing: 16,
    completed: 20,
    noStatus: 20,
    dataAccess: 20,
    downloads: 20,
    details: 20,
  },
};

const renderStatusButton = (
  shouldHideText: boolean,
  content: OGCCollection,
  size: ResultCardButtonSize,
  resultCardButtonConfig?: ResultCardButtonConfig
) => {
  const status = content?.getStatus()?.toLowerCase().trim();
  if (status && Status.Completed.includes(status)) {
    return (
      <ResultCardButton
        startIcon={TaskAltSharpIcon}
        iconSize={iconSize[size].completed}
        isInteractive={false}
        text="Completed"
        shouldHideText={shouldHideText}
        resultCardButtonConfig={resultCardButtonConfig}
      />
    );
  }
  if (status && Status.Ongoing.includes(status)) {
    return (
      <ResultCardButton
        startIcon={TemporalIcon}
        isSvgIcon
        iconSize={iconSize[size].onGoing}
        isInteractive={false}
        text="On going"
        resultCardButtonConfig={{
          ...resultCardButtonConfig,
          color: color.success.main,
        }}
        shouldHideText={shouldHideText}
      />
    );
  }
  return (
    <ResultCardButton
      startIcon={QuestionMarkIcon}
      iconSize={iconSize[size].noStatus}
      isInteractive={false}
      text="No Status"
      shouldHideText={shouldHideText}
      resultCardButtonConfig={resultCardButtonConfig}
    />
  );
};

const ResultCardButtonGroup: FC<ResultCardButtonGroupProps> = ({
  content,
  isGridView,
  shouldHideText = false,
  onLinks = undefined,
  onDownload = undefined,
  onDetail = undefined,
  resultCardButtonConfig,
}) => {
  const links = content.getAllAIGroupedLinks();

  if (!content) return;

  const size = resultCardButtonConfig?.size ?? DEFAULT_RESULT_CARD_BUTTON_SIZE;

  const buttons = [
    {
      key: "status",
      node: renderStatusButton(
        shouldHideText,
        content,
        size,
        resultCardButtonConfig
      ),
    },
    {
      key: "data-access",
      node: links && (
        <ResultCardButton
          startIcon={DataAccessIcon}
          isSvgIcon
          iconSize={iconSize[size].dataAccess}
          text="Data Access"
          shouldHideText={shouldHideText}
          onClick={onLinks}
          resultCardButtonConfig={resultCardButtonConfig}
          disabled={links.length === 0}
        />
      ),
    },
    {
      key: "downloads",
      node: (
        <ResultCardButton
          startIcon={DownloadsIcon}
          isSvgIcon
          iconSize={iconSize[size].downloads}
          text="Downloads"
          shouldHideText={shouldHideText}
          disabled={onDownload === undefined}
          onClick={onDownload}
          resultCardButtonConfig={resultCardButtonConfig}
        />
      ),
    },
    {
      key: "details",
      node: (
        <ResultCardButton
          startIcon={DetailsIcon}
          isSvgIcon
          iconSize={iconSize[size].details}
          text="Details"
          shouldHideText={shouldHideText}
          disabled={onDetail === undefined}
          onClick={onDetail}
          resultCardButtonConfig={resultCardButtonConfig}
        />
      ),
    },
  ];

  // Grid view stacks the buttons 2x2, so it keeps the Grid and its equal
  // columns — the pairs have to line up vertically between the two rows
  if (isGridView) {
    return (
      <Grid
        container
        aria-label="result-list-card-buttons"
        sx={{ width: "100%", pl: padding.double }}
      >
        {buttons.map(({ key, node }) => (
          <Grid
            key={key}
            size={6}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            {node}
          </Grid>
        ))}
      </Grid>
    );
  }

  // List view puts all four on one row. No Grid here, so
  // the buttons keep their natural widths and space-between equalises
  // the gaps.
  return (
    <Box
      aria-label="result-list-card-buttons"
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {buttons.map(({ key, node }) => (
        <Box key={key} sx={{ display: "flex", alignItems: "center" }}>
          {node}
        </Box>
      ))}
    </Box>
  );
};

export default ResultCardButtonGroup;
