import {
  IAssociatedRecord,
  ILink,
} from "../common/store/OGCCollectionDefinitions";
import React, { memo, ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import CollapseItem from "./listItem/CollapseItem";
import ExpandableTextArea from "./listItem/subitem/ExpandableTextArea";
import LinkCard from "./listItem/subitem/LinkCard";
import { pageDefault } from "../common/constants";
import { IconLink } from "../../assets/icons/link";

interface AssociatedRecordListProps {
  title: string;
  records: IAssociatedRecord[];
  selected?: boolean;
}

const linkTitleComponent = (key: number, link: ILink) => (
  <LinkCard key={key} link={link} />
);

const AssociatedRecordList: React.FC<AssociatedRecordListProps> =
  memo<AssociatedRecordListProps>(
    ({ title, records, selected = false }: AssociatedRecordListProps) => {
      const collapseComponents: ReactNode[] = useMemo(() => {
        return (
          records?.map((record, index) => (
            <CollapseItem
              key={index}
              titleComponent={linkTitleComponent(index, {
                rel: "",
                href: `${pageDefault.details}/${record.uuid}`,
                title: record.title,
                type: "",
                description: record.abstract,
                getIcon: () => IconLink,
              } as ILink)}
            >
              <ExpandableTextArea
                text={record.abstract}
                isExpandable
                lineClampConfig={{
                  default: 5,
                  tablet: 4,
                  mobile: 3,
                }}
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
