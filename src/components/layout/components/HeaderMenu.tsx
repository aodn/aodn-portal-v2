import { FC, useState } from "react";
import PlainMenu, { type Menu } from "../../menu/PlainMenu";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  Link,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import {
  color,
  fontColor,
  fontSize,
  fontWeight,
  gap,
  margin,
  padding,
} from "../../../styles/constants";
import { openInNewTab } from "../../../utils/LinkUtils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export enum HeaderMenuStyle {
  DROPDOWN_MENU = "DROPDOWN",
  ACCORDION_MENU = "ACCORDION",
}
interface HeaderMenuProps {
  menuStyle: HeaderMenuStyle;
}

const HeaderMenu: FC<HeaderMenuProps> = ({ menuStyle }) => {
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
          handler: () => openInNewTab("https://imos.org.au/"),
        },
        {
          name: "About AODN",
          handler: () =>
            openInNewTab(
              "https://imos.org.au/data/about-the-australian-ocean-data-network"
            ),
        },
        {
          name: "Contact Us",
          handler: () => openInNewTab("mailto:info@aodn.org.au"),
        },
      ],
    },
    {
      menuName: "Resources",
      items: [
        {
          name: "Acknowledging Us",
          handler: () =>
            openInNewTab("https://imos.org.au/resources/acknowledging-us"),
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
            openInNewTab("https://help.aodn.org.au/contributing-data/"),
        },
      ],
    },
  ];

  const renderHeaderDropdownMenu = () => {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {HEADER_MENUS.map((menu, index) => (
          <PlainMenu menu={menu} key={index} />
        ))}
      </Stack>
    );
  };

  const renderHeaderAccordionMenu = () => {
    return HEADER_MENUS.map((menu, index) => (
      <Accordion key={index} data-testid="accordion-menu">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography padding={0} color="#000" fontSize={fontSize.info}>
            {menu.menuName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {menu.items.map((item) => (
            <MenuItem
              key={item.name}
              onClick={(event) => {
                item.handler(event);
              }}
            >
              <Typography padding={0} color="#000" fontSize={fontSize.info}>
                {item.name}
              </Typography>
            </MenuItem>
          ))}
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <>
      {menuStyle === HeaderMenuStyle.DROPDOWN_MENU &&
        renderHeaderDropdownMenu()}
      {menuStyle === HeaderMenuStyle.ACCORDION_MENU &&
        renderHeaderAccordionMenu()}
      <DisclaimerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default HeaderMenu;
