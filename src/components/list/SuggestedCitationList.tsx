import React, { useCallback, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import { MODE } from "./CommonDef";
import NaList from "./NaList";
import { Stack, Typography } from "@mui/material";
import CopyButton from "../common/buttons/CopyButton";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";
import rc8Theme from "../../styles/themeRC8";
import { trackCustomEvent } from "../../analytics/customEventTracker";
import { CustomEvent } from "../../analytics/constants";

interface SuggestedCitationListProps {
  suggestedCitation: string;
  title?: string;
  selected?: boolean;
  mode?: MODE;
}

const SuggestedCitationList: React.FC<SuggestedCitationListProps> = ({
  suggestedCitation,
  title = "Suggested Citation",
  selected = false,
  mode,
}) => {
  const { checkIfCopied, copyToClipboard } = useDetailPageContext();

  const isCopied = useMemo(
    () => checkIfCopied(suggestedCitation),
    [checkIfCopied, suggestedCitation]
  );
  const handleCopy = useCallback(async () => {
    await copyToClipboard(suggestedCitation);
    // Track copy citation button click
    trackCustomEvent(CustomEvent.COPY_CITATION_CLICK);
  }, [copyToClipboard, suggestedCitation]);

  const suggestedCitationItem = useMemo(
    () =>
      suggestedCitation ? (
        <ItemBaseGrid
          key={suggestedCitation}
          disableHover={mode === MODE.COMPACT}
        >
          <Stack direction="column" alignItems="center">
            <ExpandableTextArea text={suggestedCitation} />
            <CopyButton
              handleClick={handleCopy}
              hasBeenCopied={isCopied}
              copyText={suggestedCitation}
              copyButtonConfig={{
                textBeforeCopy: "Copy Citation",
                textAfterCopy: "Citation Copied",
              }}
            />
          </Stack>
        </ItemBaseGrid>
      ) : null,
    [handleCopy, isCopied, suggestedCitation, mode]
  );

  switch (mode) {
    case MODE.COMPACT:
      return (
        <>
          <Typography
            variant="title1Medium"
            sx={{ color: rc8Theme.palette.text1 }}
          >
            {title}
            {!suggestedCitation ? (
              <NaList title={title ? title : ""} />
            ) : (
              suggestedCitationItem
            )}
          </Typography>
        </>
      );

    case MODE.NORMAL:
    default:
      return (
        <ExpandableList
          title={title}
          selected={selected}
          childrenList={suggestedCitation ? [suggestedCitationItem] : []}
        />
      );
  }
};

export default SuggestedCitationList;
