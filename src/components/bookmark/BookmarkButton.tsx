import { FC, useCallback, useEffect, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton } from "@mui/material";
import { color, gap } from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { useBookmarkList } from "../../hooks/useBookmarkList";
import { useAppDispatch } from "../common/store/hooks";
import {
  addItem,
  selectBookmarkItems,
} from "../common/store/bookmarkListReducer";
import { useSelector } from "react-redux";

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
  // const dispatch = useAppDispatch();
  // const items = useSelector(selectBookmarkItems);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // const { checkIsBookmarked, insertItem } = useBookmarkList();
  // console.log("redux temporaryItem", temporaryItem);
  // console.log("redux items", items);
  // const { checkIsBookmarked, insertItem } = useBookmarkList();
  // console.log("bookmark button");
  // No need for isBookmarked state since we can check directly
  // const isBookmarked = dataset ? checkIsBookmarked(dataset.id) : false;
  // const isBookmarked = dataset
  //   ? items?.some((item) => item.id === dataset.id)
  //   : false;
  const isBookmarked = dataset ? checkIsBookmarked(dataset.id) : false;

  const handleClick = useCallback(() => {
    if (dataset) {
      onClickBookmark(dataset);
      // insertItem(dataset);
      // dispatch(addItem(dataset));
    }
  }, [dataset, onClickBookmark]);

  return (
    <IconButton
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      sx={{
        padding: gap.sm,
      }}
    >
      {isBookmarked || isHovered ? (
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
  );
};

export default BookmarkButton;
