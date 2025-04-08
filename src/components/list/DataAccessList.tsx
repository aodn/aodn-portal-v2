import { FC } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { ILink } from "../common/store/OGCCollectionDefinitions";
import LinkCard from "./listItem/subitem/LinkCard";
import NaList from "./NaList";

interface DataAccessListProps {
  linksToData?: ILink[];
  dataAccessLinks?: ILink[];
  pythonNotebook?: ILink[];
}

const DataAccessList: FC<DataAccessListProps> = ({
  linksToData = [],
  dataAccessLinks = [],
  pythonNotebook = [],
}) => {
  const pythonNotebookItems = pythonNotebook.map(
    (link: ILink, index: number) => (
      <ItemBaseGrid key={index} sx={{}}>
        <LinkCard key={index} link={link} />
      </ItemBaseGrid>
    )
  );

  const linksToDataItems = linksToData.map((link: ILink, index: number) => (
    <ItemBaseGrid key={index} sx={{}}>
      <LinkCard key={index} link={link} />
    </ItemBaseGrid>
  ));

  const dataAccessItems = dataAccessLinks.map((link: ILink, index: number) => (
    <ItemBaseGrid key={index} sx={{}}>
      <LinkCard key={index} link={link} />
    </ItemBaseGrid>
  ));

  return dataAccessItems ? (
    <>
      <ExpandableList childrenList={linksToDataItems} title="Links" />
      <ExpandableList childrenList={dataAccessItems} title="Data Access List" />
      <ExpandableList
        childrenList={pythonNotebookItems}
        title="Python Notebook"
      />
    </>
  ) : (
    <NaList title={"Data Access"} />
  );
};

export default DataAccessList;
