import { FC, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
import { color, fontColor, fontSize, fontWeight } from "../../styles/constants";
import StyledAccordionDetails from "../common/accordion/StyledAccordionDetails";
import BookmarkListCard from "./BookmarkListCard";
import BookmarkButton, { BookmarkButtonBasicType } from "./BookmarkButton";

export interface BookmarkListAccordionGroupBasicType
  extends Partial<BookmarkButtonBasicType> {
  items: OGCCollection[] | undefined;
  temporaryItem: OGCCollection | undefined;
  expandedItem: OGCCollection | undefined;
  onClickAccordion: (item: OGCCollection | undefined) => void;
  onRemoveFromBookmarkList: (item: OGCCollection) => void;
}

interface BookmarkListAccordionGroupProps
  extends BookmarkListAccordionGroupBasicType {}

const BookmarkListAccordionGroup: FC<BookmarkListAccordionGroupProps> = ({
  items,
  temporaryItem,
  expandedItem,
  onClickAccordion,
  onRemoveFromBookmarkList,
  checkIsBookmarked,
  onClickBookmark,
}) => {
  // State to store accordion group list, which is the combination of bookmark items and bookmark temporary item
  const [accordionGroupItems, setAccordionGroupItems] = useState<
    Array<OGCCollection>
  >([]);

  // State to store the mouse hover status
  const [hoverOnButton, setHoverOnButton] = useState<boolean>(false);

  const handleChange = useCallback(
    (item: OGCCollection, hoverOnRemoveButton: boolean) =>
      (_: SyntheticEvent, newExpanded: boolean) => {
        // To prevent clicking on buttons in accordion title area to trigger the onClickAccordion
        if (hoverOnRemoveButton) return;
        onClickAccordion(newExpanded ? item : undefined);
      },
    [onClickAccordion]
  );

  // Update accordion group list by listening bookmark items and bookmark temporary item
  useEffect(() => {
    // If no items and no temporary item, just return empty array
    if (!items?.length && !temporaryItem) {
      setAccordionGroupItems([]);
      return;
    }

    // If we have a temporary item, check if it needs to be added
    if (temporaryItem) {
      const existingIds = new Set(items?.map((item) => item.id) || []);
      // Only add temporary item if it's not already in items
      setAccordionGroupItems(
        !existingIds.has(temporaryItem.id)
          ? [temporaryItem, ...(items || [])]
          : [...(items || [])]
      );
      return;
    }

    // If we only have items, just use those
    setAccordionGroupItems([...(items || [])]);
  }, [items, temporaryItem]);

  return (
    <>
      {accordionGroupItems.length > 0 &&
        accordionGroupItems.map((item) => (
          <StyledAccordion
            key={item.id}
            expanded={expandedItem?.id === item.id}
            onChange={handleChange(item, hoverOnButton)}
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
                <Box
                  onMouseEnter={() => setHoverOnButton(true)}
                  onMouseLeave={() => setHoverOnButton(false)}
                >
                  <BookmarkButton
                    dataset={item}
                    onClickBookmark={onClickBookmark}
                    checkIsBookmarked={checkIsBookmarked}
                  />
                </Box>

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
                  onClick={() => onRemoveFromBookmarkList(item)}
                  onMouseEnter={() => setHoverOnButton(true)}
                  onMouseLeave={() => setHoverOnButton(false)}
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
