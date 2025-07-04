import Menu, { MenuProps } from "@mui/material/Menu";
import { styled } from "@mui/material/styles";
import {
  border,
  borderRadius,
  color,
  fontSize,
  gap,
} from "../../styles/constants";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    sx={{
      "& .MuiMenuItem-root": {
        minWidth: "180px",
        color: "#090C02",
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: "24px",
        "&:hover": {
          backgroundColor: color.blue.light,
        },
      },
    }}
    {...props}
  />
))(() => ({
  "& .MuiPaper-root": {
    backgroundColor: "#fff",
    border: `${border.xs} #3B6E8F`,
    borderRadius: borderRadius.small,
    gap: "12px",

    "& .MuiMenu-list": {
      padding: "10px 0",
    },
  },
}));

export default StyledMenu;
