import { FC, ReactNode, useCallback, useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import { disableScroll, enableScroll } from "../../utils/ScrollUtils";

export interface ShareMenuItem {
  name: string;
  icon?: ReactNode;
  handler: (event: React.MouseEvent<HTMLElement>) => void;
}

interface ShareButtonProps {
  menuItems: ShareMenuItem[];
  hideText?: boolean;
  onClose?: () => void;
}

const ShareButtonMenu: FC<ShareButtonProps> = ({
  menuItems,
  hideText = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        height="100%"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        bgcolor={isHovered || isOpen ? color.blue.dark : "#fff"}
        borderRadius={borderRadius.small}
        sx={{
          ":hover": {
            cursor: "pointer",
          },
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
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={item.handler}>
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
