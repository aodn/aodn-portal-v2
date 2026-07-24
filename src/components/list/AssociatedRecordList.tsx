import { IAssociatedRecord, ILink } from "@/app/api/ogcCollectionTypes";
import React, { memo, ReactNode, useMemo } from "react";
import ExpandableList from "./ExpandableList";
import CollapseItem from "./list-item/CollapseItem";
import ExpandableTextArea from "./list-item/sub-item/ExpandableTextArea";
import LinkCard from "./list-item/sub-item/LinkCard";
import { pageDefault } from "../common/constants";
import { IconLink } from "../icon/IconLink";

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
                href: `${window.location.origin}${pageDefault.details}/${record.uuid}`,
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
