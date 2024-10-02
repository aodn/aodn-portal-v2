import { IAssociatedRecord } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useCallback, useMemo } from "react";
import { pageDefault } from "../common/constants";
import ExpandableList from "./ExpandableList";
import { openInNewTab } from "../../utils/LinkUtils";
import CollapseAssociatedRecordItem from "./listItem/CollapseAssociatedRecordItem";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import ItemBaseGrid from "./listItem/ItemBaseGrid";

interface AssociatedRecordListProps {
  title: string;
  records: IAssociatedRecord[];
}

const openRecord = (uuid: string) => {
  const searchParams = new URLSearchParams();
  searchParams.append("uuid", uuid);
  const url = pageDefault.details + "?" + searchParams.toString();
  openInNewTab(url);
};

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
  }, [openRecord, records]);

  return <ExpandableList title={title} childrenList={collapseComponents} />;
};

export default AssociatedRecordList;
