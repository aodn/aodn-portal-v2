import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import TextItem from "./listItem/TextItem";
import ContactArea from "./listItem/subitem/ContactArea";
import ExpandableList from "./ExpandableList";
import { Grid, Link, Typography, useTheme } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

interface MetadataContactListProps {
  contacts: IContact[];
}

const MetadataContactList: React.FC<MetadataContactListProps> = ({
  contacts,
}) => {
  const theme = useTheme();
  const metadataContacts: ReactNode[] = useMemo(() => {
    const contactsToAdd: ReactNode[] = [];
    contacts?.map((contact, index) => {
      const suffix = contact.name ? ` - ${contact.name}` : "";
      contactsToAdd.push(
        <TextItem key={index}>
          <Grid item container md={12} sx={{ marginBottom: theme.mp.md }}>
            <Grid
              item
              container
              md={1}
              justifyContent="center"
              alignItems="center"
            >
              <MailOutlineIcon />
            </Grid>
            <Grid item md={11} sx={{ textAlign: "left", whiteSpace: "normal" }}>
              <Link href={`mailto:${contact.emails[0]}`}>
                <Typography variant="detailTitle">
                  {contact.organization + suffix}
                </Typography>
              </Link>
            </Grid>
          </Grid>
          <ContactArea contact={contact} />
        </TextItem>
      );
    });
    return contactsToAdd;
  }, [contacts, theme.mp.md]);

  return (
    <ExpandableList title="Metadata Contact" childrenList={metadataContacts} />
  );
};

export default MetadataContactList;
