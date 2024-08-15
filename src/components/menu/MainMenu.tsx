import { FC } from "react";
import { padding } from "../../styles/constants";
import { Box, Grid } from "@mui/material";
import PlainMenu, { type Menu } from "./PlainMenu";

// TODO: implement items abd handlers once the menu function is designed
const MAIN_MENUS: Menu[] = [
  { menuName: "DATA", items: [{ name: "item 1", handler: () => {} }] },
  { menuName: "LEARN", items: [{ name: "item 1", handler: () => {} }] },
  { menuName: "ENGAGE", items: [{ name: "item 1", handler: () => {} }] },
  { menuName: "CONTACT", items: [{ name: "item 1", handler: () => {} }] },
  { menuName: "ABOUT", items: [{ name: "item 1", handler: () => {} }] },
];

const Menu: FC = () => {
  return (
    <Grid
      container
      sx={{
        width: "60%",
        backgroundColor: "transparent",
      }}
    >
      <Grid item xs={12}>
        <Grid container justifyContent="space-between">
          {MAIN_MENUS.map((menu, index) => (
            <Box key={index}>
              <PlainMenu menu={menu} />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Menu;
