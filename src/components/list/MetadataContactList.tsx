import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ContactArea from "./listItem/subitem/ContactArea";
import ExpandableList from "./ExpandableList";
import { Grid, Link, Typography, useTheme } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import rc8Theme from "../../styles/themeRC8";

interface MetadataContactListProps {
  contacts: IContact[];
  selected?: boolean;
}

const MetadataContactList: React.FC<MetadataContactListProps> = ({
  contacts,
  selected = false,
}) => {
  const theme = useTheme();
  const metadataContacts: ReactNode[] = useMemo(() => {
    const contactsToAdd: ReactNode[] = [];
    contacts?.map((contact, index) => {
      const suffix = contact.name ? ` - ${contact.name}` : "";
      const email = contact?.emails?.[0];
      contactsToAdd.push(
        <ItemBaseGrid
          key={index}
          sx={{
            display: "block",
            alignItems: "center",
            justifyContent: "space-between",
            py: "10px",
          }}
        >
          <Grid item container md={12} sx={{ marginBottom: theme.mp.md }}>
            <Grid item container md={1}>
              <MailOutlineIcon />
            </Grid>
            <Grid item md={11} sx={{ textAlign: "left", whiteSpace: "normal" }}>
              <Link href={`mailto:${email ? email : ""}`}>
                <Typography
                  data-testid="metadata-contact-title"
                  sx={{ ...rc8Theme.typography.title1Medium, p: 0 }}
                >
                  {contact.organization + suffix}
                </Typography>
              </Link>
            </Grid>
          </Grid>
          <ContactArea contact={contact} />
        </ItemBaseGrid>
      );
    });
    return contactsToAdd;
  }, [contacts, theme.mp.md]);

  return (
    <ExpandableList
      selected={selected}
      title="Metadata Contact"
      childrenList={metadataContacts}
    />
  );
};

export default MetadataContactList;
