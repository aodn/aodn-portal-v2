import { Dispatch, SetStateAction } from "react";
import { Button, Typography } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontSize,
  padding,
} from "../../../styles/constants";
import DoneIcon from "@mui/icons-material/Done";
import useCopyToClipboard from "../../../hooks/useCopyToClipboard";

const CopyLinkButton = ({
  index,
  setClickedCopyLinkButtonIndex,
  copyUrl,
}: {
  index: number;
  setClickedCopyLinkButtonIndex: Dispatch<SetStateAction<number[]>>;
  copyUrl: string;
}) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    onCopySuccess: () => {
      setClickedCopyLinkButtonIndex((prev) => [...prev, index]);
    },
  });
  return (
    <Button
      onClick={() => copyToClipboard(copyUrl)}
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
        fontSize={fontSize.label}
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
