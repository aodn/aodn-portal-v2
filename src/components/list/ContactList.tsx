import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ContactArea from "./listItem/subitem/ContactArea";
import CollapseItem from "./listItem/CollapseItem";
import CollapseContactItemTitle from "./listItem/subitem/CollapseContactItemTItle";
import { Grid } from "@mui/material";

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
        <CollapseItem
          key={index}
          titleComponent={
            <CollapseContactItemTitle email={email} text={title} />
          }
        >
          <Grid container item md={12}>
            <ContactArea contact={contact} />
          </Grid>
        </CollapseItem>
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
