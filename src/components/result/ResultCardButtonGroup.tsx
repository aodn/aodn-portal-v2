import { FC, ReactNode } from "react";
import { Grid, SxProps } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import ResultCardButton, {
  ResultCardButtonConfig,
} from "../common/buttons/ResultCardButton";
import { color } from "../../styles/constants";

interface ResultCardButtonGroupProps {
  content: OGCCollection;
  isGridView?: boolean;
  shouldHideText?: boolean;
  onLinks?: () => void;
  onDownload?: () => void;
  onDetail?: () => void;
  resultCardButtonConfig?: ResultCardButtonConfig;
}

interface ButtonContainerProps {
  isGridView?: boolean;
  children: ReactNode;
  sx?: SxProps;
}

enum Status {
  Ongoing = "ongoing",
  Completed = "completed",
}

const renderStatusButton = (
  shouldHideText: boolean,
  content: OGCCollection,
  resultCardButtonConfig?: ResultCardButtonConfig
) => {
  const status = content?.getStatus()?.toLowerCase().trim();
  if (status === Status.Completed) {
    return (
      <ResultCardButton
        startIcon={TaskAltSharpIcon}
        text={"Completed"}
        shouldHideText={shouldHideText}
        resultCardButtonConfig={resultCardButtonConfig}
      />
    );
  }
  if (status === Status.Ongoing) {
    return (
      <ResultCardButton
        startIcon={DoubleArrowIcon}
        text={"On Going"}
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
    item
    xs={isGridView ? 6 : 3}
    display="flex"
    justifyContent="center"
    alignItems="center"
    sx={{ ...sx }}
  >
    {children}
  </Grid>
);

const ResultCardButtonGroup: FC<ResultCardButtonGroupProps> = ({
  content,
  isGridView,
  shouldHideText = false,
  onLinks = () => {},
  onDownload = undefined,
  onDetail = undefined,
  resultCardButtonConfig,
}) => {
  const links = content.getAllAIGroupedLinks();

  if (!content) return;
  return (
    <Grid container arial-label="result-list-card-buttons">
      <ButtonContainer isGridView={isGridView}>
        {renderStatusButton(shouldHideText, content, resultCardButtonConfig)}
      </ButtonContainer>
      <ButtonContainer isGridView={isGridView}>
        {links && (
          <ResultCardButton
            startIcon={LinkIcon}
            text={"Data Access"}
            shouldHideText={shouldHideText}
            onClick={onLinks}
            resultCardButtonConfig={resultCardButtonConfig}
            disabled={links.length === 0}
          />
        )}
      </ButtonContainer>
      <ButtonContainer isGridView={isGridView}>
        <ResultCardButton
          startIcon={DownloadIcon}
          text="Download"
          shouldHideText={shouldHideText}
          disabled={onDownload === undefined}
          onClick={onDownload}
          resultCardButtonConfig={resultCardButtonConfig}
        />
      </ButtonContainer>
      <ButtonContainer isGridView={isGridView}>
        <ResultCardButton
          startIcon={InfoIcon}
          text="More details"
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
