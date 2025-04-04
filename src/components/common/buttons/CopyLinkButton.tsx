import { FC } from "react";
import { Button, Typography } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontSize,
  padding,
} from "../../../styles/constants";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";

interface CopyLinkButtonProps {
  handleClick: (copyUrl: string) => void;
  hasBeenCopied?: boolean;
  copyUrl: string;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({
  handleClick,
  hasBeenCopied = false,
  copyUrl,
}) => {
  return (
    <Button
      onClick={() => handleClick(copyUrl)}
      data-testid={`copylinkbutton-${copyUrl}`}
      sx={{
        position: "relative",
        px: padding.extraLarge,
        borderRadius: borderRadius.small,
        bgcolor: hasBeenCopied ? color.blue.light : "#fff",
        border: `${border.sm} ${color.blue.darkSemiTransparent}`,
        "&:hover": {
          border: `${border.sm} ${color.blue.dark}`,
          backgroundColor: hasBeenCopied ? "transparent" : "#fff",
        },
      }}
    >
      {hasBeenCopied ? (
        <DoneAllIcon fontSize="small" color="primary" />
      ) : (
        <ContentCopy fontSize="small" color="primary" />
      )}
      <Typography
        sx={{ padding: 0 }}
        fontSize={fontSize.label}
        color={hasBeenCopied ? color.blue.dark : fontColor.gray.dark}
      >
        Copy Link
      </Typography>
    </Button>
  );
};

export default CopyLinkButton;
