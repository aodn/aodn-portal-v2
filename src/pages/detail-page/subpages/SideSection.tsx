import { FC } from "react";
import { Card, Stack } from "@mui/material";
import { useDetailPageContext } from "../context/detail-page-context";
import { MODE } from "../../../components/list/CommonDef";
import { ILink } from "../../../components/common/store/OGCCollectionDefinitions";
import DownloadCard from "./side-cards/DownloadCard";
import DownloadWFSCard from "./side-cards/DownloadWFSCard";
import DataAccessPanel, { TYPE } from "./tab-panels/DataAccessPanel";
import SpatialCoverageCard, {
  SpatialCoverageCardProps,
} from "./side-cards/SpatialCoverageCard";
import CitationPanel from "./tab-panels/CitationPanel";
import { borderRadius } from "../../../styles/constants";

interface SideSectionProps extends SpatialCoverageCardProps {}

const SideSection: FC<SideSectionProps> = ({ onSpatialCoverageLayerClick }) => {
  const { isCollectionNotFound, collection } = useDetailPageContext();
  const WFSLinks: ILink[] | undefined = collection
    ?.getDataAccessLinks()
    ?.filter((link) => link.rel === "wfs");

  if (isCollectionNotFound) return null;

  return (
    <Stack
      direction={{ xs: "column", sm: "row", md: "column" }}
      gap={2}
      flexWrap="wrap"
    >
      {collection?.hasSummaryFeature() ? (
        <DownloadCard hasSummaryFeature={collection?.hasSummaryFeature()} />
      ) : WFSLinks && WFSLinks.length !== 0 ? (
        <Card
          sx={{
            backgroundColor: "#fff",
            borderRadius: borderRadius.small,
            width: "100%",
          }}
        >
          <DownloadWFSCard WFSLinks={WFSLinks} uuid={collection?.id} />
        </Card>
      ) : null}

      <DataAccessPanel mode={MODE.COMPACT} type={TYPE.DATA_ACCESS} />
      <SpatialCoverageCard
        onSpatialCoverageLayerClick={onSpatialCoverageLayerClick}
      />
      <CitationPanel mode={MODE.COMPACT} />
    </Stack>
  );
};

export default SideSection;
