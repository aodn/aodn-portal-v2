import { Typography } from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import LinkCard from "../../../../components/list/listItem/subitem/LinkCard";
import React, { FC, useMemo } from "react";
import { MODE } from "../../../../components/list/CommonDef";
import NaList from "../../../../components/list/NaList";
import { ILink } from "../../../../components/common/store/OGCCollectionDefinitions";
import SideCardContainer from "../side-cards/SideCardContainer";
import { groupBy } from "../../../../utils/ObjectUtils";
import { fontWeight } from "../../../../styles/constants";
import DataAccessList from "../../../../components/list/DataAccessList";
import NavigatablePanel, { NavigatablePanelChild } from "./NavigatablePanel";

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

const createCompactPanel = (title: string, links: ILink[] | undefined) => {
  if (links && links.length > 0) {
    // Group links by type and display it in blocks
    const grouped: Record<string, ILink[]> = groupBy(links, "rel");
    return (
      <SideCardContainer title={title}>
        {Object.entries(grouped).map(([key, item]: [string, ILink[]]) => (
          <Typography
            padding={1}
            key={`da-${key}`}
            fontWeight={fontWeight.bold}
          >
            {TITLE.has(key) ? TITLE.get(key) : "Misc Link"}
            {!item || item.length === 0 ? (
              <NaList title={title ? title : ""} />
            ) : (
              item.map((link: ILink, index: number) => (
                <LinkCard key={index} index={index} link={link} icon={false} />
              ))
            )}
          </Typography>
        ))}
      </SideCardContainer>
    );
  }
};

const DataAccessPanel: FC<DataAccessPanelProps> = ({ mode, type }) => {
  const { collection } = useDetailPageContext();
  const links: ILink[] | undefined = collection?.getDistributionLinks();

  const blocks: NavigatablePanelChild[] = useMemo(
    () => [
      {
        title: "Data Access",
        component: (
          <DataAccessList dataAccessLinks={collection?.getDataAccessLinks()} />
        ),
      },
    ],
    [collection]
  );

  if (links) {
    switch (mode) {
      case MODE.COMPACT:
        switch (type) {
          case TYPE.DATA_ACCESS:
          default:
            return createCompactPanel(
              "Data Access",
              collection?.getDataAccessLinks()
            );
        }

      case MODE.NORMAL:
      default:
        return <NavigatablePanel childrenList={blocks} isLoading={false} />;
    }
  }
};

export default DataAccessPanel;
