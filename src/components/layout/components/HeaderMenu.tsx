import { FC, useState } from "react";
import { type Menu } from "../../menu/PlainMenu";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import HoverMenu from "../../menu/HoverMenu";
import {
  color,
  fontColor,
  fontWeight,
  gap,
  margin,
  padding,
} from "../../../styles/constants";

const HeaderMenu: FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // Leave this component here because it is one of the menu items
  const DisclaimerDialog: FC<{ open: boolean; onClose: () => void }> = ({
    open,
    onClose,
  }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogActions sx={{ position: "absolute", right: gap.sm }}>
        <Button onClick={onClose}>X</Button>
      </DialogActions>
      <Box
        display="flex"
        justifyContent="center"
        width="100%"
        paddingY={padding.medium}
      >
        <Typography
          padding={0}
          color={fontColor.blue.dark}
          fontWeight={fontWeight.bold}
        >
          Disclaimer
        </Typography>
      </Box>
      <Box
        width="100%"
        padding={padding.medium}
        bgcolor={color.blue.xLight}
        marginBottom={margin.xxlg}
      >
        <Typography padding={0}>
          You accept all risks and responsibility for losses, damages, costs and
          other consequences resulting directly or indirectly from using this
          site and any information or material available from it.
          <br />
          <br />
          If you have any concerns about the veracity of the data, please make
          enquiries via&nbsp;
          <Link href={"mailto:info@aodn.org.au"}>info@aodn.org.au</Link>&nbsp;to
          be directed to the data custodian.
        </Typography>
      </Box>
    </Dialog>
  );

  const HEADER_MENUS: Menu[] = [
    {
      menuName: "About Us",
      items: [
        {
          name: "About IMOS",
          handler: () => window.open("https://imos.org.au/"),
        },
        {
          name: "About AODN",
          handler: () =>
            window.open(
              "https://imos.org.au/data/about-the-australian-ocean-data-network"
            ),
        },
        {
          name: "Contact Us Email",
          handler: () => window.open("mailto:info@aodn.org.au"),
        },
      ],
    },
    {
      menuName: "Resources",
      items: [
        {
          name: "Acknowledging Us",
          handler: () =>
            window.open("https://imos.org.au/resources/acknowledging-us"),
        },
        {
          name: "Disclaimer",
          handler: () => {
            setDialogOpen(true);
            return null;
          },
        },
        {
          name: "Contributing Data",
          handler: () =>
            window.open("https://help.aodn.org.au/contributing-data/"),
        },
      ],
    },
  ];

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        {HEADER_MENUS.map((menu, index) => (
          <HoverMenu menu={menu} key={index} />
        ))}
      </Stack>
      <DisclaimerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default HeaderMenu;
