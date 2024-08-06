import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ContactItem from "./listItem/ContactItem";
import CollapseItem from "./listItem/CollapseItem";

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
        <CollapseItem
          key={index}
          title={contact.organization + suffix}
          isContactFragment
          email={contact.emails ? contact.emails[0] : undefined}
        >
          <ContactItem contact={contact} />
        </CollapseItem>
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
