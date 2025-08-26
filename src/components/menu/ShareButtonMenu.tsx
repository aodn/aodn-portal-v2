import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SxProps,
  Typography,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import {
  borderRadius,
  color,
  fontColor,
  fontSize,
  fontWeight,
  gap,
  padding,
} from "../../styles/constants";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { disableScroll, enableScroll } from "../../utils/ScrollUtils";
import useClipboard from "../../hooks/useClipboard";

interface ShareMenuItem {
  name: string;
  icon?: ReactNode;
  handler: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface CopyLinkConfig {
  isCopied: boolean;
  copyUrl: string;
  copyToClipboard: (url: string) => void;
}

// This function generates the menu items for the Share button
// Add more items to this array if needed
// Add configuration for each item if needed
const getItems = ({
  isCopied,
  copyUrl,
  copyToClipboard,
}: CopyLinkConfig): ShareMenuItem[] => [
  {
    name: isCopied ? "Link Copied" : "Copy Link",
    icon: isCopied ? (
      <DoneAllIcon fontSize="small" color="primary" />
    ) : (
      <ContentCopy fontSize="small" color="primary" />
    ),
    handler: () => copyToClipboard(copyUrl),
  },
];

interface ShareButtonProps {
  copyLinkConfig?: CopyLinkConfig;
  hideText?: boolean;
  onClose?: () => void;
  sx?: SxProps;
}

const ShareButtonMenu: FC<ShareButtonProps> = ({
  copyLinkConfig,
  hideText = false,
  onClose,
  sx,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    checkIfCopied: checkIfCopiedDefault,
    copyToClipboard: copyToClipboardDefault,
  } = useClipboard();
  // Generate share URL with UTM parameters for Google Analytics tracking
  // Uses URL API to safely handle existing query parameters (e.g., ?tab=summary)
  const copyUrlDefault = useMemo(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("utm_source", "portal"); // Track source as 'portal'
    url.searchParams.set("utm_medium", "share_link"); // Track medium as 'share_link'
    return url.toString();
  }, []);
  const isCopiedDefault = useMemo(
    () => checkIfCopiedDefault(copyUrlDefault),
    [checkIfCopiedDefault, copyUrlDefault]
  );

  // If no copyLinkConfig is provided, use default values/functions from useClipboard
  const { isCopied, copyUrl, copyToClipboard } = copyLinkConfig || {
    isCopied: isCopiedDefault,
    copyUrl: copyUrlDefault,
    copyToClipboard: copyToClipboardDefault,
  };

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(true);
    setAnchorEl(event.currentTarget);
    disableScroll();
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    enableScroll();
    onClose && onClose();
  }, [onClose]);

  return (
    <>
      <Box
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid="share-button"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          bgcolor: isHovered || isOpen ? color.brightBlue.dark : "#fff",
          borderRadius: borderRadius.small,
          ":hover": { cursor: "pointer" },
          ...sx,
        }}
      >
        <IconButton
          sx={{
            color: isHovered || isOpen ? "#fff" : color.brightBlue.dark,
            ":hover": {
              bgcolor: "transparent",
            },
          }}
        >
          <ShareIcon />
        </IconButton>
        {!hideText && (
          <Typography
            fontSize={fontSize.icon}
            color={isHovered || isOpen ? "#fff" : fontColor.blue.medium}
            fontWeight={fontWeight.bold}
            p={0}
          >
            Share
          </Typography>
        )}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        elevation={1}
        disablePortal
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          width: "auto",
          "& .MuiPaper-root": {
            borderRadius: borderRadius.small,
            marginTop: gap.md,
            minWidth: "200px",

            "& .MuiMenu-list": {
              padding: 0,
            },
          },
        }}
      >
        {getItems({ isCopied, copyUrl, copyToClipboard }).map((item, index) => (
          <MenuItem key={index} onClick={item.handler} data-testid="copy-link">
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>
              <Typography
                padding={padding.extraSmall}
                fontSize={fontSize.info}
                fontWeight={fontWeight.medium}
                color={color.blue.dark}
              >
                {item.name}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ShareButtonMenu;
