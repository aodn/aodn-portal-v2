import { FC, useRef, useEffect, useState } from "react";
import { Box, IconButton, Popper } from "@mui/material";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { ControlProps, EVENT_MENU, MenuClickedEvent } from "./Definition";
import { borderRadius } from "../../../../../styles/constants";
import { eventEmitter } from "./MenuControl";
import BookmarkListAccordionGroup, {
  BookmarkListAccordionGroupBasicType,
} from "../../../../bookmark/BookmarkListAccordionGroup";
import { BOOKMARK_LIST_WIDTH } from "../../../../result/constants";

export interface BookmarkListMenuBasicType
  extends ControlProps,
    BookmarkListAccordionGroupBasicType {}

interface BookmarkListMenuProps extends BookmarkListMenuBasicType {}

const BookmarkListMenu: FC<BookmarkListMenuProps> = ({
  onRemoveAllBookmarks,
  tabNavigation,
}) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
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

  return (
    <Box>
      <IconButton
        aria-label="bookmark-list-button"
        id="bookmark-list-button"
        ref={anchorRef}
        onClick={() => setOpen((prev) => !prev)}
        sx={{ paddingTop: "3px !important" }}
      >
        <BookmarksIcon />
      </IconButton>
      {anchorRef.current && (
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
              onRemoveAllBookmarks={onRemoveAllBookmarks}
              tabNavigation={tabNavigation}
            />
          </Box>
        </Popper>
      )}
    </Box>
  );
};

export default BookmarkListMenu;
