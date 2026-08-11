import { FC, useState } from "react";
import { Box, Paper, Popper, SxProps } from "@mui/material";
import store from "@/app/store/store";
import {
  removeAllItems,
  selectBookmarkItems,
} from "@/app/store/bookmarkListReducer";
import { useSelector } from "react-redux";
import useElementSize from "@/hooks/useElementSize";
import BookmarkListAccordionGroup from "@/components/bookmark/BookmarkListAccordionGroup";
import { ExpandLess } from "@/assets/icons/details/expandLess";
import { ExpandMore } from "@/assets/icons/details/expendMore";
import {
  BOOKMARK_LIST_RESULTS_MAX_HEIGHT,
  BOOKMARK_LIST_WIDTH_RESULTS,
} from "./constants";
import useTabNavigation from "@/hooks/useTabNavigation";
import BookmarkListHead from "@/components/bookmark/BookmarkListHead";
import { portalTheme } from "@/styles";

export interface BookmarkListButtonBasicType {
  onDeselectDataset?: () => void;
}

interface BookmarkListButtonProps extends BookmarkListButtonBasicType {
  sx?: SxProps;
}

const BookmarkListButton: FC<BookmarkListButtonProps> = ({
  sx,
  onDeselectDataset,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const bookmarkItems = useSelector(selectBookmarkItems);

  const tabNavigation = useTabNavigation();

  const { ref, width: bookmarkButtonWidth } = useElementSize();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClearAllBookmarks = () => {
    store.dispatch(removeAllItems());
    onDeselectDataset && onDeselectDataset();
  };

  return (
    <Box sx={sx}>
      <Paper
        // Same elevation as the list below so the two read as one panel
        elevation={1}
        onClick={handleClick}
        ref={ref}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "40px",
          // When expanded the bar and the list below read as one panel, so the
          // bottom corners square off and the head divider becomes the seam
          borderRadius: anchorEl ? "6px 6px 0 0" : "6px",
          backgroundColor: portalTheme.palette.neutral2,
          position: "relative",
          ":hover": {
            cursor: "pointer",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: "8px",
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {anchorEl ? (
            <ExpandLess color={portalTheme.palette.grey700} width={12} />
          ) : (
            <ExpandMore color={portalTheme.palette.grey700} width={12} />
          )}
        </Box>
        <BookmarkListHead
          onClearAllBookmarks={handleClearAllBookmarks}
          bookmarkCount={bookmarkItems.length}
          // The seam with the list is drawn on top of the popup below, so the
          // head keeps no divider of its own here
          sx={{ backgroundColor: "transparent", borderBottom: "none" }}
        />
      </Paper>
      <Popper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 0],
            },
          },
        ]}
        sx={{
          minWidth: BOOKMARK_LIST_WIDTH_RESULTS,
          width: bookmarkButtonWidth,
          bgcolor: "#fff",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: "0 0 6px 6px",
            borderTop: `2px solid ${portalTheme.palette.grey300}`,
            maxHeight: BOOKMARK_LIST_RESULTS_MAX_HEIGHT,
            overflow: "hidden",
          }}
        >
          <BookmarkListAccordionGroup tabNavigation={tabNavigation} hideHead />
        </Paper>
      </Popper>
    </Box>
  );
};

export default BookmarkListButton;
