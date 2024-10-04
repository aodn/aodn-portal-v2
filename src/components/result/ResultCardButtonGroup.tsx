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
import { color } from "../../styles/constants";
import useTabNavigation from "../../hooks/useTabNavigation";
import { pageDefault } from "../common/constants";
import { useNavigate } from "react-router-dom";

interface ResultCardButtonGroupProps {
  content: OGCCollection;
  onDetail?: () => void;
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

const ResultCardButtonGroup: FC<ResultCardButtonGroupProps> = ({
  content,
  isGridView,
  shouldHideText = false,
}) => {
  const goToDetailPanel = useTabNavigation();
  const navigate = useNavigate();
  const onDetail = useCallback(
    (uuid: string) => {
      const searchParams = new URLSearchParams();
      searchParams.append("uuid", uuid);
      navigate(pageDefault.details + "?" + searchParams.toString());
    },
    [navigate]
  );

  const ButtonContainer: FC<ButtonContainerProps> = ({ children, sx }) => (
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

  const links = content.getDistributionLinks();

  if (!content) return;
  return (
    <Grid container arial-label="result-list-card-buttons">
      <ButtonContainer>
        {renderStatusButton(shouldHideText, content)}
      </ButtonContainer>
      <ButtonContainer>
        {links && (
          <ResultCardButton
            startIcon={LinkIcon}
            text={generateLinkText(links.length)}
            shouldHideText={shouldHideText}
            onClick={() => goToDetailPanel(content.id, "links")}
            resultCardButtonConfig={{
              color: links.length > 0 ? color.blue.dark : color.gray.light,
            }}
            disable={links.length === 0}
          />
        )}
      </ButtonContainer>
      <ButtonContainer>
        <ResultCardButton
          startIcon={DownloadIcon}
          text="Download"
          shouldHideText={shouldHideText}
          onClick={() => goToDetailPanel(content.id, "download-section")}
        />
      </ButtonContainer>
      <ButtonContainer>
        <ResultCardButton
          startIcon={InfoIcon}
          text="More details ..."
          shouldHideText={shouldHideText}
          onClick={() => onDetail(content.id)}
        />
      </ButtonContainer>
    </Grid>
  );
};

export default ResultCardButtonGroup;
