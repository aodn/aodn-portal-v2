import { Dispatch, SetStateAction, useState } from "react";
import { Button, Typography } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontColor,
  padding,
} from "../../../styles/constants";
import DoneIcon from "@mui/icons-material/Done";

const CopyLinkButton = ({
  index,
  setClickedCopyLinkButtonIndex,
}: {
  index: number;
  setClickedCopyLinkButtonIndex: Dispatch<SetStateAction<number[]>>;
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const handleCopy = () => {
    navigator.clipboard
      .writeText("abc")
      .then(() => {
        setIsCopied(true);
        setClickedCopyLinkButtonIndex((prev) => [...prev, index]);
      })
      .catch((err) => {
        setIsCopied(false);
        console.error("Failed to copy text: ", err);
      });
  };
  return (
    <Button
      onClick={handleCopy}
      sx={{
        position: "relative",
        paddingX: padding.extraLarge,
        borderRadius: borderRadius.small,
        backgroundColor: isCopied ? color.blue.light : "#fff",
        border: `${border.sm} ${color.blue.darkSemiTransparent}`,
        "&:hover": {
          border: `${border.sm} ${color.blue.dark}`,
          backgroundColor: isCopied ? "transparent" : "#fff",
        },
      }}
    >
      <Typography
        sx={{ padding: 0 }}
        color={isCopied ? color.blue.dark : fontColor.gray.dark}
      >
        Copy Link
      </Typography>
      {isCopied && (
        <DoneIcon
          fontSize="small"
          sx={{ position: "absolute", top: 0, right: 0 }}
        />
      )}
    </Button>
  );
};

export default CopyLinkButton;
