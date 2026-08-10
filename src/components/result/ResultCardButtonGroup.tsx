import { FC, ReactNode } from "react";
import { Grid, SxProps } from "@mui/material";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { TemporalIcon } from "@/assets/icons/details/temporal";
import { DataAccessIcon } from "@/assets/icons/result/link";
import { DownloadsIcon } from "@/assets/icons/result/download";
import { DetailsIcon } from "@/assets/icons/result/details";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import ResultCardButton, {
  ResultCardButtonConfig,
} from "../common/buttons/ResultCardButton";
import { color } from "@/styles/constants";
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

interface ButtonContainerProps {
  isGridView?: boolean;
  children: ReactNode;
  sx?: SxProps;
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
  onGoing: 16,
  dataAccess: 20,
  downloads: 20,
  details: 20,
};

const renderStatusButton = (
  shouldHideText: boolean,
  content: OGCCollection,
  resultCardButtonConfig?: ResultCardButtonConfig
) => {
  const status = content?.getStatus()?.toLowerCase().trim();
  if (status && Status.Completed.includes(status)) {
    return (
      <ResultCardButton
        startIcon={TaskAltSharpIcon}
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
        iconSize={iconSize.onGoing}
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
      text="No Status"
      shouldHideText={shouldHideText}
      resultCardButtonConfig={resultCardButtonConfig}
    />
  );
};

const ButtonContainer: FC<ButtonContainerProps> = ({
  isGridView,
  children,
  sx,
}) => (
  <Grid
    display="flex"
    justifyContent="center"
    alignItems="center"
    sx={{ ...sx }}
    size={isGridView ? 6 : 3}
  >
    {children}
  </Grid>
);

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
  return (
    // Grid v2 containers do not stretch by default; without width the
    // size={3} columns collapse and labels sit on top of each other.
    <Grid
      container
      arial-label="result-list-card-buttons"
      sx={{ width: "100%" }}
    >
      <ButtonContainer isGridView={isGridView}>
        {renderStatusButton(shouldHideText, content, resultCardButtonConfig)}
      </ButtonContainer>
      <ButtonContainer isGridView={isGridView}>
        {links && (
          <ResultCardButton
            startIcon={DataAccessIcon}
            isSvgIcon
            iconSize={iconSize.dataAccess}
            text="Data Access"
            shouldHideText={shouldHideText}
            onClick={onLinks}
            resultCardButtonConfig={resultCardButtonConfig}
            disabled={links.length === 0}
          />
        )}
      </ButtonContainer>
      <ButtonContainer isGridView={isGridView}>
        <ResultCardButton
          startIcon={DownloadsIcon}
          isSvgIcon
          iconSize={iconSize.downloads}
          text="Downloads"
          shouldHideText={shouldHideText}
          disabled={onDownload === undefined}
          onClick={onDownload}
          resultCardButtonConfig={resultCardButtonConfig}
        />
      </ButtonContainer>
      <ButtonContainer isGridView={isGridView}>
        <ResultCardButton
          startIcon={DetailsIcon}
          isSvgIcon
          iconSize={iconSize.details}
          text="Details"
          shouldHideText={shouldHideText}
          disabled={onDetail === undefined}
          onClick={onDetail}
          resultCardButtonConfig={resultCardButtonConfig}
        />
      </ButtonContainer>
    </Grid>
  );
};

export default ResultCardButtonGroup;
