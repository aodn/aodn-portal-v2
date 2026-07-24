import { IContact } from "@/app/api/ogcCollectionTypes";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
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
