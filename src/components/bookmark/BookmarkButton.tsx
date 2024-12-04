import { FC, useCallback, useEffect, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton } from "@mui/material";
import { color, gap } from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { checkIsBookmarked } from "../map/mapbox/controls/menu/BookmarkListMenu";

interface BookmarkButtonProps {
  dataset?: OGCCollection;
  onClick?: (dataset: OGCCollection) => void;
  // bookmarked?: boolean;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({
  dataset = undefined,
  onClick = () => {},
  // bookmarked = false,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const handleClick = useCallback(() => {
    if (onClick && dataset) {
      onClick(dataset);
      checkIsBookmarked(dataset.id, (exists) => {
        setIsBookmarked(exists);
      });
    }
  }, [dataset, onClick]);

  useEffect(() => {
    if (!dataset) return;
    checkIsBookmarked(dataset.id, (exists) => {
      setIsBookmarked(exists);
    });
  }, [dataset]);

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
