import React, { FC, useCallback, useEffect, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton, Tooltip } from "@mui/material";
import { color, gap } from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import {
  addItem,
  checkIsBookmarked,
  getBookmarkList,
  off,
  on,
  removeItem,
  setExpandedItem,
  setTemporaryItem,
} from "../common/store/bookmarkListReducer";
import store from "../common/store/store";
import {
  BookmarkEvent,
  EVENT_BOOKMARK,
} from "../map/mapbox/controls/menu/Definition";

export interface BookmarkButtonProps {
  dataset?: OGCCollection;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({ dataset = undefined }) => {
  const {
    items: bookmarkItems,
    expandedItem: bookmarkExpandedItem,
    temporaryItem: bookmarkTemporaryItem,
  } = getBookmarkList(store.getState());
  const [isBookmarked, setIsBookmarked] = useState<boolean | undefined>(
    dataset && checkIsBookmarked(store.getState(), dataset.id)
  );

  const onClickBookmark = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      item: OGCCollection
    ) => {
      if (isBookmarked) {
        // If item is already bookmarked, remove it
        store.dispatch(removeItem(item.id));
        // If it's the expanded item, clear the expansion and selected uuid
        if (bookmarkExpandedItem?.id === item.id) {
          store.dispatch(setExpandedItem(undefined));
        }
        setIsBookmarked(false);
      } else {
        if (bookmarkTemporaryItem && bookmarkTemporaryItem.id === item.id) {
          // If bookmark a temporary item, should clear temporaryItem then add to bookmark list
          store.dispatch(setTemporaryItem(undefined));
          store.dispatch(addItem(item));
        } else {
          // Else add to bookmark list
          store.dispatch(addItem(item));
        }
        setIsBookmarked(true);
      }
    },
    [isBookmarked, bookmarkTemporaryItem, bookmarkExpandedItem]
  );

  useEffect(() => {
    if (dataset && bookmarkItems) {
      setIsBookmarked(checkIsBookmarked(store.getState(), dataset.id));
    }
  }, [bookmarkItems, dataset]);

  useEffect(() => {
    const handler = (event: BookmarkEvent) => {
      if (event.id === dataset?.id) {
        if (event.action === EVENT_BOOKMARK.ADD) {
          setIsBookmarked(true);
        } else if (event.action === EVENT_BOOKMARK.REMOVE)
          setIsBookmarked(false);
      }
    };

    on(EVENT_BOOKMARK.ADD, handler);
    on(EVENT_BOOKMARK.REMOVE, handler);

    return () => {
      off(EVENT_BOOKMARK.ADD, handler);
      off(EVENT_BOOKMARK.REMOVE, handler);
    };
  }, [dataset?.id]);

  return (
    <Tooltip
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      placement="top"
    >
      <IconButton
        onClick={(event) => dataset && onClickBookmark(event, dataset)}
        sx={{
          padding: gap.sm,
          ":hover": {
            scale: "105%",
          },
        }}
      >
        {isBookmarked ? (
          <BookmarkIcon sx={{ color: color.brightBlue.dark }} />
        ) : (
          <BookmarkBorderIcon
            sx={{
              color: color.brightBlue.dark,
              fontSize: "26px",
            }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default BookmarkButton;
