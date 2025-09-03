import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import {
  ILink,
  DataAccessSubGroup,
  getSubgroup,
} from "../common/store/OGCCollectionDefinitions";
import LinkCard from "./listItem/subitem/LinkCard";

interface DataListProps {
  dataAccessLinks?: ILink[];
  title?: string;
  selected?: boolean;
}

const INFO_TIP_CONTENT = {
  title: "Information",
  body: "All efforts have been taken to logically group the links found in the metadata record. If you believe an entry to incorrectly grouped please contact us at info@aodn.org.au",
};

const DataList: React.FC<DataListProps> = ({
  title,
  dataAccessLinks,
  selected = false,
}) => {
  // Sort links by subgroup in the preferred order: WMS, WFS, AWS, THREDDS, then others
  const sortedLinks = dataAccessLinks
    ? [...dataAccessLinks].sort((a, b) => {
        const subgroupA = getSubgroup(a);
        const subgroupB = getSubgroup(b);

        const order = [
          DataAccessSubGroup.WMS,
          DataAccessSubGroup.WFS,
          DataAccessSubGroup.AWS,
          DataAccessSubGroup.THREDDS,
        ];

        const indexA = subgroupA ? order.indexOf(subgroupA) : 999; // Put unknown subgroups at the end
        const indexB = subgroupB ? order.indexOf(subgroupB) : 999;

        return indexA - indexB;
      })
    : undefined;

  const dataAccessItems = sortedLinks?.map((link: ILink, index: number) => (
    <ItemBaseGrid key={index}>
      <LinkCard key={index} link={link} />
    </ItemBaseGrid>
  ));

  return (
    <ExpandableList
      selected={selected}
      childrenList={dataAccessItems}
      title={title}
      info={INFO_TIP_CONTENT}
    />
  );
};

export default DataList;
