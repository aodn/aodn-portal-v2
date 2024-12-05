import { FC, useRef, useEffect, Dispatch, useState, useContext } from "react";
import { Box, IconButton, Popper } from "@mui/material";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { ControlProps, MenuClickedEvent } from "./Definition";
import { borderRadius } from "../../../../../styles/constants";
import { EVENT_MENU_CLICKED, eventEmitter } from "./MenuControl";
import BookmarkListAccordionGroup from "../../../../bookmark/BookmarkListAccordionGroup";
import { BOOKMARK_LIST_WIDTH } from "../../../../result/constants";
import { BookmarkContext } from "../../../../../pages/search-page/subpages/MapSection";
import { useSelector } from "react-redux";
import {
  selectBookmarkItems,
  selectTemporaryItem,
} from "../../../../common/store/bookmarkListReducer";
import { OGCCollection } from "../../../../common/store/OGCCollectionDefinitions";

interface BookmarkListMenuProps extends ControlProps {
  setSelectedUuids?: Dispatch<React.SetStateAction<string[]>>;
  bookmarkItems?: OGCCollection[];
  bookmarkTemporaryItem: OGCCollection | undefined;
}

const BookmarkListMenu: FC<BookmarkListMenuProps> = ({
  setSelectedUuids = () => {},
  bookmarkItems,
  bookmarkTemporaryItem,
}) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState<boolean>(true);
  // const bookmarkFunctions = useContext(BookmarkContext);
  // console.log("bookmarkFunctions", bookmarkFunctions);
  console.log("in MapMenu, bookmarkItems==", bookmarkItems);
  console.log("in MapMenu,  bookmarkTemporaryItem==", bookmarkTemporaryItem);
  useEffect(() => {
    const handleMenuClick = (evt: MenuClickedEvent) => {
      if (evt.component.type !== BookmarkListMenu) {
        setOpen(false);
      }
    };

    eventEmitter.on(EVENT_MENU_CLICKED, handleMenuClick);
    return () => {
      eventEmitter.off(EVENT_MENU_CLICKED, handleMenuClick);
    };
  }, [setOpen]);

  return (
    <>
      <IconButton
        aria-label="bookmark-list-button"
        id="bookmark-list-button"
        ref={anchorRef}
        onClick={() => setOpen((prev) => !prev)}
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
          {/* <BookmarkListAccordionGroup setSelectedUuids={setSelectedUuids} items={}/> */}
        </Box>
      </Popper>
    </>
  );
};

export default BookmarkListMenu;
