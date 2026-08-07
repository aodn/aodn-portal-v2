import { FC } from "react";
import { Box, Button, SxProps, Typography } from "@mui/material";
import { portalTheme } from "@/styles";
import { gap } from "@/styles/constants";
import CountBadge from "@/components/common/badge/CountBadge";

interface BookmarkListHeadProps {
  bookmarkCount: number | undefined;
  onClearAllBookmarks: () => void;
  sx?: SxProps;
}
const BookmarkListHead: FC<BookmarkListHeadProps> = ({
  bookmarkCount,
  onClearAllBookmarks,
  sx,
}) => (
  <Box
    sx={{
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: gap.lg,
      width: "100%",
      bgcolor: portalTheme.palette.primary4,
      borderBottom: `1px solid ${portalTheme.palette.grey500}`,
      ...sx,
    }}
    data-testid="bookmark-list-head"
  >
    <CountBadge count={bookmarkCount} dataTestId="bookmark-list-head-count" />
    <Typography
      sx={{
        ...portalTheme.typography.title2Regular,
        color: portalTheme.palette.text1,
        fontWeight: 500,
        lineHeight: "24px",
        py: "10px",
      }}
    >
      Bookmark List
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
          ...portalTheme.typography.body2Regular,
          color: portalTheme.palette.grey700,
          py: "4px",
        }}
      >
        Clear
      </Typography>
    </Button>
  </Box>
);

export default BookmarkListHead;
