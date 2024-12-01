import { FC, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton } from "@mui/material";
import { color, gap } from "../../styles/constants";

interface BookmarkButtonProps {
  onClick?: () => void;
  checked?: boolean;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({
  onClick = () => {},
  checked = false,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <IconButton
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
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
