import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  SyntheticEvent,
} from "react";

import { ControlProps, MenuClickedEvent } from "./Definition";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import {
  Box,
  Button,
  IconButton,
  Popper,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import Map from "../../Map";
import StyledAccordionDetails from "../../../../common/accordion/StyledAccordionDetails";
import StyledAccordion from "../../../../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../../../../common/accordion/StyledAccordionSummary";
import { OGCCollection } from "../../../../common/store/OGCCollectionDefinitions";
import Layers from "../../layers/Layers";
import ResultCardButtonGroup from "../../../../result/ResultCardButtonGroup";
import {
  borderRadius,
  color,
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../../../styles/constants";
import GeojsonLayer from "../../layers/GeojsonLayer";
import EventEmitter from "events";
import { EVENT_MENU_CLICKED, eventEmitter } from "./MenuControl";
import { setSelection } from "@testing-library/user-event/dist/cjs/event/selection/setSelection.js";

interface PinListMenuProps extends ControlProps {
  items?: Array<OGCCollection> | undefined;
}

interface PinListCardProps {
  collection: OGCCollection;
  sx?: SxProps;
  onDatasetSelected?: () => void;
  tabNavigation?: (uuid: string, tab: string, section?: string) => void;
}

interface PinListAccordionGroupProps {
  items: Array<OGCCollection> | undefined;
  onRemoveItem: (item: OGCCollection) => void;
}

interface ItemAddEvent {
  event: MouseEvent;
  component: OGCCollection;
}

const PIN_LIST_WIDTH = 260;
const mapContainerId = "pin-list-card-spatial-extend-overview";
const EVENT_ADD_ITEM = "add-item";

// Do not expose it directly, use function to expose it
const internalEventLoop: EventEmitter = new EventEmitter();

const insertItemToPinList = (item: OGCCollection): void => {
  internalEventLoop.emit(EVENT_ADD_ITEM, {
    event: new MouseEvent(EVENT_ADD_ITEM),
    component: item,
  });
};
// Rearrange the list, so that the selected item move to the top
// of the list
const arrangeItems = (
  items: Array<OGCCollection>,
  selected: OGCCollection | undefined
): Array<OGCCollection> => {
  if (selected) {
    return [selected, ...items.filter((i) => i.id !== selected.id)];
  } else {
    return items;
  }
};

const PinListCard: React.FC<PinListCardProps> = ({
  collection,
  onDatasetSelected = () => {},
  tabNavigation = () => {},
  sx,
}) => {
  const onLinks = () => tabNavigation(collection.id, "links");
  const onDownload = () =>
    tabNavigation(collection.id, "abstract", "download-section");
  const onDetail = () => tabNavigation(collection.id, "abstract");

  return (
    <Box flex={1} sx={{ ...sx }}>
      <Stack direction="column" spacing={1}>
        <Box onClick={onDatasetSelected}>
          <Box
            arial-label="map"
            id={`${mapContainerId}-${collection.id}`}
            sx={{
              width: "100%",
              height: "150px",
            }}
          >
            <Map panelId={`${mapContainerId}-${collection.id}`}>
              <Layers>
                <GeojsonLayer collection={collection} />
              </Layers>
            </Map>
          </Box>
        </Box>

        <Box>
          <ResultCardButtonGroup
            content={collection}
            isGridView
            onLinks={onLinks}
            onDownload={onDownload}
            onDetail={onDetail}
          />
        </Box>

        <Box onClick={() => {}}>
          <Tooltip title="More detail..." placement="top">
            <Typography
              color={fontColor.gray.medium}
              fontSize={fontSize.resultCardContent}
              sx={{
                padding: 0,
                paddingX: padding.small,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "5",
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }}
            >
              {collection.description}
            </Typography>
          </Tooltip>
        </Box>
      </Stack>
    </Box>
  );
};

const PinListAccordionGroup: React.FC<PinListAccordionGroupProps> = ({
  items,
  onRemoveItem,
}) => {
  const [selectedItem, setSelectedItem] = useState<OGCCollection | undefined>(
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
        setSelectedItem(newExpanded ? item : undefined);
      },
    []
  );

  const handleRemove = useCallback(
    (item: OGCCollection) => {
      // Keep the current expansion status when remove the other un-expanded pinned datasets
      setSelectedItem((prev) => (prev?.id === item.id ? undefined : prev));
      onRemoveItem && onRemoveItem(item);
    },
    [onRemoveItem]
  );
  useEffect(() => {
    const onAddItem = (event: ItemAddEvent) => {
      event &&
        event.component &&
        // We want to happend a bit later, so that items are set before
        // before we expand it.
        setTimeout(() => setSelectedItem(event.component), 100);
    };

    internalEventLoop.on(EVENT_ADD_ITEM, onAddItem);

    return () => {
      internalEventLoop.off(EVENT_ADD_ITEM, onAddItem);
    };
  }, []);

  if (!items) return;

  return (
    <>
      {arrangeItems(items, selectedItem).map((item) => (
        <StyledAccordion
          key={item.id}
          expanded={selectedItem?.id === item.id}
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

const PinListMenu: React.FC<PinListMenuProps> = () => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState<boolean>(true);
  const [items, setItems] = useState<Array<OGCCollection> | undefined>(
    undefined
  );

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const onRemoveItem = useCallback((item: OGCCollection) => {
    setItems((items) => items?.filter((c) => c.id !== item.id));
  }, []);

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
          <PinListAccordionGroup items={items} onRemoveItem={onRemoveItem} />
        </Box>
      </Popper>
    </>
  );
};

export default PinListMenu;

export { insertItemToPinList };
