import { FC, useCallback, useMemo } from "react";
import { Typography } from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import LinkCard from "../../../../components/list/listItem/subitem/LinkCard";
import { MODE } from "../../../../components/list/CommonDef";
import NaList from "../../../../components/list/NaList";
import { ILink } from "../../../../components/common/store/OGCCollectionDefinitions";
import SideCardContainer from "../side-cards/SideCardContainer";
import { groupBy } from "../../../../utils/ObjectUtils";
import { fontWeight, fontSize } from "../../../../styles/constants";
import DataAccessList from "../../../../components/list/DataAccessList";
import NavigatablePanel, { NavigatablePanelChild } from "./NavigatablePanel";
import useTabNavigation from "../../../../hooks/useTabNavigation";
import {
  detailPageDefault,
  pageReferer,
} from "../../../../components/common/constants";

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
    (uuid: string | undefined, title: string, links: ILink[] | undefined) => {
      if (uuid && links && links.length > 0) {
        // Group links by type and display it in blocks
        const grouped: Record<string, ILink[]> = groupBy(links, "rel");
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
                  item.map((link: ILink) => (
                    <LinkCard key={link.href} link={link} icon={false} />
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
        title: "Data Access Options",
        component: (
          <DataAccessList
            linksToData={collection?.getDistributionLinks()}
            dataAccessLinks={collection?.getDataAccessLinks()}
            pythonNotebook={collection?.getPythonNotebook()}
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
