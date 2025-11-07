import { FC, useCallback, useMemo } from "react";
import { Typography } from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import LinkCard from "../../../../components/list/listItem/subitem/LinkCard";
import { MODE } from "../../../../components/list/CommonDef";
import NaList from "../../../../components/list/NaList";
import {
  DataAccessSubGroup,
  getSubgroup,
  ILink,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import SideCardContainer from "../side-cards/SideCardContainer";
import { fontWeight, fontSize } from "../../../../styles/constants";
import NavigatablePanel, { NavigatablePanelChild } from "./NavigatablePanel";
import useTabNavigation from "../../../../hooks/useTabNavigation";
import {
  detailPageDefault,
  pageReferer,
} from "../../../../components/common/constants";
import DataList from "../../../../components/list/DataList";
import DocumentList from "../../../../components/list/DocumentLIst";
import OtherItemList from "../../../../components/list/OtherItemList";

export enum TYPE {
  DATA_ACCESS = "DATA_ACCESS",
}

const OPTIMIZED_PYTHON_NOTEBOOK_LINK_TITLE =
  "Access to Jupyter notebook to query Cloud Optimised converted dataset";
const PYTHON_NOTEBOOK_EXAMPLE_LINK_TITLE = "Python notebook Example";

// Only find optimized Python notebook links if they exist, otherwise fall back to example links
const getOptimizedPythonNotebookLinks = (
  links: ILink[] | undefined
): ILink[] | undefined => {
  if (!links) return undefined;

  // First, try to find optimized Python notebook links
  const optimizedLinks = links.filter(
    (link) => link.title === OPTIMIZED_PYTHON_NOTEBOOK_LINK_TITLE
  );

  // If found, return them
  if (optimizedLinks.length > 0) {
    return optimizedLinks;
  }

  // Otherwise, fall back to example links
  const exampleLinks = links.filter(
    (link) => link.title === PYTHON_NOTEBOOK_EXAMPLE_LINK_TITLE
  );

  return exampleLinks.length > 0 ? exampleLinks : undefined;
};

interface DataAccessPanelProps {
  mode?: MODE;
  type?: TYPE;
}

const TITLE: Map<string, string> = new Map([
  [DataAccessSubGroup.WMS, "WMS Service Link"],
  [DataAccessSubGroup.WFS, "WFS Service Link"],
  [DataAccessSubGroup.AWS, "AWS Service Link"],
  [DataAccessSubGroup.THREDDS, "THREDDS Service Link"],
]);

const DataAccessPanel: FC<DataAccessPanelProps> = ({ mode, type }) => {
  const { collection } = useDetailPageContext();
  const goToDetailPage = useTabNavigation();

  const createCompactPanel = useCallback(
    (
      uuid: string | undefined,
      title: string,
      dataAccessLinks: ILink[] | undefined
    ) => {
      if (uuid && dataAccessLinks && dataAccessLinks.length > 0) {
        // Group links by subgroup type
        const grouped: Record<string, ILink[]> = {};

        dataAccessLinks.forEach((link) => {
          const subgroup = getSubgroup(link);
          const key = subgroup || "other";
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(link);
        });

        // Define the display order: WMS, WFS, then other subgroups
        const orderedKeys = [
          DataAccessSubGroup.WMS,
          DataAccessSubGroup.WFS,
          DataAccessSubGroup.AWS,
          DataAccessSubGroup.THREDDS,
          "other",
        ].filter((key) => grouped[key]);

        return (
          <SideCardContainer
            title={title}
            onClick={() =>
              goToDetailPage(
                uuid,
                detailPageDefault.DATA_ACCESS,
                pageReferer.DETAIL_PAGE_REFERER
              )
            }
            px={"10px"}
            py={"16px"}
          >
            {orderedKeys.map((key) => {
              const item = grouped[key];
              return (
                <Typography
                  padding={1}
                  key={`da-${key}`}
                  fontWeight={fontWeight.bold}
                  fontSize={fontSize.slideCardSubTitle}
                >
                  {TITLE.has(key) ? TITLE.get(key) : "Misc Link"}
                  {!item || item.length === 0 ? (
                    <NaList title={title ? title : ""} />
                  ) : (
                    item.map((link: ILink, index: number) => (
                      <LinkCard
                        key={`ch-${index}`}
                        link={link}
                        icon={false}
                        showTitleOnly={true}
                      />
                    ))
                  )}
                </Typography>
              );
            })}
          </SideCardContainer>
        );
      }
    },
    [goToDetailPage]
  );

  const blocks: NavigatablePanelChild[] = useMemo(
    () => [
      {
        title: "Data",
        component: (props: Record<string, any>) => (
          <DataList
            {...props}
            title={"Data"}
            dataAccessLinks={collection?.getDataAccessLinks()}
          />
        ),
      },
      {
        title: "Document",
        component: (props: Record<string, any>) => (
          <DocumentList
            {...props}
            title={"Document"}
            documentLinks={collection?.getDocumentLinks()}
          />
        ),
      },
      {
        title: "Code Tutorials",
        component: (props: Record<string, any>) => (
          <DocumentList
            {...props}
            title={"Code Tutorials"}
            documentLinks={getOptimizedPythonNotebookLinks(
              collection?.getPythonNotebookLinks()
            )}
          />
        ),
      },
      {
        title: "Other",
        component: (props: Record<string, any>) => (
          <OtherItemList
            {...props}
            title={"Other"}
            otherLinks={collection?.getOtherLinks()}
          />
        ),
      },
    ],
    [collection]
  );

  switch (mode) {
    case MODE.COMPACT:
      switch (type) {
        case TYPE.DATA_ACCESS:
        default:
          return createCompactPanel(
            collection?.id,
            "Data Access",
            collection?.getDataAccessLinks()
          );
      }

    case MODE.NORMAL:
    default:
      return (
        <NavigatablePanel
          childrenList={blocks}
          isLoading={false}
          AIGenContent={{
            title: "Link Grouped",
            body: "The data access links are grouped by AI models into a better structure.",
          }}
        />
      );
  }
};

export default DataAccessPanel;
