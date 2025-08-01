import { FC, useCallback } from "react";
import { Box, Button, SxProps, Typography } from "@mui/material";
import rc8Theme from "../../styles/themeRC8";

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
        bgcolor: rc8Theme.palette.primary4,
        ...sx,
      }}
      data-testid="bookmark-list-head"
    >
      <Typography variant="title2Regular" color={rc8Theme.palette.text1}>
        {getTitle()}
      </Typography>
      <Button
        sx={{ position: "absolute", right: 0, textTransform: "none" }}
        onClick={onClearAllBookmarks}
        data-testid="bookmark-list-head-clearall"
      >
        <Typography
          variant="body1Medium"
          color={rc8Theme.palette.text1}
          pr="18px"
        >
          Clear
        </Typography>
      </Button>
    </Box>
  );
};

export default BookmarkListHead;
