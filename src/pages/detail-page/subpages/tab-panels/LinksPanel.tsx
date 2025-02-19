import { Paper, Typography } from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import LinkCard from "../../../../components/list/listItem/subitem/LinkCard";
import React, { FC, useState } from "react";
import { MODE } from "../../../../components/list/CommonDef";
import NaList from "../../../../components/list/NaList";
import { ILink } from "../../../../components/common/store/OGCCollectionDefinitions";
import SideCardContainer from "../side-cards/SideCardContainer";
import { groupBy } from "../../../../utils/ObjectUtils";
import { fontWeight } from "../../../../styles/constants";

export enum TYPE {
  DATA_ACCESS = "DATA_ACCESS",
}

interface LinksPanelProps {
  mode?: MODE;
  type?: TYPE;
}

const TITLE: Map<string, string> = new Map([["wms", "WMS/GIS Service Link"]]);

const createCompactLinks = (title: string, links: ILink[] | undefined) => {
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

const LinksPanel: FC<LinksPanelProps> = ({ mode, type }) => {
  const { collection } = useDetailPageContext();
  const links: ILink[] | undefined = collection?.getDistributionLinks();
  const [clickedCopyLinkButtonIndex, setClickedCopyLinkButtonIndex] = useState<
    number[]
  >([]);

  if (links) {
    switch (mode) {
      case MODE.COMPACT:
        switch (type) {
          case TYPE.DATA_ACCESS:
          default:
            return createCompactLinks(
              "Data Access",
              collection?.getDataAccessLinks()
            );
        }

      case MODE.NORMAL:
      default:
        return (
          <Paper elevation={0}>
            {links.map((link: ILink, index: number) => (
              <LinkCard
                key={index}
                index={index}
                link={link}
                clickedCopyLinkButtonIndex={clickedCopyLinkButtonIndex}
                setClickedCopyLinkButtonIndex={setClickedCopyLinkButtonIndex}
              />
            ))}
          </Paper>
        );
    }
  }
};

export default LinksPanel;
