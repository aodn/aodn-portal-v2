import { IAssociatedRecord } from "../common/store/OGCCollectionDefinitions";
import React, { memo, ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import { openInNewTab } from "../../utils/LinkUtils";
import CollapseItem from "./listItem/CollapseItem";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import { pageDefault } from "../common/constants";
import rc8Theme from "../../styles/themeRC8";
import { TitleChainIcon } from "../../assets/icons/details/link";

interface AssociatedRecordListProps {
  title: string;
  records: IAssociatedRecord[];
  selected?: boolean;
}

const openRecord = (uuid: string) => {
  openInNewTab(`${pageDefault.details}/${uuid}`);
};

const AssociatedRecordList: React.FC<AssociatedRecordListProps> =
  memo<AssociatedRecordListProps>(
    ({ title, records, selected = false }: AssociatedRecordListProps) => {
      const collapseComponents: ReactNode[] = useMemo(() => {
        return (
          records?.map((record, index) => (
            <CollapseItem
              key={index}
              title={`${record.title}`}
              icon={<TitleChainIcon />}
              expandedIcon={<TitleChainIcon />}
              onIconClick={() => openRecord(record.uuid)}
              titleColor={rc8Theme.palette.primary1}
            >
              <ExpandableTextArea
                text={record.abstract}
                isClickable
                onClick={() => openRecord(record.uuid)}
              />
            </CollapseItem>
          )) || []
        );
      }, [records]);

      return (
        <ExpandableList
          selected={selected}
          title={title}
          childrenList={collapseComponents}
        />
      );
    }
  );

AssociatedRecordList.displayName = "AssociatedRecordList";
export default AssociatedRecordList;
