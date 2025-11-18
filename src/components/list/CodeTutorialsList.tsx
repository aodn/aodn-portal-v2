// CodeTutorialsList is a List component that displays a list of python notebook links
import React from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { ILink } from "../common/store/OGCCollectionDefinitions";
import LinkCard from "./listItem/subitem/LinkCard";
import { CopyButtonConfig } from "../common/buttons/CopyButton";

interface CodeTutorialsListProps extends CopyButtonConfig {
  pythonNotebookLinks?: ILink[];
  title?: string;
  selected?: boolean;
}

const INFO_TIP_CONTENT = {
  title: "Information",
  body: "Links to external resources offering step-by-step coding guides and examples.<br> <br> All efforts have been taken to logically group the links found in the metadata record. If you believe an entry to incorrectly grouped please contact us at info@aodn.org.au",
};

const CodeTutorialsList: React.FC<CodeTutorialsListProps> = ({
  title,
  pythonNotebookLinks,
  selected = false,
  copyButtonConfig,
}) => {
  const pythonNotebookItems = pythonNotebookLinks?.map(
    (link: ILink, index: number) => (
      <ItemBaseGrid key={index}>
        <LinkCard key={index} link={link} copyButtonConfig={copyButtonConfig} />
      </ItemBaseGrid>
    )
  );

  return (
    <ExpandableList
      selected={selected}
      childrenList={pythonNotebookItems}
      title={title}
      info={INFO_TIP_CONTENT}
    />
  );
};

export default CodeTutorialsList;
