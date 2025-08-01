import React, { useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import {
  IAssociatedRecord,
  IAssociatedRecordGroup,
  ILink,
  RelationType,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import AssociatedRecordList from "../../../../components/list/AssociatedRecordList";
import NavigatablePanel, { NavigatablePanelChild } from "./NavigatablePanel";
import { parseJson } from "../../../../utils/Helpers";

const getUuid = (str: string) => {
  if (!str.includes(":") || !str.includes("uuid")) {
    console.error("Invalid uuid string");
  }
  return str.split(":").pop();
};

const generateRecordBy = (link: ILink) => {
  const { title, recordAbstract } = parseJson(link.title);
  const uuid = getUuid(link.href);
  return {
    uuid: uuid ? uuid : "",
    title: title,
    abstract: recordAbstract,
  };
};

const AssociatedRecordsPanel = () => {
  const context = useDetailPageContext();
  const links = context.collection?.links;
  const [isLoading, setIsLoading] = useState(true);

  const associatedRecords: IAssociatedRecordGroup = useMemo(() => {
    const parents: IAssociatedRecord[] = [];
    const children: IAssociatedRecord[] = [];
    const siblings: IAssociatedRecord[] = [];

    links?.forEach((link) => {
      if (link.type != "application/json") {
        return;
      }
      if (link.rel == null) {
        return;
      }
      if (link.rel === RelationType.PARENT) {
        parents.push(generateRecordBy(link));
      }
      if (link.rel === RelationType.CHILD) {
        children.push(generateRecordBy(link));
      }
      if (link.rel === RelationType.SIBLING) {
        siblings.push(generateRecordBy(link));
      }
    });

    if (parents.length > 1) {
      //TODO: handle error when toast is implemented
    }

    return { parent: parents?.[0], children, siblings };
  }, [links]);

  useEffect(() => {
    if (!context.collection) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [context.collection]);

  const lists: NavigatablePanelChild[] = useMemo(
    () => [
      {
        title: "Parent Record",
        component: (props: Record<string, any>) => (
          <AssociatedRecordList
            {...props}
            title={"Parent Record"}
            records={associatedRecords.parent ? [associatedRecords.parent] : []}
          />
        ),
      },
      {
        title: "Associated Records",
        component: (props: Record<string, any>) => (
          <AssociatedRecordList
            {...props}
            title="Associated Records"
            records={associatedRecords.siblings}
          />
        ),
      },
      {
        title: "Sub Records",
        component: (props: Record<string, any>) => (
          <AssociatedRecordList
            {...props}
            title="Sub Records"
            records={associatedRecords.children}
          />
        ),
      },
    ],
    [
      associatedRecords.children,
      associatedRecords.parent,
      associatedRecords.siblings,
    ]
  );

  return <NavigatablePanel childrenList={lists} isLoading={isLoading} />;
};
export default AssociatedRecordsPanel;
