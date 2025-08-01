import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ContactArea from "./listItem/subitem/ContactArea";
import CollapseContactItem from "./listItem/CollapseContactItem";
import ExpandableList from "./ExpandableList";

interface CitedResponsiblePartyListProps {
  responsibleParties: IContact[];
  selected?: boolean;
}

const CitedResponsiblePartyList: React.FC<CitedResponsiblePartyListProps> = ({
  responsibleParties,
  selected = false,
}) => {
  const collapseComponents: ReactNode[] = useMemo(
    () =>
      responsibleParties?.map((contact, index) => {
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
    [responsibleParties]
  );

  return (
    <ExpandableList
      selected={selected}
      title={"Cited Responsible Parties"}
      childrenList={collapseComponents}
    ></ExpandableList>
  );
};

export default CitedResponsiblePartyList;
