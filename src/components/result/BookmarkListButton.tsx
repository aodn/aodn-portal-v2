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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { BOOKMARK_LIST_WIDTH_RESULTS } from "./constants";
import useTabNavigation from "../../hooks/useTabNavigation";
import BookmarkListHead from "../bookmark/BookmarkListHead";
import { portalTheme } from "../../styles";

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
          height: "40px",
          border: `0.5px solid ${portalTheme.palette.grey500}`,
          borderRadius: "6px",
          backgroundColor: portalTheme.palette.primary6,
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
            <ExpandLessIcon sx={{ color: portalTheme.palette.primary.main }} />
          ) : (
            <ExpandMoreIcon sx={{ color: portalTheme.palette.primary.main }} />
          )}
        </Box>
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
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 6],
            },
          },
        ]}
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
