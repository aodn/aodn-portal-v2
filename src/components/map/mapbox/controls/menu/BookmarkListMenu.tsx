import { useEffect, useState, useCallback, useRef, FC } from "react";
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
  onClickAccordion?: (uuid: string | undefined) => void;
  onRemoveFromBookmarkList?: (uuid: string) => void;
}

interface ItemAddEvent {
  event: MouseEvent;
  component: OGCCollection;
}

interface ItemSelectEvent {
  event: MouseEvent;
  uuid: string;
}

const EVENT_ADD_ITEM = "add-item";
const EVENT_ACCORDION_COLLAPSE = "accordion-collapse";
const EVENT_SET_SELECTED_UUID = "set-selected-uuid";

// Do not expose it directly, use function to expose it
const internalEventLoop: EventEmitter = new EventEmitter();

const insertItemToBookmarkList = (item: OGCCollection): void => {
  internalEventLoop.emit(EVENT_ADD_ITEM, {
    event: new MouseEvent(EVENT_ADD_ITEM),
    component: item,
  });
};

const collapseAllAccordions = (): void => {
  internalEventLoop.emit(EVENT_ACCORDION_COLLAPSE);
};

const setSelectedUuid = (uuid: string) => {
  internalEventLoop.emit(EVENT_SET_SELECTED_UUID, {
    event: new MouseEvent(EVENT_SET_SELECTED_UUID),
    uuid: uuid,
  });
};

const BookmarkListMenu: FC<BookmarkListMenuProps> = ({
  onClickAccordion = () => {},
  onRemoveFromBookmarkList = () => {},
}) => {
  const anchorRef = useRef(null);
  // State to store the popup open status
  const [open, setOpen] = useState<boolean>(true);
  // State to store bookmark list items
  const [items, setItems] = useState<Array<OGCCollection> | undefined>(
    undefined
  );
  // State to store the item expanded
  const [expandedItem, setExpandedItem] = useState<OGCCollection | undefined>(
    undefined
  );

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const onRemoveItem = useCallback(
    (item: OGCCollection) => {
      setItems((items) => items?.filter((c) => c.id !== item.id));
      onRemoveFromBookmarkList(item.id);
    },
    [onRemoveFromBookmarkList]
  );

  useEffect(() => {
    // Handle event when other control clicked, this component should close
    // the menu
    const handleEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== BookmarkListMenu) {
        setOpen(false);
      }
    };

    const onAddItem = (event: ItemAddEvent) => {
      setItems((items) => {
        if (items) {
          // Avoid duplicate, if we cannot find in the current array add it.
          if (items.findIndex((i) => i.id === event.component.id) === -1) {
            setExpandedItem(event.component);
            // New item always add to front
            return [event.component, ...items];
          } else {
            return items;
          }
        } else {
          setExpandedItem(event.component);
          // no item, so return array of this item
          return [event.component];
        }
      });
    };

    const handleSelectedUuid = (event: ItemSelectEvent) => {
      if (!items) return;

      const targetItem = items.find((item) => item.id === event.uuid);
      if (targetItem) {
        setExpandedItem(targetItem);
        onClickAccordion(targetItem.id);
      }
    };

    const handleAccordionCollapseAll = () => {
      setExpandedItem(undefined);
      onClickAccordion(undefined);
    };

    eventEmitter.on(EVENT_MENU_CLICKED, handleEvent);
    internalEventLoop.on(EVENT_ADD_ITEM, onAddItem);
    internalEventLoop.on(EVENT_ACCORDION_COLLAPSE, handleAccordionCollapseAll);
    internalEventLoop.on(EVENT_SET_SELECTED_UUID, handleSelectedUuid);

    return () => {
      eventEmitter.off(EVENT_MENU_CLICKED, handleEvent);
      internalEventLoop.off(EVENT_ADD_ITEM, onAddItem);
      internalEventLoop.off(
        EVENT_ACCORDION_COLLAPSE,
        handleAccordionCollapseAll
      );
      internalEventLoop.off(EVENT_SET_SELECTED_UUID, handleSelectedUuid);
    };
  }, [items, onClickAccordion]);

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
            onRemoveItem={onRemoveItem}
            onClickAccordion={onClickAccordion}
            expandedItem={expandedItem}
            setExpandedItem={setExpandedItem}
          />
        </Box>
      </Popper>
    </>
  );
};

export default BookmarkListMenu;

export { insertItemToBookmarkList, setSelectedUuid, collapseAllAccordions };
