import { Dispatch, FC, SyntheticEvent, useCallback, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
import { color, fontColor, fontSize, fontWeight } from "../../styles/constants";
import StyledAccordionDetails from "../common/accordion/StyledAccordionDetails";
import BookmarkListCard from "./BookmarkListCard";
import BookmarkButton from "./BookmarkButton";

interface BookmarkListAccordionGroupProps {
  items: Array<OGCCollection> | undefined;
  onRemoveItem: (item: OGCCollection) => void;
  onClickAccordion: (uuid: string | undefined) => void;
  expandedItem: OGCCollection | undefined;
  setExpandedItem: Dispatch<React.SetStateAction<OGCCollection | undefined>>;
}

const BookmarkListAccordionGroup: FC<BookmarkListAccordionGroupProps> = ({
  items,
  onRemoveItem,
  onClickAccordion,
  expandedItem,
  setExpandedItem,
}) => {
  const [hoverOnRemoveButton, setHoverOnRemoveButton] =
    useState<boolean>(false);

  // When click on an other accordion (if not click on the remove button) will collapse the current one and expand the click one
  const handleChange = useCallback(
    (item: OGCCollection, hoverOnRemoveButton: boolean) =>
      (_: SyntheticEvent, newExpanded: boolean) => {
        if (hoverOnRemoveButton) return;
        setExpandedItem(newExpanded ? item : undefined);
        onClickAccordion(newExpanded ? item.id : undefined);
      },
    [onClickAccordion, setExpandedItem]
  );

  const handleRemove = useCallback(
    (item: OGCCollection) => {
      // Keep the current expansion status when remove the other un-expanded pinned datasets
      setExpandedItem((prev) => (prev?.id === item.id ? items?.[0] : prev));
      onRemoveItem && onRemoveItem(item);
    },
    [setExpandedItem, onRemoveItem, items]
  );

  if (!items) return;

  return (
    <>
      {items.map((item) => (
        <StyledAccordion
          key={item.id}
          expanded={expandedItem?.id === item.id}
          onChange={handleChange(item, hoverOnRemoveButton)}
        >
          <StyledAccordionSummary>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              flexWrap="nowrap"
              alignItems="center"
              width="100%"
            >
              <BookmarkButton />
              <Typography
                color={fontColor.gray.dark}
                fontSize={fontSize.label}
                fontWeight={fontWeight.bold}
                sx={{
                  padding: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.title}
              </Typography>
              <Button
                sx={{
                  minWidth: "15px",
                  maxWidth: "15px",
                  color: color.gray.dark,
                  fontSize: fontSize.icon,
                  fontWeight: fontWeight.bold,
                  " &:hover": {
                    color: color.blue.dark,
                    fontSize: fontSize.info,
                  },
                }}
                onClick={() => handleRemove(item)}
                onMouseEnter={() => setHoverOnRemoveButton(true)}
                onMouseLeave={() => setHoverOnRemoveButton(false)}
              >
                X
              </Button>
            </Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BookmarkListCard collection={item} />
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </>
  );
};

export default BookmarkListAccordionGroup;
