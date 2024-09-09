import { FC, useCallback } from "react";
import { Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import ResultCardButton from "./ResultCardButton";

interface ResultCardButtonGroupProps {
  content: OGCCollection;
  onDownload?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onDetail: () => void;
  isGridView?: boolean;
  shouldHideText?: boolean;
}

enum Status {
  Ongoing = "ongoing",
  Completed = "completed",
}

const generateLinkText = (linkLength: number) => {
  if (linkLength === 0) {
    return "No Link";
  }
  if (linkLength === 1) {
    return "1 Link";
  }
  return `${linkLength} Links`;
};

const ResultCardButtonGroup: FC<ResultCardButtonGroupProps> = ({
  content,
  onDownload,
  onDetail,
  isGridView = false,
  shouldHideText = false,
}) => {
  const renderStatusButton = useCallback(
    (content: OGCCollection) => {
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
    },
    [shouldHideText]
  );

  return (
    <Grid container arial-label="result-list-card-buttons">
      <Grid item xs={isGridView ? 6 : 3}>
        {renderStatusButton(content)}
      </Grid>
      <Grid item xs={isGridView ? 6 : 3}>
        {content.getDistributionLinks() && (
          <ResultCardButton
            startIcon={LinkIcon}
            text={generateLinkText(content.getDistributionLinks()!.length)}
            shouldHideText={shouldHideText}
          />
        )}
      </Grid>
      <Grid item xs={isGridView ? 6 : 3}>
        <ResultCardButton
          startIcon={DownloadIcon}
          text="Download"
          shouldHideText={shouldHideText}
        />
      </Grid>
      <Grid item xs={isGridView ? 6 : 3}>
        <ResultCardButton
          startIcon={InfoIcon}
          text="Details"
          shouldHideText={false}
          onClick={onDetail}
        />
      </Grid>
    </Grid>
  );
};

export default ResultCardButtonGroup;
