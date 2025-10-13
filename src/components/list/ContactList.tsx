import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ContactArea from "./listItem/subitem/ContactArea";
import CollapseContactItem from "./listItem/CollapseContactItem";

interface ContactListProps {
  contacts: IContact[];
  selected?: boolean;
}

export const mapContactsToCollapseItems = (
  contacts: IContact[]
): ReactNode[] => {
  return (
    contacts?.map((contact, index) => {
      const organization = contact.organization ?? "";
      const suffix = contact.name ?? "";
      const title =
        organization && suffix
          ? `${organization} - ${suffix}`
          : organization + suffix;
      const email = contact.emails?.[0] ?? "";

      return (
        <CollapseContactItem key={index} title={title} email={email}>
          <ContactArea contact={contact} />
        </CollapseContactItem>
      );
    }) || []
  );
};

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selected = false,
}) => {
  const collapseComponents: ReactNode[] = useMemo(
    () => mapContactsToCollapseItems(contacts),
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
