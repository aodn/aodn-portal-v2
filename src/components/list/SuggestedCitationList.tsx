import React, { useCallback, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import { MODE } from "./CommonDef";
import NaList from "./NaList";
import { Stack, Typography } from "@mui/material";
import { fontWeight } from "../../styles/constants";
import CopyButton from "../common/buttons/CopyButton";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";

interface SuggestedCitationListProps {
  suggestedCitation: string;
  title?: string;
  mode?: MODE;
}

const SuggestedCitationList: React.FC<SuggestedCitationListProps> = ({
  suggestedCitation,
  title = "Suggested Citation",
  mode,
}) => {
  const { checkIfCopied, copyToClipboard } = useDetailPageContext();

  const isCopied = useMemo(
    () => checkIfCopied(suggestedCitation),
    [checkIfCopied, suggestedCitation]
  );
  const handleCopy = useCallback(async () => {
    await copyToClipboard(suggestedCitation);
  }, [copyToClipboard, suggestedCitation]);

  const suggestedCitationItem = useMemo(
    () =>
      suggestedCitation ? (
        <ItemBaseGrid key={suggestedCitation}>
          <Stack direction="column" alignItems="center" gap={1}>
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
    [handleCopy, isCopied, suggestedCitation]
  );

  switch (mode) {
    case MODE.COMPACT:
      return (
        <>
          <Typography padding={1} fontWeight={fontWeight.bold}>
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
          childrenList={suggestedCitation ? [suggestedCitationItem] : []}
        />
      );
  }
};

export default SuggestedCitationList;
