import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDetailPageContext } from "../../context/detail-page-context";
import {
  IAssociatedRecord,
  IAssociatedRecordGroup,
  ILink,
  RelationType,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import AssociatedRecordList from "../../../../components/list/AssociatedRecordList";
import NavigatablePanel from "./NavigatablePanel";
import { parseJson } from "../../../../utils/Helpers";

const AssociatedRecordsPanel = () => {
  const context = useDetailPageContext();
  const links = context.collection?.links;
  const [isLoading, setIsLoading] = useState(true);

  const getUuid = (str: string) => {
    if (!str.includes(":") || !str.includes("uuid")) {
      console.error("Invalid uuid string");
    }
    return str.split(":").pop();
  };

  const generateRecordBy = useCallback((link: ILink) => {
    const { title, recordAbstract } = parseJson(link.title);
    const uuid = getUuid(link.href);
    return {
      uuid: uuid ? uuid : "",
      title: title,
      abstract: recordAbstract,
    };
  }, []);

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
  }, [generateRecordBy, links]);

  useEffect(() => {
    if (!context.collection) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [context.collection]);

  const lists = useMemo(
    () => [
      {
        title: "Parent Record",
        component: (
          <AssociatedRecordList
            title={"Parent Record"}
            records={associatedRecords.parent ? [associatedRecords.parent] : []}
          />
        ),
      },
      {
        title: "Sibling Records",
        component: (
          <AssociatedRecordList
            title={"Sibling Records"}
            records={associatedRecords.siblings}
          />
        ),
      },
      {
        title: "Child Records",
        component: (
          <AssociatedRecordList
            title={"Child Records"}
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
