import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ContactArea from "./listItem/subitem/ContactArea";
import ExpandableList from "./ExpandableList";
import CollapseContactItem from "./listItem/CollapseContactItem";
import { mapContactsToCollapseItems } from "./ContactList";

interface MetadataContactListProps {
  contacts: IContact[];
  selected?: boolean;
}

const MetadataContactList: React.FC<MetadataContactListProps> = ({
  contacts,
  selected = false,
}) => {
  const metadataContacts: ReactNode[] = useMemo(
    () => mapContactsToCollapseItems(contacts),
    [contacts]
  );
  return (
    <ExpandableList
      selected={selected}
      title="Metadata Contact"
      childrenList={metadataContacts}
    />
  );
};

export default MetadataContactList;
