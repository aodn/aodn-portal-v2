import { IAssociatedRecord } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useCallback, useMemo } from "react";
import CollapseItem from "./listItem/CollapseItem";
import PlainTextItem from "./listItem/PlainTextItem";
import { ButtonBase } from "@mui/material";
import { pageDefault } from "../common/constants";
import ExpandableList from "./ExpandableList";

interface AssociatedRecordListProps {
  title: string;
  records: IAssociatedRecord[];
}

const AssociatedRecordList: React.FC<AssociatedRecordListProps> = ({
  title,
  records,
}) => {
  const openRecord = useCallback((uuid: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append("uuid", uuid);
    const url = pageDefault.details + "?" + searchParams.toString();
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const collapseComponents: ReactNode[] = useMemo(() => {
    const components: ReactNode[] = [];
    records?.map((record, index) => {
      components.push(
        <CollapseItem title={record.title} key={index}>
          <PlainTextItem key={index}>
            <ButtonBase onClick={() => openRecord(record.uuid)}>
              {record.abstract}
            </ButtonBase>
          </PlainTextItem>
        </CollapseItem>
      );
    });
    return components;
  }, [openRecord, records]);

  return <ExpandableList title={title} childrenList={collapseComponents} />;
};

export default AssociatedRecordList;
