import { FC, useCallback, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  borderRadius,
  color,
  fontColor,
  fontSize,
  padding,
} from "../../../styles/constants";
import HeaderMenu, { HeaderMenuStyle } from "./HeaderMenu";
import { disableScroll, enableScroll } from "../../../utils/ScrollUtils";

const HeaderIconMenu: FC = () => {
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

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          backgroundColor: "transparent",
          border: "none",
          color: fontColor.blue.dark,
          fontSize: fontSize.label,
        }}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        elevation={1}
        disablePortal
        sx={{
          "& .MuiPaper-root": {
            borderRadius: borderRadius.small,
            backgroundColor: color.blue.medium,
            fontSize: fontSize.label,
            boxShadow: "none",
            "&::before": {
              display: "none",
            },
          },
          "& .MuiAccordion-root.Mui-expanded": {
            margin: 0,
          },
          "& .MuiMenu-list": {
            padding: 0,
          },
          "& .MuiMenuItem-root": {
            paddingLeft: padding.double,
            backgroundColor: color.blue.light,
          },
          "& .MuiAccordionDetails-root": {
            padding: 0,
          },
        }}
      >
        <HeaderMenu menuStyle={HeaderMenuStyle.ACCORDION_MENU} />
      </Menu>
    </>
  );
};

export default HeaderIconMenu;
