import { FC } from "react";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
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
  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      padding={padding.extraSmall}
      sx={{ backgroundColor: color.blue.darkSemiTransparent, ...sx }}
    >
      <Typography
        padding={0}
        fontSize={fontSize.info}
        color={fontColor.blue.dark}
        fontWeight={fontWeight.bold}
      >
        {bookmarkCount
          ? bookmarkCount === 0
            ? "Bookmark List"
            : bookmarkCount === 1
              ? "1 Bookmark"
              : `${bookmarkCount} Bookmarks`
          : "Bookmark List"}
      </Typography>
      <Button
        sx={{ position: "absolute", right: 0, textTransform: "none" }}
        onClick={onClearAllBookmarks}
      >
        <Typography
          fontSize={fontSize.label}
          color={fontColor.blue.dark}
          padding={0}
        >
          Clear
        </Typography>
      </Button>
    </Box>
  );
};

export default BookmarkListHead;
