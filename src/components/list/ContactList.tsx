import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ContactArea from "./listItem/subitem/ContactArea";
import CollapseContactItem from "./listItem/CollapseContactItem";

interface ContactListProps {
  contacts: IContact[];
}

const ContactList: React.FC<ContactListProps> = ({ contacts }) => {
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
      title={"Contact of Data Owner"}
      childrenList={collapseComponents}
    ></ExpandableList>
  );
};

export default ContactList;
