import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ContactArea from "./listItem/subitem/ContactArea";
import CollapseContactItem from "./listItem/subitem/CollapseContactItem";

interface ContactListProps {
  title: string;
  contacts: IContact[];
}

const ContactList: React.FC<ContactListProps> = ({ title, contacts }) => {
  const collapseComponents: ReactNode[] = useMemo(() => {
    const returnedList: ReactNode[] = [];
    contacts?.map((contact, index) => {
      const suffix = contact.name ? ` - ${contact.name}` : "";
      returnedList.push(
        <CollapseContactItem
          key={index}
          title={contact.organization + suffix}
          email={contact.emails ? contact.emails[0] : ""}
        >
          <ContactArea contact={contact} />
        </CollapseContactItem>
      );
    });
    return returnedList;
  }, [contacts]);

  return (
    <ExpandableList
      title={title}
      childrenList={collapseComponents}
    ></ExpandableList>
  );
};

export default ContactList;
