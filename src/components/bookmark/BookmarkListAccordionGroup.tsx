import { FC, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
import { color, fontColor, fontSize, fontWeight } from "../../styles/constants";
import StyledAccordionDetails from "../common/accordion/StyledAccordionDetails";
import BookmarkListCard from "./BookmarkListCard";
import BookmarkButton from "./BookmarkButton";
import {
  removeItem,
  getBookmarkList,
  setExpandedItem,
  setTemporaryItem,
  on,
  off,
  removeAllItems,
  initializeBookmarkList,
} from "../common/store/bookmarkListReducer";
import store from "../common/store/store";
import {
  BookmarkEvent,
  EVENT_BOOKMARK,
} from "../map/mapbox/controls/menu/Definition";
import BookmarkListHead from "./BookmarkListHead";
import { TabNavigation } from "../../hooks/useTabNavigation";

export interface BookmarkListAccordionGroupBasicType {
  onDeselectDataset?: () => void;
  tabNavigation?: TabNavigation;
  hideHead?: boolean;
}

interface BookmarkListAccordionGroupProps
  extends BookmarkListAccordionGroupBasicType {}

const BookmarkListAccordionGroup: FC<BookmarkListAccordionGroupProps> = ({
  onDeselectDataset,
  tabNavigation,
  hideHead = false,
}) => {
  const state = getBookmarkList(store.getState());

  // State to store accordion group list, which is the combination of bookmark items and bookmark temporary item
  const [accordionGroupItems, setAccordionGroupItems] = useState<
    Array<OGCCollection>
  >(state.items);

  const [bookmarkItems, setBookmarkItems] = useState<
    Array<OGCCollection> | undefined
  >(state.items);

  const [bookmarkTemporaryItem, setBookmarkTemporaryItem] = useState<
    OGCCollection | undefined
  >(state.temporaryItem);

  const [bookmarkExpandedItem, setBookmarkExpandedItem] = useState<
    OGCCollection | undefined
  >(state.expandedItem);

  // State to store the mouse hover status
  const [hoverOnButton, setHoverOnButton] = useState<boolean>(false);

  const handleChange = useCallback(
    (item: OGCCollection, hoverOnRemoveButton: boolean) =>
      (_: SyntheticEvent, newExpanded: boolean) => {
        // To prevent clicking on buttons in accordion title area to trigger the onClickAccordion
        if (hoverOnRemoveButton) return;
        store.dispatch(setExpandedItem(newExpanded ? item : undefined));
        onDeselectDataset && onDeselectDataset();
      },
    [onDeselectDataset]
  );

  const onClearAllBookmarks = () => {
    store.dispatch(removeAllItems());
    onDeselectDataset && onDeselectDataset();
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
      onDeselectDataset && onDeselectDataset();
    },
    [bookmarkExpandedItem, bookmarkTemporaryItem?.id, onDeselectDataset]
  );

  // Initialize bookmark list with local storage
  useEffect(() => {
    store.dispatch(initializeBookmarkList());
  }, []);

  // Update accordion group list by listening bookmark items and bookmark temporary item
  useEffect(() => {
    const handler = (event: BookmarkEvent) => {
      if (event.action === EVENT_BOOKMARK.INIT) {
        setBookmarkItems(event.value);
        setAccordionGroupItems(() => {
          if (state.temporaryItem) {
            return [state.temporaryItem, ...event.value];
          }
          return event.value;
        });
      }

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

      if (event.action === EVENT_BOOKMARK.REMOVE_ALL) {
        setBookmarkItems([]);
        setAccordionGroupItems([]);
        setBookmarkTemporaryItem(undefined);
        setBookmarkExpandedItem(undefined);
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

    on(EVENT_BOOKMARK.INIT, handler);
    on(EVENT_BOOKMARK.ADD, handler);
    on(EVENT_BOOKMARK.REMOVE, handler);
    on(EVENT_BOOKMARK.REMOVE_ALL, handler);
    on(EVENT_BOOKMARK.EXPAND, handler);
    on(EVENT_BOOKMARK.TEMP, handler);

    return () => {
      off(EVENT_BOOKMARK.INIT, handler);
      off(EVENT_BOOKMARK.ADD, handler);
      off(EVENT_BOOKMARK.REMOVE, handler);
      off(EVENT_BOOKMARK.REMOVE_ALL, handler);
      off(EVENT_BOOKMARK.EXPAND, handler);
      off(EVENT_BOOKMARK.TEMP, handler);
    };
  }, [state.temporaryItem]);

  return (
    <>
      {!hideHead && (
        <BookmarkListHead
          bookmarkCount={bookmarkItems?.length}
          onClearAllBookmarks={onClearAllBookmarks}
        />
      )}

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
