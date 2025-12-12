import React from "react";
import ExpandableList from "./ExpandableList";
import {
  ILink,
  DataAccessSubGroup,
  getSubgroup,
} from "../common/store/OGCCollectionDefinitions";
import LinkCard from "./listItem/subitem/LinkCard";
import CollapseItem from "./listItem/CollapseItem";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";

interface DataListProps {
  dataAccessLinks?: ILink[];
  title?: string;
  selected?: boolean;
}

const INFO_TIP_CONTENT = {
  title: "Information",
  body: "References to sites or services offering access to the data.",
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

  const linkTitleComponent = (key: number, link: ILink) => (
    <LinkCard key={key} link={link} />
  );

  const dataAccessItems = sortedLinks?.map((link: ILink, index: number) => (
    <>
      <CollapseItem
        key={link.href} // need unique key
        titleComponent={linkTitleComponent(index, link)}
        isOpen
      >
        {link.description && (
          <ExpandableTextArea text={link.description} isExpandable />
        )}
      </CollapseItem>
    </>
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
