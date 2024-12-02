import {
  Dispatch,
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
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
import { insertItemToBookmarkList } from "../map/mapbox/controls/menu/BookmarkListMenu";

interface BookmarkListAccordionGroupProps {
  items: Array<OGCCollection> | undefined;
  temporaryItem: OGCCollection | undefined;
  onRemoveItem: (item: OGCCollection) => void;
  onClickAccordion: (uuid: string | undefined) => void;
  expandedItem: OGCCollection | undefined;
  setExpandedItem: Dispatch<React.SetStateAction<OGCCollection | undefined>>;
}

const BookmarkListAccordionGroup: FC<BookmarkListAccordionGroupProps> = ({
  items,
  temporaryItem,
  onRemoveItem,
  onClickAccordion,
  expandedItem,
  setExpandedItem,
}) => {
  const [accordionGroupItems, setAccordionGroupItems] = useState<
    Array<OGCCollection>
  >([]);

  const [hoverOnButton, setHoverOnButton] = useState<boolean>(false);

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

  const handleAddBookmark = useCallback((item: OGCCollection) => {
    insertItemToBookmarkList(item);
  }, []);

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
                <BookmarkButton dataset={item} onClick={handleAddBookmark} />
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
