import React, { FC, useCallback, useEffect, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton, Tooltip } from "@mui/material";
import { color, gap } from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { fetchResultByUuidNoStore } from "../common/store/searchReducer";
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
import { checkExtent } from "../../utils/GeoJsonUtils";

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

  const onClickBookmark = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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

        // Check if the item has a valid extent
        const hasValidExtent = checkExtent(item);
        if (hasValidExtent) {
          // If the item has a valid extent, add it directly
          store.dispatch(addItem(item));
        } else {
          // If the item does not have a valid extent, fetch it first
          store
            .dispatch(fetchResultByUuidNoStore(item.id))
            .unwrap()
            .then((res: OGCCollection) => {
              store.dispatch(addItem(res));
            });
        }
      }
      setIsBookmarked(!isBookmarked);
    },
    [isBookmarked]
  );

  useEffect(() => {
    const handler = (event: BookmarkEvent) => {
      if (
        event.id === dataset?.id ||
        event.action === EVENT_BOOKMARK.REMOVE_ALL
      ) {
        setIsBookmarked(event.action === EVENT_BOOKMARK.ADD);
      }
    };

    on(EVENT_BOOKMARK.ADD, handler);
    on(EVENT_BOOKMARK.REMOVE, handler);
    on(EVENT_BOOKMARK.REMOVE_ALL, handler);

    return () => {
      off(EVENT_BOOKMARK.ADD, handler);
      off(EVENT_BOOKMARK.REMOVE, handler);
      off(EVENT_BOOKMARK.REMOVE_ALL, handler);
    };
  }, [dataset?.id]);

  return (
    dataset && (
      <Tooltip
        title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        placement="top"
      >
        <IconButton
          onClick={(event) => onClickBookmark(event, dataset)}
          sx={{
            padding: gap.sm,
            ":hover": {
              scale: "105%",
            },
          }}
          data-testid={`${dataTestId}-iconbutton`}
        >
          {isBookmarked ? (
            <BookmarkIcon
              sx={{ color: color.brightBlue.dark }}
              data-testid={`${dataTestId}-bookmarkicon`}
            />
          ) : (
            <BookmarkBorderIcon
              sx={{
                color: color.brightBlue.dark,
                fontSize: "26px",
              }}
              data-testid={`${dataTestId}-bookmarkbordericon`}
            />
          )}
        </IconButton>
      </Tooltip>
    )
  );
};

export default BookmarkButton;
