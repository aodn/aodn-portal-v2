import React, { FC, useCallback, useMemo } from "react";
import { Typography } from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import LinkCard from "../../../../components/list/listItem/subitem/LinkCard";
import { MODE } from "../../../../components/list/CommonDef";
import NaList from "../../../../components/list/NaList";
import { ILink } from "../../../../components/common/store/OGCCollectionDefinitions";
import SideCardContainer from "../side-cards/SideCardContainer";
import { groupBy } from "../../../../utils/ObjectUtils";
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

interface DataAccessPanelProps {
  mode?: MODE;
  type?: TYPE;
}

const TITLE: Map<string, string> = new Map([
  ["wms", "WMS Service Link"],
  ["wfs", "WFS Service Link"],
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
        // Group links by type and display it in blocks
        const grouped: Record<string, ILink[]> = groupBy(
          dataAccessLinks,
          "rel"
        );
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
          >
            {Object.entries(grouped).map(([key, item]: [string, ILink[]]) => (
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
                    <LinkCard key={`ch-${index}`} link={link} icon={false} />
                  ))
                )}
              </Typography>
            ))}
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
            dataAccessLinks={collection?.getDocumentLinks()}
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
      return <NavigatablePanel childrenList={blocks} isLoading={false} />;
  }
};

export default DataAccessPanel;
