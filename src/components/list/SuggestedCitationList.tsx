import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import { MODE } from "./CommonDef";
import NaList from "./NaList";
import { Stack, Typography } from "@mui/material";
import rc8Theme from "../../styles/themeRC8";
import { AnalyticsEvent } from "../../analytics/analyticsEvents";
import { trackCustomEvent } from "../../analytics/customEventTracker";

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
  const suggestedCitationItem = useMemo(
    () =>
      suggestedCitation ? (
        <ItemBaseGrid
          key={suggestedCitation}
          disableHover={mode === MODE.COMPACT}
        >
          <Stack direction="column" alignItems="center" sx={{ pb: "8px" }}>
            <ExpandableTextArea
              text={suggestedCitation}
              isCopyable
              copyButtonConfig={{
                // Track copy citation button click
                onCopy: () =>
                  trackCustomEvent(AnalyticsEvent.COPY_CITATION_CLICK),
              }}
              // Set to false to always show copy button
              showCopyOnHover={false}
            />
          </Stack>
        </ItemBaseGrid>
      ) : null,
    [suggestedCitation, mode]
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
