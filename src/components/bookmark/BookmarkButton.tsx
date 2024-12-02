import { FC, useCallback, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton } from "@mui/material";
import { color, gap } from "../../styles/constants";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";

interface BookmarkButtonProps {
  dataset?: OGCCollection;
  onClick?: (dataset: OGCCollection) => void;
  checked?: boolean;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({
  dataset = undefined,
  onClick = () => {},
  checked = false,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const handleClick = useCallback(() => {
    if (onClick && dataset) {
      onClick(dataset);
    }
  }, [dataset, onClick]);

  return (
    <IconButton
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      sx={{
        padding: gap.sm,
      }}
    >
      {checked || isHovered ? (
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
