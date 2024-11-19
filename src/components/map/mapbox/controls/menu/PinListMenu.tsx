import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  SyntheticEvent,
} from "react";
import { ControlProps, MenuClickedEvent } from "./Definition";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { Box, Button, IconButton, Popper, Typography } from "@mui/material";
import StyledAccordionDetails from "../../../../common/accordion/StyledAccordionDetails";
import StyledAccordion from "../../../../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../../../../common/accordion/StyledAccordionSummary";
import { OGCCollection } from "../../../../common/store/OGCCollectionDefinitions";
import {
  borderRadius,
  color,
  fontColor,
  fontSize,
  fontWeight,
} from "../../../../../styles/constants";

import EventEmitter from "events";
import { EVENT_MENU_CLICKED, eventEmitter } from "./MenuControl";
import PinListCard from "../../../../result/PinListCard";

interface PinListMenuProps extends ControlProps {
  items?: Array<OGCCollection> | undefined;
  onClickAccordion?: (uuid: string | undefined) => void;
  onRemoveFromPinList?: (uuid: string) => void;
}

interface PinListAccordionGroupProps {
  items: Array<OGCCollection> | undefined;
  onRemoveItem: (item: OGCCollection) => void;
  onClickAccordion: (uuid: string | undefined) => void;
}

interface ItemAddEvent {
  event: MouseEvent;
  component: OGCCollection;
}

interface AccordionExpandEvent {
  uuid: string;
}

const PIN_LIST_WIDTH = 260;
const EVENT_ADD_ITEM = "add-item";
const EVENT_ACCORDION_EXPAND = "accordion-expand";
const EVENT_ACCORDION_COLLAPSE = "accordion-collapse";

// Do not expose it directly, use function to expose it
const internalEventLoop: EventEmitter = new EventEmitter();

const insertItemToPinList = (item: OGCCollection): void => {
  internalEventLoop.emit(EVENT_ADD_ITEM, {
    event: new MouseEvent(EVENT_ADD_ITEM),
    component: item,
  });
};

const expandAccordion = (uuid: string): void => {
  internalEventLoop.emit(EVENT_ACCORDION_EXPAND, {
    uuid,
  } as AccordionExpandEvent);
};

const collapseAllAccordions = (): void => {
  internalEventLoop.emit(EVENT_ACCORDION_COLLAPSE);
};

const PinListAccordionGroup: React.FC<PinListAccordionGroupProps> = ({
  items,
  onRemoveItem,
  onClickAccordion,
}) => {
  const [expandedItem, setExpandedItem] = useState<OGCCollection | undefined>(
    undefined
  );
  const [hoverOnRemoveButton, setHoverOnRemoveButton] =
    useState<boolean>(false);

  // When click on an other accordion (if not click on the remove button) will collapse the current one and expand the click one
  // Always set the expanded accordion dataset as the selected dataset
  const handleChange = useCallback(
    (item: OGCCollection, hoverOnRemoveButton: boolean) =>
      (_: SyntheticEvent, newExpanded: boolean) => {
        if (hoverOnRemoveButton) return;
        setExpandedItem(newExpanded ? item : undefined);
        onClickAccordion(newExpanded ? item.id : undefined);
      },
    [onClickAccordion]
  );

  const handleRemove = useCallback(
    (item: OGCCollection) => {
      // Keep the current expansion status when remove the other un-expanded pinned datasets
      setExpandedItem((prev) => (prev?.id === item.id ? items?.[0] : prev));
      onRemoveItem && onRemoveItem(item);
    },
    [onRemoveItem, items]
  );

  useEffect(() => {
    // Handler for expanding specific accordion
    const handleAccordionExpand = (event: AccordionExpandEvent) => {
      if (!items) return;

      const targetItem = items.find((item) => item.id === event.uuid);
      if (targetItem) {
        setExpandedItem(targetItem);
        onClickAccordion(targetItem.id);
      }
    };

    // Handler for collapsing all accordions
    const handleAccordionCollapseAll = () => {
      setExpandedItem(undefined);
      onClickAccordion(undefined);
    };

    // Handler for adding new items
    const handleAddItem = (event: ItemAddEvent) => {
      event?.component &&
        setTimeout(() => setExpandedItem(event.component), 100);
    };

    internalEventLoop.on(EVENT_ADD_ITEM, handleAddItem);
    internalEventLoop.on(EVENT_ACCORDION_EXPAND, handleAccordionExpand);
    internalEventLoop.on(EVENT_ACCORDION_COLLAPSE, handleAccordionCollapseAll);

    return () => {
      internalEventLoop.off(EVENT_ADD_ITEM, handleAddItem);
      internalEventLoop.off(EVENT_ACCORDION_EXPAND, handleAccordionExpand);
      internalEventLoop.off(
        EVENT_ACCORDION_COLLAPSE,
        handleAccordionCollapseAll
      );
    };
  }, [items, onClickAccordion]);

  if (!items) return;

  return (
    <>
      {items.map((item) => (
        <StyledAccordion
          key={item.id}
          expanded={expandedItem?.id === item.id}
          onChange={handleChange(item, hoverOnRemoveButton)}
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
                  color: color.gray.dark,
                  fontSize: fontSize.icon,
                  fontWeight: fontWeight.bold,
                  " &:hover": {
                    color: color.blue.dark,
                    fontSize: fontSize.info,
                  },
                }}
                onClick={() => handleRemove(item)}
                onMouseEnter={() => setHoverOnRemoveButton(true)}
                onMouseLeave={() => setHoverOnRemoveButton(false)}
              >
                X
              </Button>
            </Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <PinListCard collection={item} />
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </>
  );
};

const PinListMenu: React.FC<PinListMenuProps> = ({
  onClickAccordion = () => {},
  onRemoveFromPinList = () => {},
}) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState<boolean>(true);
  const [items, setItems] = useState<Array<OGCCollection> | undefined>(
    undefined
  );

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const onRemoveItem = useCallback(
    (item: OGCCollection) => {
      setItems((items) => items?.filter((c) => c.id !== item.id));
      onRemoveFromPinList(item.id);
    },
    [onRemoveFromPinList]
  );

  useEffect(() => {
    // Handle event when other control clicked, this component should close
    // the menu
    const handleEvent = (evt: MenuClickedEvent) => {
      if (evt.component.type !== PinListMenu) {
        setOpen(false);
      }
    };

    const onAddItem = (event: ItemAddEvent) => {
      setItems((items) => {
        if (items) {
          // Avoid duplicate, if we cannot find in the current array add it.
          if (items.findIndex((i) => i.id === event.component.id) === -1) {
            // New item always add to front
            return [event.component, ...items];
          } else {
            return items;
          }
        } else {
          // no item, so return array of this item
          return [event.component];
        }
      });
    };

    eventEmitter.on(EVENT_MENU_CLICKED, handleEvent);
    internalEventLoop.on(EVENT_ADD_ITEM, onAddItem);

    return () => {
      eventEmitter.off(EVENT_MENU_CLICKED, handleEvent);
      internalEventLoop.off(EVENT_ADD_ITEM, onAddItem);
    };
  }, []);

  return (
    <>
      <IconButton
        aria-label="pinned-list-button"
        id="pinned-list-button"
        ref={anchorRef}
        onClick={handleToggle}
      >
        <LibraryAddCheckIcon />
      </IconButton>
      <Popper
        id="pinned-list"
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
            width: PIN_LIST_WIDTH,
            maxHeight: "85vh",
            overflowY: "auto",
            borderRadius: borderRadius.menu,
            backgroundColor: "#fff",
            zIndex: 1,
          }}
        >
          <PinListAccordionGroup
            items={items}
            onRemoveItem={onRemoveItem}
            onClickAccordion={onClickAccordion}
          />
        </Box>
      </Popper>
    </>
  );
};

export default PinListMenu;

export { insertItemToPinList, expandAccordion, collapseAllAccordions };
