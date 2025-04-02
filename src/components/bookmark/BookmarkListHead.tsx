import { FC, useCallback } from "react";
import { Box, Button, SxProps, Typography } from "@mui/material";
import {
  color,
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../styles/constants";

interface BookmarkListHeadProps {
  bookmarkCount: number | undefined;
  onClearAllBookmarks: () => void;
  sx?: SxProps;
}
const BookmarkListHead: FC<BookmarkListHeadProps> = ({
  bookmarkCount,
  onClearAllBookmarks,
  sx,
}) => {
  const getTitle = useCallback(() => {
    if (bookmarkCount === undefined || bookmarkCount === 0) {
      return "Bookmark List";
    }
    return `${bookmarkCount} Bookmark(s)`;
  }, [bookmarkCount]);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        p: padding.extraSmall,
        bgcolor: color.blue.darkSemiTransparent,
        ...sx,
      }}
      data-testid="bookmark-list-head"
    >
      <Typography
        fontSize={fontSize.info}
        color={fontColor.blue.dark}
        fontWeight={fontWeight.bold}
      >
        {getTitle()}
      </Typography>
      <Button
        sx={{ position: "absolute", right: 0, textTransform: "none" }}
        onClick={onClearAllBookmarks}
        data-testid="bookmark-list-head-clearall"
      >
        <Typography fontSize={fontSize.label} color={fontColor.blue.dark}>
          Clear
        </Typography>
      </Button>
    </Box>
  );
};

export default BookmarkListHead;
