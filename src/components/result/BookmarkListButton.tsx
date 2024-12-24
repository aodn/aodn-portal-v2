import { FC, useState } from "react";
import { Box, Paper, Popper, SxProps } from "@mui/material";
import store from "../common/store/store";
import {
  removeAllItems,
  selectBookmarkItems,
} from "../common/store/bookmarkListReducer";
import { useSelector } from "react-redux";
import useElementSize from "../../hooks/useElementSize";
import BookmarkListAccordionGroup from "../bookmark/BookmarkListAccordionGroup";
import { border, borderRadius, color } from "../../styles/constants";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { BOOKMARK_LIST_WIDTH_RESULTS } from "./constants";
import useTabNavigation from "../../hooks/useTabNavigation";
import BookmarkListHead from "../bookmark/BookmarkListHead";

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
        elevation={0}
        onClick={handleClick}
        ref={ref}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "36px",
          border: `${border.xs} ${color.blue.darkSemiTransparent}`,
          borderRadius: borderRadius.small,
          backgroundColor: color.white.sixTenTransparent,
          ":hover": {
            cursor: "pointer",
          },
        }}
      >
        {anchorEl ? (
          <ExpandLessIcon color="primary" />
        ) : (
          <ExpandMoreIcon color="primary" />
        )}
        <BookmarkListHead
          onClearAllBookmarks={handleClearAllBookmarks}
          bookmarkCount={bookmarkItems.length}
          sx={{ backgroundColor: "transparent" }}
        />
      </Paper>
      <Popper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{
          minWidth: BOOKMARK_LIST_WIDTH_RESULTS,
          width: bookmarkButtonWidth,
          bgcolor: "#fff",
        }}
      >
        <Paper elevation={1} sx={{ width: "100%" }}>
          <BookmarkListAccordionGroup tabNavigation={tabNavigation} hideHead />
        </Paper>
      </Popper>
    </Box>
  );
};

export default BookmarkListButton;
