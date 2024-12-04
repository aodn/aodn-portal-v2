import {
  useEffect,
  useState,
  useCallback,
  useRef,
  FC,
  SetStateAction,
} from "react";
import { ControlProps, MenuClickedEvent } from "./Definition";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { Box, IconButton, Popper } from "@mui/material";
import { OGCCollection } from "../../../../common/store/OGCCollectionDefinitions";
import { borderRadius } from "../../../../../styles/constants";
import EventEmitter from "events";
import { EVENT_MENU_CLICKED, eventEmitter } from "./MenuControl";
import BookmarkListAccordionGroup from "../../../../bookmark/BookmarkListAccordionGroup";
import { BOOKMARK_LIST_WIDTH } from "../../../../result/constants";

interface BookmarkListMenuProps extends ControlProps {
  items?: Array<OGCCollection> | undefined;
  setSelectedUuids?: (uuids: SetStateAction<string[]>) => void;
}

interface ItemAddEvent {
  event: MouseEvent;
  component: OGCCollection;
}

interface ItemCheckEvent {
  event: MouseEvent;
  uuid: string;
  callback: (exists: boolean) => void; // Add callback to receive result
}

const EVENT_ADD_ITEM = "add-item";
const EVENT_ADD_TEMPORARY_ITEM = "add-temporary-item";
const EVENT_ACCORDION_COLLAPSE = "accordion-collapse";
const EVENT_CHECK_BOOKMARK = "check-bookmark";

// Do not expose it directly, use function to expose it
const internalEventLoop: EventEmitter = new EventEmitter();

const insertTemporaryItemToBookmarkList = (item: OGCCollection): void => {
  internalEventLoop.emit(EVENT_ADD_TEMPORARY_ITEM, {
    event: new MouseEvent(EVENT_ADD_TEMPORARY_ITEM),
    component: item,
  });
};

const insertItemToBookmarkList = (item: OGCCollection): void => {
  internalEventLoop.emit(EVENT_ADD_ITEM, {
    event: new MouseEvent(EVENT_ADD_ITEM),
    component: item,
  });
};

const collapseAllAccordions = (): void => {
  internalEventLoop.emit(EVENT_ACCORDION_COLLAPSE);
};

const checkIsBookmarked = (
  uuid: string,
  callback: (exists: boolean) => void
): void => {
  internalEventLoop.emit(EVENT_CHECK_BOOKMARK, {
    event: new MouseEvent(EVENT_CHECK_BOOKMARK),
    uuid,
    callback, // Pass the callback in the event
  });
};

const BookmarkListMenu: FC<BookmarkListMenuProps> = ({
  setSelectedUuids = () => {},
}) => {
  const anchorRef = useRef(null);
  // State to store the popup open status
  const [open, setOpen] = useState<boolean>(true);
  // State to store bookmark list items
  const [items, setItems] = useState<Array<OGCCollection> | undefined>(
    undefined
  );
  // State to store a temporary clicked dataset
  const [temporaryItem, setTemporaryItem] = useState<OGCCollection | undefined>(
    undefined
  );
  // State to store the item expanded
  const [expandedItem, setExpandedItem] = useState<OGCCollection | undefined>(
    undefined
  );

  console.log("items", items);
  console.log("temporaryItem", temporaryItem);
  console.log("expandedItem", expandedItem);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const onRemoveItem = useCallback(
    (item: OGCCollection) => {
      setItems((items) => items?.filter((c) => c.id !== item.id));
      setTemporaryItem((prevItem) =>
        prevItem?.id === item.id ? undefined : prevItem
      );
      // If the removed uuid is the selected uuid, need to set selected uuids to []
      setSelectedUuids((prevUuids) => {
        if (prevUuids[0] && prevUuids[0] === item.id) {
          return [];
        } else {
          return prevUuids;
        }
      });
    },
    [setSelectedUuids]
  );

  useEffect(() => {
    // Handle event when other control clicked, this component should close the menu
    const handleClickEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== BookmarkListMenu) {
        setOpen(false);
      }
    };

    const handleAddTemporaryItem = (event: ItemAddEvent) => {
      const newItem = event.component;

      // Check if item exists in current items array
      const existingItem = items?.find((item) => item.id === newItem.id);

      if (existingItem) {
        // If item exists, just expand that accordion
        setExpandedItem(existingItem);
        setSelectedUuids([existingItem.id]);
      } else {
        // Set as temporary item and expand it
        setTemporaryItem(newItem);
        setExpandedItem(newItem);
      }
    };

    const handleAddItem = (event: ItemAddEvent) => {
      const newItem = event.component;

      setTemporaryItem((currentTemp) => {
        // If this is bookmarking a temporary item, clear it from temporaryItem and move it to list items
        if (currentTemp?.id === newItem.id) {
          setItems((items) => {
            if (items) {
              if (items.findIndex((i) => i.id === currentTemp.id) === -1) {
                setExpandedItem(currentTemp);
                return [currentTemp, ...items];
              }
              return items;
            }
            setExpandedItem(currentTemp);
            return [currentTemp];
          });
          // Clear temporary item since it's in list items
          return undefined;
        } else {
          // If bookmarking a record without select it as temporary item, just adding to list items without expanding
          setItems((items) => {
            if (items) {
              if (items.findIndex((i) => i.id === newItem.id) === -1) {
                return [newItem, ...items];
              }
              return items;
            }
            return [newItem];
          });
          // Keep current temporary item unchanged
          return currentTemp;
        }
      });
    };

    const handleAccordionCollapseAll = () => {
      setExpandedItem(undefined);
      setSelectedUuids([]);
    };

    // Only items in the list items should be considered as bookmarked
    const handleCheckBookmark = (event: ItemCheckEvent) => {
      // Only check in permanent items array, ignore temporaryItem
      setItems((prevItems) => {
        const exists =
          prevItems?.some((item) => item.id === event.uuid) ?? false;
        event.callback(exists);
        console.log("in handleCheckBookmark, exists===", exists);
        return prevItems;
      });
    };

    eventEmitter.on(EVENT_MENU_CLICKED, handleClickEvent);
    internalEventLoop.on(EVENT_ADD_TEMPORARY_ITEM, handleAddTemporaryItem);
    internalEventLoop.on(EVENT_ADD_ITEM, handleAddItem);
    internalEventLoop.on(EVENT_ACCORDION_COLLAPSE, handleAccordionCollapseAll);
    internalEventLoop.on(EVENT_CHECK_BOOKMARK, handleCheckBookmark);

    return () => {
      eventEmitter.off(EVENT_MENU_CLICKED, handleClickEvent);
      internalEventLoop.on(EVENT_ADD_TEMPORARY_ITEM, handleAddTemporaryItem);
      internalEventLoop.off(EVENT_ADD_ITEM, handleAddItem);
      internalEventLoop.off(
        EVENT_ACCORDION_COLLAPSE,
        handleAccordionCollapseAll
      );
      internalEventLoop.off(EVENT_CHECK_BOOKMARK, handleCheckBookmark);
    };
  }, [items, setSelectedUuids, temporaryItem?.id]);

  return (
    <>
      <IconButton
        aria-label="bookmark-list-button"
        id="bookmark-list-button"
        ref={anchorRef}
        onClick={handleToggle}
        sx={{ paddingTop: "3px !important" }}
      >
        <BookmarksIcon />
      </IconButton>
      <Popper
        id="bookmark-list"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="left-start"
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10],
            },
          },
        ]}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: BOOKMARK_LIST_WIDTH,
            maxHeight: "85vh",
            overflowY: "auto",
            borderRadius: borderRadius.menu,
            backgroundColor: "#fff",
            zIndex: 1,
          }}
        >
          <BookmarkListAccordionGroup
            items={items}
            temporaryItem={temporaryItem}
            onRemoveItem={onRemoveItem}
            expandedItem={expandedItem}
            setExpandedItem={setExpandedItem}
            setSelectedUuids={setSelectedUuids}
          />
        </Box>
      </Popper>
    </>
  );
};

export default BookmarkListMenu;

export {
  insertTemporaryItemToBookmarkList,
  insertItemToBookmarkList,
  collapseAllAccordions,
  checkIsBookmarked,
};
