import { FC, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PlainMenu, { type Menu } from "../../menu/PlainMenu";
import { IconButton, Stack } from "@mui/material";
import StyledMenu from "../../menu/StyledMenu";

// TODO: implement items abd handlers once the menu function is designed
const MAIN_MENUS: Menu[] = [
  { menuName: "DATA", items: [{ name: "item 1", handler: () => {} }] },
  { menuName: "LEARN", items: [{ name: "item 1", handler: () => {} }] },
  { menuName: "ENGAGE", items: [{ name: "item 1", handler: () => {} }] },
  { menuName: "CONTACT", items: [{ name: "item 1", handler: () => {} }] },
  { menuName: "ABOUT", items: [{ name: "item 1", handler: () => {} }] },
];

interface MainMenuProps {
  isCollapsed?: boolean;
}

const renderMenu = () => (
  <Stack direction="row" justifyContent="end" alignItems="center" spacing={1}>
    {MAIN_MENUS.map((menu, index) => (
      <PlainMenu menu={menu} key={index} />
    ))}
  </Stack>
);

const Menu: FC<MainMenuProps> = ({ isCollapsed }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isCollapsed)
    return (
      <>
        <IconButton onClick={handleClick} color="primary">
          <MenuIcon />
        </IconButton>
        <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {renderMenu()}
        </StyledMenu>
      </>
    );
  return renderMenu();
};

export default Menu;
