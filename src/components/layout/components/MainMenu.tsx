import { FC } from "react";
import PlainMenu, { type Menu } from "../../menu/PlainMenu";
import { Stack } from "@mui/material";

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
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={8}
    >
      {MAIN_MENUS.map((menu, index) => (
        <PlainMenu menu={menu} key={index} />
      ))}
    </Stack>
  );
};

export default Menu;
