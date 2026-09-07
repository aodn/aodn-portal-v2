import React, { useEffect, useRef } from "react";
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
  /** Delay in milliseconds after the pointer leaves the tooltip and anchor element. */
  autoCloseDelay?: number;
  hideIconOnSmallScreen?: boolean;
}

const MenuTooltip: React.FC<MenuTooltipProps> = ({
  open,
  anchorEl,
  title,
  description,
  icon,
  onClose,
  autoCloseDelay = 2000,
  hideIconOnSmallScreen = false,
}) => {
  const { isLargeMobile } = useBreakpoint();
  const shouldHideIcon = hideIconOnSmallScreen && isLargeMobile;
  const popperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !anchorEl || !popperRef.current) return;

    const popup = popperRef.current;
    const hovered = new Set(
      [anchorEl, popup].filter((element) => element.matches(":hover"))
    );
    let timer: ReturnType<typeof setTimeout> | undefined;
    const scheduleClose = () => {
      clearTimeout(timer);
      if (hovered.size === 0) timer = setTimeout(onClose, autoCloseDelay);
    };
    const handleEnter = (event: MouseEvent) => {
      hovered.add(event.currentTarget as HTMLElement);
      clearTimeout(timer);
    };
    const handleLeave = (event: MouseEvent) => {
      hovered.delete(event.currentTarget as HTMLElement);
      scheduleClose();
    };

    for (const element of [anchorEl, popup]) {
      element.addEventListener("mouseenter", handleEnter);
      element.addEventListener("mouseleave", handleLeave);
    }
    scheduleClose();

    return () => {
      clearTimeout(timer);
      for (const element of [anchorEl, popup]) {
        element.removeEventListener("mouseenter", handleEnter);
        element.removeEventListener("mouseleave", handleLeave);
      }
    };
  }, [open, anchorEl, onClose, autoCloseDelay]);

  return (
    <Popper
      data-testid="menu-tooltip"
      ref={popperRef}
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
