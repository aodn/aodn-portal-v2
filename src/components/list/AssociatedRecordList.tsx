import { IAssociatedRecord } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import { openInNewTab } from "../../utils/LinkUtils";
import CollapseAssociatedRecordItem from "./listItem/CollapseAssociatedRecordItem";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { pageDefault } from "../common/constants";

interface AssociatedRecordListProps {
  title: string;
  records: IAssociatedRecord[];
}

const AssociatedRecordList: React.FC<AssociatedRecordListProps> = ({
  title,
  records,
}) => {
  const collapseComponents: ReactNode[] = useMemo(() => {
    const components: ReactNode[] = [];
    records?.map((record, index) => {
      components.push(
        <ItemBaseGrid key={index}>
          <CollapseAssociatedRecordItem
            titleAction={() =>
              openInNewTab(`${pageDefault.details}/${record.uuid}`)
            }
            title={`${record.title}`}
          >
            <ExpandableTextArea
              text={record.abstract}
              isClickable
              onClick={() =>
                openInNewTab(`${pageDefault.details}/${record.uuid}`)
              }
            />
          </CollapseAssociatedRecordItem>
        </ItemBaseGrid>
      );
    });
    return components;
  }, [records]);

  return <ExpandableList title={title} childrenList={collapseComponents} />;
};

export default AssociatedRecordList;
