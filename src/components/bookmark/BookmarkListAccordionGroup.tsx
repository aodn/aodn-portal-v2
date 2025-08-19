import { FC, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
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
import rc8Theme from "../../styles/themeRC8";
import { CancelIcon } from "../../assets/icons/download/cancel";

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
  const [items, setItems] = useState<OGCCollection[]>(() => {
    const { items, temporaryItem } = getBookmarkList(store.getState());
    return temporaryItem ? [temporaryItem, ...items] : items;
  });

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
        onDeselectDataset?.();
      },
    [onDeselectDataset]
  );

  const onClearAllBookmarks = useCallback(() => {
    store.dispatch(removeAllItems());
    onDeselectDataset?.();
  }, [onDeselectDataset]);

  const onRemoveFromBookmarkList = useCallback(
    (item: OGCCollection) => {
      const { temporaryItem, expandedItem } = getBookmarkList(store.getState());
      if (item.id === temporaryItem?.id) {
        // If the item is a temporary item, just clear the temporary item
        store.dispatch(setTemporaryItem(undefined));
      } else {
        // Else the item is from bookmarkItems, so remove it from the list
        store.dispatch(removeItem(item.id));
      }
      // If the item is expanded, need to clear the bookmarkExpandedItem
      if (expandedItem?.id === item.id) {
        store.dispatch(setExpandedItem(undefined));
      }
      onDeselectDataset?.();
    },
    [onDeselectDataset]
  );

  // Update accordion group list by listening bookmark items and bookmark temporary item
  useEffect(() => {
    store.dispatch(initializeBookmarkList());

    const handler = (event: BookmarkEvent) => {
      // Here we remove the old temp and add the new temp, this function only calls when
      // a add temp event triggered
      const updateTempInItems = (currentId: string | undefined): void => {
        setItems((items) => {
          // Only one temporary item so remove it first
          const tempRemoved = items.filter((i) => i.id !== currentId);
          return event.value ? [event.value, ...tempRemoved] : tempRemoved;
        });
      };

      switch (event.action) {
        case EVENT_BOOKMARK.INIT:
          setItems(() => {
            const { temporaryItem } = getBookmarkList(store.getState());
            return temporaryItem
              ? [temporaryItem, ...event.value]
              : event.value;
          });
          break;

        case EVENT_BOOKMARK.ADD:
          setItems((items) =>
            items.some((i) => i?.id === event.id)
              ? items
              : [...items, event.value]
          );
          break;

        case EVENT_BOOKMARK.REMOVE:
          setBookmarkTemporaryItem((item) =>
            item?.id === event.id ? undefined : item
          );
          setItems((items) => items?.filter((i) => i.id !== event.id));
          break;

        case EVENT_BOOKMARK.REMOVE_ALL:
          setItems([]);
          setBookmarkTemporaryItem(undefined);
          setBookmarkExpandedItem(undefined);
          break;

        case EVENT_BOOKMARK.TEMP:
          setBookmarkTemporaryItem((current) => {
            updateTempInItems(current?.id);
            return event.value;
          });
          break;

        case EVENT_BOOKMARK.EXPAND:
          setBookmarkExpandedItem(event.value);
          break;
      }
    };

    Object.values(EVENT_BOOKMARK).forEach((event) => on(event, handler));
    return () =>
      Object.values(EVENT_BOOKMARK).forEach((event) => off(event, handler));
  }, []);

  return (
    <>
      {!hideHead && (
        <BookmarkListHead
          bookmarkCount={
            bookmarkTemporaryItem ? items?.length - 1 : items?.length
          }
          onClearAllBookmarks={onClearAllBookmarks}
        />
      )}

      {items.map((item) => (
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
              width="100%"
            >
              <Box
                onMouseEnter={() => setHoverOnButton(true)}
                onMouseLeave={() => setHoverOnButton(false)}
                sx={{ mr: "4px", py: "6px" }}
              >
                <BookmarkButton dataset={item} />
              </Box>

              <Typography
                sx={{
                  ...rc8Theme.typography.body1Medium,
                  color: rc8Theme.palette.text2,
                  fontWeight: 700,
                  py: "6px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.title}
              </Typography>
              <Box display="flex" alignItems="center" height={"90%"}>
                <IconButton
                  onClick={() => onRemoveFromBookmarkList(item)}
                  onMouseEnter={() => setHoverOnButton(true)}
                  onMouseLeave={() => setHoverOnButton(false)}
                >
                  <CancelIcon
                    height={12}
                    width={12}
                    color={rc8Theme.palette.grey700}
                  />
                </IconButton>
              </Box>
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
