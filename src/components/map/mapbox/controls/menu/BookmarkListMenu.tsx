import { FC, useRef, useEffect, useState } from "react";
import { Box, IconButton, Popper } from "@mui/material";
import { ControlProps, EVENT_MENU, MenuClickedEvent } from "./Definition";
import { borderRadius } from "../../../../../styles/constants";
import { eventEmitter, switcherIconButtonSx } from "./MenuControl";
import BookmarkListAccordionGroup, {
  BookmarkListAccordionGroupBasicType,
} from "../../../../bookmark/BookmarkListAccordionGroup";
import { BOOKMARK_LIST_WIDTH_MAP } from "../../../../result/constants";
import { BookmarkIcon } from "../../../../../assets/map/bookmark";

export interface BookmarkListMenuBasicType
  extends ControlProps,
    BookmarkListAccordionGroupBasicType {}

interface BookmarkListMenuProps extends BookmarkListMenuBasicType {}

const BookmarkListMenu: FC<BookmarkListMenuProps> = ({
  onDeselectDataset,
  tabNavigation,
}) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    // Other menu button clicked, close this menu item
    const handleMenuClick = (evt: MenuClickedEvent) => {
      if (evt.component.type !== BookmarkListMenu) {
        setOpen(false);
      }
    };

    eventEmitter.on(EVENT_MENU.CLICKED, handleMenuClick);
    return () => {
      eventEmitter.off(EVENT_MENU.CLICKED, handleMenuClick);
    };
  }, [setOpen]);

  useEffect(() => {
    // Make bookmark list visible after all the init, the init false make
    // the list invisible during init which is correct.
    setOpen(true);
  }, []);

  return (
    <>
      <IconButton
        aria-label="bookmark-list-button"
        id="bookmark-list-button"
        ref={anchorRef}
        onClick={() => setOpen((prev) => !prev)}
        sx={switcherIconButtonSx(open)}
      >
        <BookmarkIcon />
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
            width: BOOKMARK_LIST_WIDTH_MAP,
            maxHeight: "85vh",
            overflowY: "auto",
            borderRadius: borderRadius.menu,
            backgroundColor: "#fff",
            zIndex: 1,
          }}
        >
          <BookmarkListAccordionGroup
            onDeselectDataset={onDeselectDataset}
            tabNavigation={tabNavigation}
          />
        </Box>
      </Popper>
    </>
  );
};

export default BookmarkListMenu;
