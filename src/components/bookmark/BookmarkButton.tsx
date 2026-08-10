import React, { FC, useCallback, useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  BookmarkFilledIcon,
  BookmarkOutlinedIcon,
} from "@/assets/icons/result/bookmark";
import { portalTheme } from "@/styles";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import {
  addItem,
  checkIsBookmarked,
  getBookmarkList,
  off,
  on,
  removeItem,
  setExpandedItem,
  setTemporaryItem,
} from "@/app/store/bookmarkListReducer";
import store from "@/app/store/store";
import {
  BookmarkEvent,
  EVENT_BOOKMARK,
} from "../map/mapbox/controls/menu/Definition";

const BOOKMARK_ICON_SIZE = 19;

export interface BookmarkButtonProps {
  dataset?: OGCCollection;
  dataTestId?: string;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({
  dataset = undefined,
  dataTestId = dataset ? dataset.id : "bookmarkbutton",
}) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() =>
    dataset ? checkIsBookmarked(store.getState(), dataset.id) : false
  );

  const [prevDatasetId, setPrevDatasetId] = useState<string | undefined>(
    dataset?.id
  );

  if (dataset?.id !== prevDatasetId) {
    setPrevDatasetId(dataset?.id);
    setIsBookmarked(
      dataset ? checkIsBookmarked(store.getState(), dataset.id) : false
    );
  }

  const onClickBookmark = useCallback(
    (
      _event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      item: OGCCollection
    ) => {
      const { expandedItem, temporaryItem } = getBookmarkList(store.getState());

      if (isBookmarked) {
        // If item is already bookmarked, remove it
        store.dispatch(removeItem(item.id));
        // If it's the expanded item, clear the expansion and selected uuid
        if (expandedItem?.id === item.id) {
          store.dispatch(setExpandedItem(undefined));
        }
      } else {
        if (temporaryItem && temporaryItem.id === item.id) {
          // If bookmark a temporary item, should clear temporaryItem then add to bookmark list
          store.dispatch(setTemporaryItem(undefined));
        }

        store.dispatch(addItem(item));
      }
      setIsBookmarked(!isBookmarked);
    },
    [isBookmarked]
  );

  useEffect(() => {
    if (!dataset) return;

    const handler = (event: BookmarkEvent) => {
      if (
        event.id === dataset.id ||
        event.action === EVENT_BOOKMARK.REMOVE_ALL
      ) {
        setIsBookmarked(event.action === EVENT_BOOKMARK.ADD);
      }
    };

    const initHandler = () => {
      const bookmarkStatus = checkIsBookmarked(store.getState(), dataset.id);
      setIsBookmarked(bookmarkStatus);
    };

    on(EVENT_BOOKMARK.ADD, handler);
    on(EVENT_BOOKMARK.REMOVE, handler);
    on(EVENT_BOOKMARK.REMOVE_ALL, handler);
    on(EVENT_BOOKMARK.INIT, initHandler);

    return () => {
      off(EVENT_BOOKMARK.ADD, handler);
      off(EVENT_BOOKMARK.REMOVE, handler);
      off(EVENT_BOOKMARK.REMOVE_ALL, handler);
      off(EVENT_BOOKMARK.INIT, initHandler);
    };
  }, [dataset]);

  return (
    dataset && (
      <Tooltip
        title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        placement="top"
      >
        <IconButton
          onClick={(event) => onClickBookmark(event, dataset)}
          sx={{
            padding: 0,
            alignSelf: "flex-start",
            ":hover": {
              scale: "105%",
            },
          }}
          data-testid={`${dataTestId}-iconbutton`}
        >
          {isBookmarked ? (
            <BookmarkFilledIcon
              color={portalTheme.palette.primary1}
              width={BOOKMARK_ICON_SIZE}
              height={BOOKMARK_ICON_SIZE}
              data-testid={`${dataTestId}-bookmarkicon`}
            />
          ) : (
            <BookmarkOutlinedIcon
              color={portalTheme.palette.primary1}
              width={BOOKMARK_ICON_SIZE}
              height={BOOKMARK_ICON_SIZE}
              data-testid={`${dataTestId}-bookmarkbordericon`}
            />
          )}
        </IconButton>
      </Tooltip>
    )
  );
};

export default BookmarkButton;
