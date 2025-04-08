import { FC } from "react";
import { Button, SxProps, Typography } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontSize,
  padding,
} from "../../../styles/constants";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";

interface CopyLinkButtonProps {
  handleClick: () => void;
  hasBeenCopied?: boolean;
  copyUrl: string;
  sx?: SxProps;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({
  handleClick,
  hasBeenCopied = false,
  copyUrl,
  sx,
}) => {
  return (
    <Button
      onClick={handleClick}
      data-testid={`copylinkbutton-${copyUrl}`}
      sx={{
        px: padding.medium,
        borderRadius: borderRadius.small,
        bgcolor: "#fff",
        border: `${border.xs} ${color.blue.darkSemiTransparent}`,
        "&:hover": {
          border: `${border.xs} ${color.blue.darkSemiTransparent}`,
          backgroundColor: "#fff",
        },
        ...sx,
      }}
    >
      {hasBeenCopied ? (
        <DoneAllIcon fontSize="small" color="primary" />
      ) : (
        <ContentCopy fontSize="small" color="primary" />
      )}
      <Typography
        sx={{ padding: 0, paddingLeft: padding.small }}
        fontSize={fontSize.label}
        color={color.blue.dark}
      >
        {hasBeenCopied ? "Link Copied" : "Copy Link"}
      </Typography>
    </Button>
  );
};

export default CopyLinkButton;
