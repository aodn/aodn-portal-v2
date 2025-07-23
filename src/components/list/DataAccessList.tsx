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

const INFO_TIP_CONTENT = {
  title: "Information",
  body: "All efforts have been taken to logically group the links found in the metadata record. If you believe an entry to incorrectly grouped please contact us at info@aodn.org.au",
};

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

  //TODO: Remove this when python notebooks are no longer used
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
      <ExpandableList
        childrenList={dataAccessItems}
        navigatable={false}
        title="Data"
        info={INFO_TIP_CONTENT}
      />
      <ExpandableList
        childrenList={documentItems}
        navigatable={false}
        title="Documents"
        info={INFO_TIP_CONTENT}
      />
      {/* comment out python notebook links for now as it is not used */}
      {/* <ExpandableList
        childrenList={pythonNotebookItems}
        navigatable={false}
        title="Code Tutorials"
        info={INFO_TIP_CONTENT}
      /> */}
      <ExpandableList
        childrenList={otherItems}
        navigatable={false}
        title="Other"
        info={INFO_TIP_CONTENT}
      />
    </>
  );
};

export default DataAccessList;
