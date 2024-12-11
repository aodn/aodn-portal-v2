import { FC, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
import {
  color,
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../styles/constants";
import StyledAccordionDetails from "../common/accordion/StyledAccordionDetails";
import BookmarkListCard, { BookmarkListCardType } from "./BookmarkListCard";
import BookmarkButton from "./BookmarkButton";
import {
  removeItem,
  getBookmarkList,
  setExpandedItem,
  setTemporaryItem,
  on,
  off,
} from "../common/store/bookmarkListReducer";
import store from "../common/store/store";
import {
  BookmarkEvent,
  EVENT_BOOKMARK,
} from "../map/mapbox/controls/menu/Definition";

export interface BookmarkListAccordionGroupBasicType
  extends Partial<BookmarkListCardType> {
  onRemoveAllBookmarks: () => void;
}

interface BookmarkListAccordionGroupProps
  extends BookmarkListAccordionGroupBasicType {}

const BookmarkListAccordionGroup: FC<BookmarkListAccordionGroupProps> = ({
  onRemoveAllBookmarks,
  tabNavigation,
}) => {
  // State to store accordion group list, which is the combination of bookmark items and bookmark temporary item
  // TODO need? seems replaced by bookmarkItem is possible
  const [accordionGroupItems, setAccordionGroupItems] = useState<
    Array<OGCCollection>
  >(getBookmarkList(store.getState()).items);

  // State to store the mouse hover status
  const [hoverOnButton, setHoverOnButton] = useState<boolean>(false);

  const [bookmarkItems, setBookmarkItems] = useState<
    Array<OGCCollection> | undefined
  >(getBookmarkList(store.getState()).items);

  const [bookmarkTemporaryItem, setBookmarkTemporaryItem] = useState<
    OGCCollection | undefined
  >(getBookmarkList(store.getState()).temporaryItem);

  const [bookmarkExpandedItem, setBookmarkExpandedItem] = useState<
    OGCCollection | undefined
  >(getBookmarkList(store.getState()).expandedItem);

  const handleChange = useCallback(
    (item: OGCCollection, hoverOnRemoveButton: boolean) =>
      (_: SyntheticEvent, newExpanded: boolean) => {
        // To prevent clicking on buttons in accordion title area to trigger the onClickAccordion
        if (hoverOnRemoveButton) return;
        store.dispatch(setExpandedItem(newExpanded ? item : undefined));
      },
    []
  );

  const handleClearAllBookmarks = () => {
    setAccordionGroupItems([]);
    onRemoveAllBookmarks && onRemoveAllBookmarks();
  };

  const onRemoveFromBookmarkList = useCallback(
    (item: OGCCollection) => {
      if (item.id === bookmarkTemporaryItem?.id) {
        // If the item is a temporary item, just clear the temporary item
        store.dispatch(setTemporaryItem(undefined));
      } else {
        // Else the item is from bookmarkItems, so remove it from the list
        store.dispatch(removeItem(item.id));
      }
      // If the item is expanded, need to clear the bookmarkExpandedItem
      store.dispatch(
        setExpandedItem(
          bookmarkExpandedItem?.id === item.id
            ? undefined
            : bookmarkExpandedItem
        )
      );
    },
    [bookmarkExpandedItem, bookmarkTemporaryItem?.id]
  );

  // Update accordion group list by listening bookmark items and bookmark temporary item
  useEffect(() => {
    const handler = (event: BookmarkEvent) => {
      if (event.action === EVENT_BOOKMARK.ADD) {
        setBookmarkItems((items) =>
          items ? [event.value, ...items] : [event.value]
        );
        // Only add temporary item if it's not already in items
        setAccordionGroupItems((items) =>
          items.some((i) => i?.id === event.id)
            ? items
            : [event.value, ...items]
        );
      }

      if (event.action === EVENT_BOOKMARK.REMOVE) {
        setBookmarkTemporaryItem((item) =>
          item?.id === event.id ? undefined : item
        );
        setBookmarkItems((items) => items?.filter((i) => i.id !== event.id));
        setAccordionGroupItems((items) =>
          items?.filter((i) => i.id !== event.id)
        );
      }

      if (event.action === EVENT_BOOKMARK.TEMP) {
        const removeTemp = (currentId: string | undefined): void => {
          setAccordionGroupItems((items) => {
            // Only one temporary item so remove it first
            const tempRemoved = items.filter((i) => i.id !== currentId);
            return event.value ? [event.value, ...tempRemoved] : tempRemoved;
          });
        };

        setBookmarkTemporaryItem((current) => {
          removeTemp(current?.id);
          return event.value;
        });
      }

      if (event.action === EVENT_BOOKMARK.EXPAND) {
        setBookmarkExpandedItem(event.value);
      }
    };

    on(EVENT_BOOKMARK.ADD, handler);
    on(EVENT_BOOKMARK.REMOVE, handler);
    on(EVENT_BOOKMARK.EXPAND, handler);
    on(EVENT_BOOKMARK.TEMP, handler);

    return () => {
      off(EVENT_BOOKMARK.ADD, handler);
      off(EVENT_BOOKMARK.REMOVE, handler);
      off(EVENT_BOOKMARK.EXPAND, handler);
      off(EVENT_BOOKMARK.TEMP, handler);
    };
  }, []);

  return (
    <>
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        padding={padding.extraSmall}
        sx={{ backgroundColor: color.blue.darkSemiTransparent }}
      >
        <Typography
          fontSize={fontSize.info}
          color={fontColor.blue.dark}
          fontWeight={fontWeight.bold}
        >
          {bookmarkItems
            ? bookmarkItems.length === 0
              ? "Bookmark List"
              : bookmarkItems.length === 1
                ? "1 Bookmark"
                : `${bookmarkItems.length} Bookmarks`
            : "Bookmark List"}
        </Typography>
        <Button
          sx={{ position: "absolute", right: 0, textTransform: "none" }}
          onClick={handleClearAllBookmarks}
        >
          <Typography fontSize={fontSize.label} color={fontColor.blue.dark}>
            Clear
          </Typography>
        </Button>
      </Box>
      {accordionGroupItems.length > 0 &&
        accordionGroupItems.map((item) => (
          <StyledAccordion
            key={item.id}
            expanded={bookmarkExpandedItem?.id === item.id}
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
                  <BookmarkButton dataset={item} />
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
              <BookmarkListCard dataset={item} tabNavigation={tabNavigation} />
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
    </>
  );
};

export default BookmarkListAccordionGroup;
