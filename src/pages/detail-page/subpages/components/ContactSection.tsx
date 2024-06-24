import { IContact } from "../../../../types/DataStructureTypes";
import React, { ReactNode, useMemo } from "react";
import ListSection from "./ListSection";
import ContactCard from "./ContactCard";
import CollapseFrame from "./CollapseFrame";

interface ContactSectionProps {
  contacts: IContact[];
}

const ContactSection: React.FC<ContactSectionProps> = ({ contacts }) => {
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
    <ListSection
      title="Contacts"
      childrenList={collapseComponents}
    ></ListSection>
  );
};

export default ContactSection;
