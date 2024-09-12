import { IAssociatedRecord } from "../common/store/OGCCollectionDefinitions";
import React, { ReactNode, useCallback, useMemo } from "react";
import CollapseItem from "./listItem/CollapseItem";
import { ButtonBase } from "@mui/material";
import { pageDefault } from "../common/constants";
import ExpandableList from "./ExpandableList";
import TextArea from "./listItem/subitem/TextArea";
import { openInNewTab } from "../../utils/LinkUtils";

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
    openInNewTab(url);
  }, []);

  const collapseComponents: ReactNode[] = useMemo(() => {
    const components: ReactNode[] = [];
    records?.map((record, index) => {
      components.push(
        <CollapseItem title={`${record.title}`} key={index} isAssociatedRecord>
          <ButtonBase
            onClick={() => openRecord(record.uuid)}
            sx={{
              textAlign: "left",
            }}
          >
            <TextArea key={index}>{record.abstract}</TextArea>
          </ButtonBase>
        </CollapseItem>
      );
    });
    return components;
  }, [openRecord, records]);

  return <ExpandableList title={title} childrenList={collapseComponents} />;
};

export default AssociatedRecordList;
