import {
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Box, Button, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
import { color, fontColor, fontSize, fontWeight } from "../../styles/constants";
import StyledAccordionDetails from "../common/accordion/StyledAccordionDetails";
import BookmarkListCard from "./BookmarkListCard";
import BookmarkButton from "./BookmarkButton";
import {
  checkIsBookmarked,
  insertItemToBookmarkList,
} from "../map/mapbox/controls/menu/BookmarkListMenu";

interface BookmarkListAccordionGroupProps {
  items: Array<OGCCollection> | undefined;
  temporaryItem: OGCCollection | undefined;
  expandedItem: OGCCollection | undefined;
  onRemoveItem: (item: OGCCollection) => void;
  setExpandedItem: Dispatch<React.SetStateAction<OGCCollection | undefined>>;
  setSelectedUuids: (uuids: SetStateAction<string[]>) => void;
}

const BookmarkListAccordionGroup: FC<BookmarkListAccordionGroupProps> = ({
  items,
  temporaryItem,
  expandedItem,
  onRemoveItem,
  setExpandedItem,
  setSelectedUuids,
}) => {
  // State to store accordion group list, which is the combination of temporary item and (bookmark list)items
  const [accordionGroupItems, setAccordionGroupItems] = useState<
    Array<OGCCollection>
  >([]);

  // State to store the mouse hover status - if hovering on any button clicking will not expand/collapse an accordion
  const [hoverOnButton, setHoverOnButton] = useState<boolean>(false);

  // When click on an other accordion (if not click on the buttons) will collapse the current one and expand the click one
  const handleChange = useCallback(
    (item: OGCCollection, hoverOnRemoveButton: boolean) =>
      (_: SyntheticEvent, newExpanded: boolean) => {
        if (hoverOnRemoveButton) return;
        setExpandedItem(newExpanded ? item : undefined);
        setSelectedUuids(newExpanded ? [item.id] : []);
      },
    [setExpandedItem, setSelectedUuids]
  );

  const handleRemove = useCallback(
    (item: OGCCollection) => {
      // Keep the current expansion status when remove the other un-expanded pinned datasets
      setExpandedItem((prev) => (prev?.id === item.id ? undefined : prev));
      onRemoveItem && onRemoveItem(item);
    },
    [setExpandedItem, onRemoveItem]
  );

  useEffect(() => {
    setAccordionGroupItems(() => {
      if (items) {
        // Create a Set of existing IDs to check for duplicates
        const existingIds = new Set(items.map((item) => item.id));

        if (temporaryItem) {
          // If we have a temporary item, add it at the start only if it's not in items
          if (!existingIds.has(temporaryItem.id)) {
            return [temporaryItem, ...items];
          }
          return [...items];
        } else {
          // If no temporary item, just return items
          return [...items];
        }
      } else if (temporaryItem) {
        // If we only have a temporary item and no items
        return [temporaryItem];
      }
      // If no items and no temporary item
      return [];
    });
  }, [items, temporaryItem]);

  return (
    <>
      {accordionGroupItems.map((item) => (
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
                  onClick={() => insertItemToBookmarkList(item)}
                  // bookmarked={async () => await checkIsBookmarked(item.id)}
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
                onClick={() => handleRemove(item)}
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
