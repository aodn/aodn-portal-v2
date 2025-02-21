import React, { FC, useState } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { ILink } from "../common/store/OGCCollectionDefinitions";
import LinkCard from "./listItem/subitem/LinkCard";
import NaList from "./NaList";

interface DataAccessListProps {
  dataAccessLinks?: ILink[];
}

const DataAccessList: FC<DataAccessListProps> = ({ dataAccessLinks }) => {
  const [clickedCopyLinkButtonIndex, setClickedCopyLinkButtonIndex] = useState<
    number[]
  >([]);

  const dataAccessItems = dataAccessLinks?.map((link: ILink, index: number) => (
    <ItemBaseGrid key={index} sx={{}}>
      <LinkCard
        key={index}
        index={index}
        link={link}
        clickedCopyLinkButtonIndex={clickedCopyLinkButtonIndex}
        setClickedCopyLinkButtonIndex={setClickedCopyLinkButtonIndex}
      />
    </ItemBaseGrid>
  ));

  return dataAccessItems ? (
    <ExpandableList childrenList={dataAccessItems} title="Data Access List" />
  ) : (
    <NaList title={"Data Access"} />
  );
};

export default DataAccessList;
