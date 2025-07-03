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
        minWidth: "140px",
        color: "#090C02",
        fontSize: "16px",
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
    border: `${border.xs} ${color.blue.dark}`,
    borderRadius: borderRadius.small,
    marginTop: gap.md,
    minWidth: "100px",

    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      fontSize: fontSize.label,
    },
  },
}));

export default StyledMenu;
