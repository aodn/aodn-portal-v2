import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ContactArea from "./listItem/subitem/ContactArea";
import ExpandableList from "./ExpandableList";
import CollapseContactItem from "./listItem/CollapseContactItem";

interface MetadataContactListProps {
  contacts: IContact[];
  selected?: boolean;
}

const MetadataContactList: React.FC<MetadataContactListProps> = ({
  contacts,
  selected = false,
}) => {
  const metadataContacts: ReactNode[] = useMemo(() => {
    const contactsToAdd: ReactNode[] = [];
    contacts?.map((contact, index) => {
      const suffix = contact.name ? ` - ${contact.name}` : "";
      const email = contact?.emails?.[0] || "";
      const title = contact.organization + suffix;

      contactsToAdd.push(
        <CollapseContactItem key={index} title={title} email={email}>
          <ContactArea contact={contact} />
        </CollapseContactItem>
      );
    });
    return contactsToAdd;
  }, [contacts]);

  return (
    <ExpandableList
      selected={selected}
      title="Metadata Contact"
      childrenList={metadataContacts}
    />
  );
};

export default MetadataContactList;
