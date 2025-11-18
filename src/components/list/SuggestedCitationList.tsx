import React, { useCallback, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import { MODE } from "./CommonDef";
import NaList from "./NaList";
import { Stack, Typography } from "@mui/material";
import { CopyButtonConfig } from "../common/buttons/CopyButton";
import rc8Theme from "../../styles/themeRC8";
import { AnalyticsEvent } from "../../analytics/analyticsEvents";
import { trackCustomEvent } from "../../analytics/customEventTracker";

interface SuggestedCitationListProps extends CopyButtonConfig {
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
  copyButtonConfig,
}) => {
  const handleCopyWithTracking = useCallback(
    async (text: string) => {
      if (copyButtonConfig && copyButtonConfig.copyToClipboard) {
        await copyButtonConfig.copyToClipboard(text);
        // Track copy citation button click
        trackCustomEvent(AnalyticsEvent.COPY_CITATION_CLICK);
      }
    },
    [copyButtonConfig]
  );

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
                ...copyButtonConfig,
                copyToClipboard: handleCopyWithTracking,
              }}
            />
          </Stack>
        </ItemBaseGrid>
      ) : null,
    [suggestedCitation, mode, copyButtonConfig, handleCopyWithTracking]
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
