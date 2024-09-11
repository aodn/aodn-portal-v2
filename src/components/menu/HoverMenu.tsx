import React, { useState, useRef } from "react";
import {
  Popper,
  Paper,
  MenuList,
  MenuItem,
  Grow,
  ClickAwayListener,
  Button,
} from "@mui/material";
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

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
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
          border: `${border.sm} ${color.blue.dark}`,
          borderRadius: borderRadius.small,
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList
            autoFocusItem={open}
            onKeyDown={handleListKeyDown}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {menu.items.map((item, index) => (
              <MenuItem
                onClick={(event) => {
                  item.handler(event);
                  handleClose(event);
                }}
                key={index}
                sx={{
                  fontSize: fontSize.info,
                  bgcolor: "transparent",
                  ":hover": { bgcolor: color.blue.xLight },
                }}
              >
                {item.name}
              </MenuItem>
            ))}
          </MenuList>
        </ClickAwayListener>
      </Paper>
    </Grow>
  );

  return (
    <>
      <Button
        ref={anchorRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          backgroundColor: "transparent",
          border: "none",
          color: fontColor.blue.dark,
          fontSize: fontSize.info,
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
      >
        {renderMenuItems}
      </Popper>
    </>
  );
};

export default HoverMenu;
