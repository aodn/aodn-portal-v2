import { FC, useState } from "react";
import { Box, Button, Paper, Popper, SxProps } from "@mui/material";
import BookmarkListAccordionGroup from "../bookmark/BookmarkListAccordionGroup";
import { border, borderRadius, color } from "../../styles/constants";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { BOOKMARK_LIST_WIDTH_RESULTS } from "./constants";
import useTabNavigation from "../../hooks/useTabNavigation";
import BookmarkListHead from "../bookmark/BookmarkListHead";
import store from "../common/store/store";
import {
  removeAllItems,
  selectBookmarkItems,
} from "../common/store/bookmarkListReducer";
import { useSelector } from "react-redux";

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
        sx={{ width: BOOKMARK_LIST_WIDTH_RESULTS, bgcolor: "#fff" }}
      >
        <BookmarkListAccordionGroup tabNavigation={tabNavigation} hideHead />
      </Popper>
    </Box>
  );
};

export default BookmarkListButton;
