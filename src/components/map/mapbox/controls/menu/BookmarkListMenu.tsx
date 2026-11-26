import { FC, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Box, IconButton, Popper } from "@mui/material";
import store from "@/app/store/store";
import AdminScreenContext, {
  AdminScreenContextType,
} from "@/components/admin/AdminScreenContext";
import { ControlProps, EVENT_MENU, MenuClickedEvent } from "./Definition";
import { borderRadius, zIndex } from "@/styles/constants";
import { eventEmitter, switcherIconButtonSx } from "./MenuControl";
import MenuHintTooltip from "./MenuHintTooltip";
import BookmarkListAccordionGroup, {
  BookmarkListAccordionGroupBasicType,
} from "../../../../bookmark/BookmarkListAccordionGroup";
import {
  BOOKMARK_LIST_MAP_HEIGHT_RATIO,
  BOOKMARK_LIST_WIDTH_MAP,
} from "../../../../result/constants";
import { BookmarkIcon } from "@/assets/icons/map/bookmark";
import useBreakpoint from "../../../../../hooks/useBreakpoint";
import useElementSize from "../../../../../hooks/useElementSize";

export interface BookmarkListMenuBasicType
  extends ControlProps, BookmarkListAccordionGroupBasicType {}

// Stable, so the context does not change on every render
const NO_ADMIN_SCREEN: Partial<AdminScreenContextType> = {};

interface BookmarkListMenuProps extends BookmarkListMenuBasicType {
  // Passed in, as AdminScreenContext does not reach the MenuControl root
  adminScreen?: Partial<AdminScreenContextType>;
}

const BookmarkListMenu: FC<BookmarkListMenuProps> = ({
  onDeselectDataset,
  tabNavigation,
  adminScreen = NO_ADMIN_SCREEN,
}) => {
  const { isAboveDesktop } = useBreakpoint();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(isAboveDesktop);
  const { height: mapHeight } = useElementSize(
    anchorEl?.closest<HTMLElement>(".mapboxgl-map")
  );

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

  return (
    <>
      <MenuHintTooltip hint="Bookmarks" disable={open}>
        <IconButton
          aria-label="bookmark-list-button"
          id="bookmark-list-button"
          ref={setAnchorEl}
          onClick={() => setOpen((prev) => !prev)}
          sx={switcherIconButtonSx(open)}
        >
          <BookmarkIcon color={open ? "white" : undefined} />
        </IconButton>
      </MenuHintTooltip>
      {/* Rendered via portal (outside the mapbox control container) so
          mapbox-gl.css button styles cannot leak into the list content */}
      <Popper
        id="bookmark-list"
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        placement="left-start"
        sx={{ zIndex: zIndex.MAP_CONTROL }}
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
            maxHeight: mapHeight
              ? mapHeight * BOOKMARK_LIST_MAP_HEIGHT_RATIO
              : undefined,
            overflow: "hidden",
            borderRadius: borderRadius.menu,
            backgroundColor: "#fff",
            // Safari paints a transformed popper that is clipped with
            // overflow + border-radius as a black layer when it overlaps
            // the Mapbox WebGL canvas. A local 3d layer keeps the background.
            transform: "translateZ(0)",
            zIndex: 1,
          }}
        >
          {/* MenuControl renders this menu in its own React root, outside the
              app's redux and admin screen providers. The bookmark cards need
              both to check WFS downloads with the allow list setting. */}
          <Provider store={store}>
            <AdminScreenContext.Provider value={adminScreen}>
              <BookmarkListAccordionGroup
                onDeselectDataset={onDeselectDataset}
                tabNavigation={tabNavigation}
              />
            </AdminScreenContext.Provider>
          </Provider>
        </Box>
      </Popper>
    </>
  );
};

export default BookmarkListMenu;
