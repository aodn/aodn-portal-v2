import { FC, useCallback, useMemo } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton, Tooltip } from "@mui/material";
import { color, gap } from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";

export interface BookmarkButtonBasicType {
  dataset?: OGCCollection;
  onClickBookmark?: (dataset: OGCCollection) => void;
  checkIsBookmarked?: (uuid: string) => boolean;
}

interface BookmarkButtonProps extends BookmarkButtonBasicType {}

const BookmarkButton: FC<BookmarkButtonProps> = ({
  dataset = undefined,
  onClickBookmark = () => {},
  checkIsBookmarked = () => {},
}) => {
  const isBookmarked = useMemo(
    () => (dataset ? checkIsBookmarked(dataset.id) : false),
    [checkIsBookmarked, dataset]
  );

  const handleClick = useCallback(() => {
    if (dataset) {
      onClickBookmark(dataset);
    }
  }, [dataset, onClickBookmark]);

  return (
    <Tooltip
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      placement="top"
    >
      <IconButton
        onClick={handleClick}
        sx={{
          padding: gap.sm,
          ":hover": {
            scale: "105%",
          },
        }}
      >
        {isBookmarked ? (
          <BookmarkIcon sx={{ color: color.brightBlue.dark }} />
        ) : (
          <BookmarkBorderIcon
            sx={{
              color: color.brightBlue.dark,
              fontSize: "26px",
            }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default BookmarkButton;
