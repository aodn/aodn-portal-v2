import { IContact } from "../../../../components/common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ContactCard from "./ContactCard";
import CollapseFrame from "./CollapseFrame";

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
        <CollapseFrame
          key={index}
          title={contact.organization + suffix}
          isContactFragment
          email={contact.emails[0]}
        >
          <ContactCard contact={contact} />
        </CollapseFrame>
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
