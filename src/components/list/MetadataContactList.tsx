import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ContactArea from "./listItem/subitem/ContactArea";
import ExpandableList from "./ExpandableList";
import { Grid, Link, Typography, useTheme } from "@mui/material";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import rc8Theme from "../../styles/themeRC8";
import { MailOutlineIcon } from "../../assets/icons/details/mail";
import CollapseItem from "./listItem/CollapseItem";

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
        <CollapseItem
          key={index}
          title={
            <Link href={`mailto:${email ? email : ""}`}>
              <Typography
                data-testid="metadata-contact-title"
                sx={{ ...rc8Theme.typography.title1Medium, p: 0 }}
              >
                {contact.organization + suffix}
              </Typography>
            </Link>
          }
          icon={<MailOutlineIcon />}
        >
          <ContactArea contact={contact} />
        </CollapseItem>
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
