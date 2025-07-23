import { FC } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { ILink } from "../common/store/OGCCollectionDefinitions";
import LinkCard from "./listItem/subitem/LinkCard";
import NaList from "./NaList";

interface DataAccessListProps {
  dataAccessLinks?: ILink[];
  documentLinks?: ILink[];
  pythonNotebookLinks?: ILink[];
  otherLinks?: ILink[];
}

const DataAccessList: FC<DataAccessListProps> = ({
  dataAccessLinks = [],
  documentLinks = [],
  pythonNotebookLinks = [],
  otherLinks = [],
}) => {
  const dataAccessItems = dataAccessLinks.map((link: ILink, index: number) => (
    <ItemBaseGrid key={index}>
      <LinkCard key={index} link={link} />
    </ItemBaseGrid>
  ));

  const documentItems = documentLinks.map((link: ILink, index: number) => (
    <ItemBaseGrid key={index}>
      <LinkCard key={index} link={link} />
    </ItemBaseGrid>
  ));

  const pythonNotebookItems = pythonNotebookLinks.map(
    (link: ILink, index: number) => (
      <ItemBaseGrid key={index}>
        <LinkCard key={index} link={link} />
      </ItemBaseGrid>
    )
  );

  const otherItems = otherLinks.map((link: ILink, index: number) => (
    <ItemBaseGrid key={index}>
      <LinkCard key={index} link={link} />
    </ItemBaseGrid>
  ));

  if (
    dataAccessLinks.length === 0 &&
    documentLinks.length === 0 &&
    pythonNotebookLinks.length === 0 &&
    otherLinks.length === 0
  ) {
    return <NaList title={"Data Access"} />;
  }

  return (
    <>
      <ExpandableList childrenList={dataAccessItems} title="Data" />
      <ExpandableList childrenList={documentItems} title="Documents" />
      {/* comment out python notebook links for now as it is not used */}
      {/* <ExpandableList
        childrenList={pythonNotebookItems}
        title="Code Tutorials"
      /> */}
      <ExpandableList childrenList={otherItems} title="Other" />
    </>
  );
};

export default DataAccessList;
