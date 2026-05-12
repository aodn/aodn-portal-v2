import React from "react";
import { Box, Popper, Typography, ClickAwayListener } from "@mui/material";
import MenuTitle from "./MenuTitle";
import {
  switcherMenuBoxSx,
  switcherMenuContentBoxSx,
  switcherMenuContentLabelTypographySx,
} from "./MenuControl";
import useBreakpoint from "../../../../../hooks/useBreakpoint";

interface MenuTooltipProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClose: () => void;
  hideIconOnSmallScreen?: boolean;
}

const MenuTooltip: React.FC<MenuTooltipProps> = ({
  open,
  anchorEl,
  title,
  description,
  icon,
  onClose,
  hideIconOnSmallScreen = false,
}) => {
  const { isLargeMobile } = useBreakpoint();
  const shouldHideIcon = hideIconOnSmallScreen && isLargeMobile;

  return (
    <Popper
      disablePortal
      open={open}
      anchorEl={anchorEl}
      placement="left-start"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ]}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Box sx={switcherMenuBoxSx}>
          <MenuTitle title={title} onClose={onClose} />
          <Box
            sx={{
              ...switcherMenuContentBoxSx,
              display: "grid",
              gridTemplateColumns: shouldHideIcon ? "1fr" : "auto 1fr",
              gap: 2,
              alignItems: "start",
            }}
          >
            {!shouldHideIcon && <Box sx={{ mt: "4px" }}>{icon}</Box>}
            <Typography
              sx={{
                ...switcherMenuContentLabelTypographySx,
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </ClickAwayListener>
    </Popper>
  );
};

export default MenuTooltip;
