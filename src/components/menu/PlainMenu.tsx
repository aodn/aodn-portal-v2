import React, { FC, useCallback, useState } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StyledMenu from "./StyledMenu";
import { disableScroll, enableScroll } from "../../utils/ScrollUtils";

interface MenuItem {
  name: string;
  handler: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface Menu {
  menuName: string;
  items: MenuItem[];
}

interface PlainMenuProps {
  menu: Menu;
}

// TODO: implement onClick for each menu item to trigger handler once the function is designed
const PlainMenu: FC<PlainMenuProps> = ({ menu }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(true);
    setAnchorEl(event.currentTarget);
    disableScroll();
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    enableScroll();
  }, []);

  const handleMenuItemClick = useCallback(
    (item: MenuItem) => (event: React.MouseEvent<HTMLElement>) => {
      item.handler(event);
      handleClose();
    },
    [handleClose]
  );

  return (
    <div>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          backgroundColor: "transparent",
          border: "none",
          color: "#090C02",
          fontSize: "16px",
          fontWeight: 400,
        }}
      >
        {menu.menuName}
      </Button>
      {menu.items.length > 0 && (
        <StyledMenu anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
          {menu.items.map((item, index) => (
            <MenuItem onClick={handleMenuItemClick(item)} key={index}>
              {item.name}
            </MenuItem>
          ))}
        </StyledMenu>
      )}
    </div>
  );
};

export default PlainMenu;
