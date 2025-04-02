import { Dispatch, FC, SetStateAction, useCallback, useEffect } from "react";
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
import useCopyToClipboard, { on, off } from "../../../hooks/useCopyToClipboard";
import {
  EVENT_CLIPBOARD,
  ClipboardEvent,
} from "../../map/mapbox/controls/menu/Definition";

interface CopyLinkButtonProps {
  index: number;
  setClickedCopyLinkButtonIndex?: Dispatch<SetStateAction<number[]>>;
  copyUrl: string;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({
  index,
  setClickedCopyLinkButtonIndex,
  copyUrl,
}) => {
  const { isCopied, copyToClipboard, resetCopyState } = useCopyToClipboard({
    onCopySuccess: () => {
      setClickedCopyLinkButtonIndex?.((prev) => [...prev, index]);
    },
  });

  const handleClick = useCallback(
    () => copyToClipboard(copyUrl),
    [copyToClipboard, copyUrl]
  );

  useEffect(() => {
    const handleCopyEvent = (event: ClipboardEvent) => {
      // Reset isCopied if this button didn’t initiate the copy
      if (isCopied || event.value !== copyUrl) {
        resetCopyState();
      }
    };

    on(EVENT_CLIPBOARD.COPY, handleCopyEvent);
    return () => {
      off(EVENT_CLIPBOARD.COPY, handleCopyEvent);
    };
  }, [isCopied, copyUrl, resetCopyState]); // Dependencies ensure listener updates correctly

  return (
    <Button
      onClick={handleClick}
      data-testid={`copylinkbutton-copybutton-${index}`}
      sx={{
        position: "relative",
        px: padding.extraLarge,
        borderRadius: borderRadius.small,
        bgcolor: isCopied ? color.blue.light : "#fff",
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
          data-testid={`copylinkbutton-doneicon=${index}`}
          sx={{ position: "absolute", top: 0, right: 0 }}
        />
      )}
    </Button>
  );
};

export default CopyLinkButton;
