import { IContact } from "../../../../types/DataStructureTypes";
import React, { ReactNode, useMemo } from "react";
import BlockList from "./BlockList";
import ContactCard from "./ContactCard";
import CollapseFrame from "./CollapseFrame";

interface ContactBlockProps {
  contacts: IContact[];
}

const ContactBlock: React.FC<ContactBlockProps> = ({ contacts }) => {
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
    <BlockList title="Contacts" childrenList={collapseComponents}></BlockList>
  );
};

export default ContactBlock;