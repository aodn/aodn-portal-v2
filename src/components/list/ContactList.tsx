import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ContactArea from "./listItem/subitem/ContactArea";
import CollapseContactItem from "./listItem/CollapseContactItem";

interface ContactListProps {
  contacts: IContact[];
  selected?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selected = false,
}) => {
  const collapseComponents: ReactNode[] = useMemo(
    () =>
      contacts?.map((contact, index) => {
        const suffix = contact.name ? ` - ${contact.name}` : "";
        return (
          <CollapseContactItem
            key={index}
            title={contact.organization + suffix}
            email={contact.emails ? contact.emails[0] : ""}
          >
            <ContactArea contact={contact} />
          </CollapseContactItem>
        );
      }) || [],
    [contacts]
  );

  return (
    <ExpandableList
      selected={selected}
      title={"Data Contact"}
      childrenList={collapseComponents}
    ></ExpandableList>
  );
};

export default ContactList;
