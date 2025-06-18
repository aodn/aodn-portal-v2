import React, { useState, useRef } from "react";
import { Popper, Paper, MenuList, MenuItem, Grow, Button } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontSize,
} from "../../styles/constants";

interface MenuItem {
  name: string;
  handler: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface Menu {
  menuName: string;
  items: MenuItem[];
}

interface HoverMenuProps {
  menu: Menu;
}

const HoverMenu: React.FC<HoverMenuProps> = ({ menu }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const renderMenuItems = ({
    TransitionProps,
  }: {
    TransitionProps?: Partial<TransitionProps>;
  }) => (
    <Grow {...TransitionProps}>
      <Paper
        elevation={0}
        sx={{
          border: `${border.xs} ${color.blue.dark}`,
          borderRadius: borderRadius.small,
        }}
      >
        <MenuList
          onKeyDown={handleListKeyDown}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          data-testid="hover-menu"
        >
          {menu.items.map((item, index) => (
            <MenuItem
              onClick={(event) => {
                item.handler(event);
                handleClose();
              }}
              key={index}
              sx={{
                fontSize: fontSize.info,
                bgcolor: "transparent",
                ":hover": { bgcolor: color.blue.xLight },
              }}
              data-testid={`hover-menu-item-${item.name}`}
            >
              {item.name}
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
    </Grow>
  );

  return (
    <>
      <Button
        ref={anchorRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(true)}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          backgroundColor: "transparent",
          border: "none",
          color: fontColor.blue.dark,
          fontSize: fontSize.label,
        }}
      >
        {menu.menuName}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 99 }}
      >
        {renderMenuItems}
      </Popper>
    </>
  );
};

export default HoverMenu;
