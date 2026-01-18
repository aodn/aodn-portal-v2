import { FC, useCallback } from "react";
import { Box, Button, SxProps, Typography } from "@mui/material";
import { portalTheme } from "../../styles";

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
        bgcolor: portalTheme.palette.primary4,
        ...sx,
      }}
      data-testid="bookmark-list-head"
    >
      <Typography
        sx={{
          ...portalTheme.typography.title2Regular,
          color: portalTheme.palette.text1,
          fontWeight: 500,
          lineHeight: "24px",
          py: "10px",
        }}
      >
        {getTitle()}
      </Typography>
      <Button
        sx={{
          position: "absolute",
          right: 0,
          textTransform: "none",
        }}
        onClick={onClearAllBookmarks}
        data-testid="bookmark-list-head-clearall"
      >
        <Typography
          sx={{
            ...portalTheme.typography.body1Medium,
            color: portalTheme.palette.text1,
            fontWeight: 500,
            py: "4px",
          }}
        >
          Clear
        </Typography>
      </Button>
    </Box>
  );
};

export default BookmarkListHead;
