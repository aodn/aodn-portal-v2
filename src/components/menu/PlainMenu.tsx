import { FC, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { fontColor, fontSize, gap } from "../../styles/constants";

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

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#fff",
    borderRadius: theme.borderRadius.sm,
    marginTop: gap.xs,
    minWidth: "100px",

    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      fontSize: fontSize.label,
    },
  },
}));

// TODO: implement onClick for each menu item to trigger handler once the function is designed
const PlainMenu: FC<PlainMenuProps> = ({ menu }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
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
      {menu.items.length > 0 && (
        <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {menu.items.map((item, index) => (
            <MenuItem onClick={handleClose} key={index}>
              {item.name}
            </MenuItem>
          ))}
        </StyledMenu>
      )}
    </div>
  );
};

export default PlainMenu;
