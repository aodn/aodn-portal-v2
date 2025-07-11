import { IAssociatedRecord } from "../common/store/OGCCollectionDefinitions";
import React, { memo, ReactNode, useMemo } from "react";
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

const openRecord = (uuid: string) => {
  openInNewTab(`${pageDefault.details}/${uuid}`);
};

const AssociatedRecordList: React.FC<AssociatedRecordListProps> =
  memo<AssociatedRecordListProps>(
    ({ title, records }: AssociatedRecordListProps) => {
      const collapseComponents: ReactNode[] = useMemo(() => {
        const components: ReactNode[] = [];
        records?.map((record, index) => {
          components.push(
            <ItemBaseGrid key={index}>
              <CollapseAssociatedRecordItem
                titleAction={() => openRecord(record.uuid)}
                title={`${record.title}`}
              >
                <ExpandableTextArea
                  text={record.abstract}
                  isClickable
                  onClick={() => openRecord(record.uuid)}
                />
              </CollapseAssociatedRecordItem>
            </ItemBaseGrid>
          );
        });
        return components;
      }, [records]);

      return <ExpandableList title={title} childrenList={collapseComponents} />;
    }
  );

AssociatedRecordList.displayName = "AssociatedRecordList";
export default AssociatedRecordList;
