import { FC, ReactNode, useCallback } from "react";
import { Grid, SxProps } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import ResultCardButton from "../common/buttons/ResultCardButton";

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

interface ButtonContainerProps {
  children: ReactNode;
  sx?: SxProps;
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
  onDetail,
  isGridView,
  shouldHideText = false,
}) => {
  const ButtonContainer: FC<ButtonContainerProps> = ({ children, sx }) => (
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
      <ButtonContainer> {renderStatusButton(content)}</ButtonContainer>
      <ButtonContainer>
        {content.getDistributionLinks() && (
          <ResultCardButton
            startIcon={LinkIcon}
            text={generateLinkText(content.getDistributionLinks()!.length)}
            shouldHideText={shouldHideText}
          />
        )}
      </ButtonContainer>
      <ButtonContainer>
        <ResultCardButton
          startIcon={DownloadIcon}
          text="Download"
          shouldHideText={shouldHideText}
        />
      </ButtonContainer>
      <ButtonContainer>
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
