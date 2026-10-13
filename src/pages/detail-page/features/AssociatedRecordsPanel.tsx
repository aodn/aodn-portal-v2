import { useMemo } from "react";
import { useDetailPageContext } from "../context/detail-page-context";
import {
  IAssociatedRecord,
  IAssociatedRecordGroup,
  ILink,
  RelationType,
} from "@/app/store/OGCCollectionDefinitions";
import AssociatedRecordList from "../../../components/list/AssociatedRecordList";
import NavigatablePanel, {
  NavigatablePanelChild,
} from "../layout/NavigatablePanel";
import { parseJson } from "../../../utils/Helpers";

const getUuid = (str: string) => {
  if (!str.includes(":") || !str.includes("uuid")) {
    console.error("Invalid uuid string");
  }
  return str.split(":").pop();
};

// Records not exist in the portal (e.g. filtered out by the harvester) are indexed
// with a link to their GeoNetwork record page instead of "uuid:<uuid>"
const isExternalLink = (href: string) => /^https?:\/\//i.test(href);

const generateRecordBy = (link: ILink): IAssociatedRecord | null => {
  const parsed = parseJson(link.title);
  if (parsed) {
    const { title, recordAbstract } = parsed;
    if (isExternalLink(link.href)) {
      return {
        uuid: link.href.split("#/metadata/").pop() ?? "",
        title: title,
        abstract: recordAbstract,
        url: link.href,
      };
    }
    const uuid = getUuid(link.href);
    return {
      uuid: uuid ? uuid : "",
      title: title,
      abstract: recordAbstract,
    };
  } else {
    return null;
  }
};

const AssociatedRecordsPanel = () => {
  const context = useDetailPageContext();
  const links = context.collection?.links;
  const isLoading = !context.collection;

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
        const parent = generateRecordBy(link);
        parent && parents.push(parent);
      }
      if (link.rel === RelationType.CHILD) {
        const child = generateRecordBy(link);
        child && children.push(child);
      }
      if (link.rel === RelationType.SIBLING) {
        const sibling = generateRecordBy(link);
        sibling && siblings.push(sibling);
      }
    });

    return { parents, children, siblings };
  }, [links]);

  const lists: NavigatablePanelChild[] = useMemo(() => {
    const parentsTitle = `Parent ${associatedRecords.parents.length === 1 ? "Record" : "Records"}`;

    return [
      {
        title: parentsTitle,
        component: (props: Record<string, any>) => (
          <AssociatedRecordList
            {...props}
            title={parentsTitle}
            records={associatedRecords.parents}
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
    ];
  }, [
    associatedRecords.children,
    associatedRecords.parents,
    associatedRecords.siblings,
  ]);

  return <NavigatablePanel childrenList={lists} isLoading={isLoading} />;
};
export default AssociatedRecordsPanel;
