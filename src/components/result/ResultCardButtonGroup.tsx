import { FC, ReactNode } from "react";
import { Grid, SxProps } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import ResultCardButton from "../common/buttons/ResultCardButton";
import { color } from "../../styles/constants";

interface ResultCardButtonGroupProps {
  content: OGCCollection;
  isGridView?: boolean;
  shouldHideText?: boolean;
  onLinks?: () => void;
  onDownload?: () => void;
  onDetail?: () => void;
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

const generateLinkText = (linkLength: number) => {
  if (linkLength === 0) {
    return "No Links";
  }
  if (linkLength === 1) {
    return "1 Link";
  }
  return `${linkLength} Links`;
};

const renderStatusButton = (
  shouldHideText: boolean,
  content: OGCCollection
) => {
  const status = content?.getStatus()?.toLowerCase().trim();
  if (status === Status.Completed) {
    return (
      <ResultCardButton
        startIcon={TaskAltSharpIcon}
        text={"Completed"}
        shouldHideText={shouldHideText}
      />
    );
  }
  if (status === Status.Ongoing) {
    return (
      <ResultCardButton
        startIcon={DoubleArrowIcon}
        text={"On Going"}
        resultCardButtonConfig={{ color: "success" }}
        shouldHideText={shouldHideText}
      />
    );
  }
  return (
    <ResultCardButton
      startIcon={QuestionMarkIcon}
      text="No Status"
      shouldHideText={shouldHideText}
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
    justifyContent="space-between"
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
  onDownload = () => {},
  onDetail = () => {},
}) => {
  const links = content.getDistributionLinks();

  if (!content) return;
  return (
    <Grid container arial-label="result-list-card-buttons">
      <ButtonContainer isGridView={isGridView}>
        {renderStatusButton(shouldHideText, content)}
      </ButtonContainer>
      <ButtonContainer isGridView={isGridView}>
        {links && (
          <ResultCardButton
            startIcon={LinkIcon}
            text={generateLinkText(links.length)}
            shouldHideText={shouldHideText}
            onClick={onLinks}
            resultCardButtonConfig={{
              color: links.length > 0 ? color.blue.dark : color.gray.light,
            }}
            disable={links.length === 0}
          />
        )}
      </ButtonContainer>
      <ButtonContainer isGridView={isGridView}>
        <ResultCardButton
          startIcon={DownloadIcon}
          text="Download"
          shouldHideText={shouldHideText}
          onClick={onDownload}
        />
      </ButtonContainer>
      <ButtonContainer isGridView={isGridView}>
        <ResultCardButton
          startIcon={InfoIcon}
          text="More details ..."
          shouldHideText={shouldHideText}
          onClick={onDetail}
        />
      </ButtonContainer>
    </Grid>
  );
};

export default ResultCardButtonGroup;
