import { IContact } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import { mapContactsToCollapseItems } from "./ContactList";

interface CitedResponsiblePartyListProps {
  responsibleParties: IContact[];
  selected?: boolean;
}

const CitedResponsiblePartyList: React.FC<CitedResponsiblePartyListProps> = ({
  responsibleParties,
  selected = false,
}) => {
  const collapseComponents: ReactNode[] = useMemo(
    () => mapContactsToCollapseItems(responsibleParties),
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
