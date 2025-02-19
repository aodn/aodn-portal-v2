import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import { MODE } from "./CommonDef";
import NaList from "./NaList";
import { Typography } from "@mui/material";

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
  const suggestedCitationItem = useMemo(
    () =>
      suggestedCitation ? (
        <ItemBaseGrid key={suggestedCitation}>
          <ExpandableTextArea text={suggestedCitation} />
        </ItemBaseGrid>
      ) : null,
    [suggestedCitation]
  );

  switch (mode) {
    case MODE.COMPACT:
      return (
        <>
          <Typography padding={1}>
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
