import { FC } from "react";
import { Card, Stack } from "@mui/material";
import { borderRadius } from "../../../styles/constants";
import DownloadCard from "./side-cards/DownloadCard";
import SpatialCoverageCard, {
  SpatialCoverageCardProps,
} from "./side-cards/SpatialCoverageCard";
import { useDetailPageContext } from "../context/detail-page-context";
import DataAccessPanel, { TYPE } from "./tab-panels/DataAccessPanel";
import CitationPanel from "./tab-panels/CitationPanel";
import { MODE } from "../../../components/list/CommonDef";
import DownloadServiceCard from "./side-cards/DownloadServiceCard";

interface SideSectionProps extends SpatialCoverageCardProps {}

const SideSection: FC<SideSectionProps> = ({ onSpatialCoverageLayerClick }) => {
  const { isCollectionNotFound, collection } = useDetailPageContext();

  if (isCollectionNotFound) return null;

  return (
    <Stack
      direction={{ xs: "column", sm: "row", md: "column" }}
      gap={2}
      flexWrap="wrap"
    >
      {collection?.hasSummaryFeature() ? (
        <Card
          sx={{
            backgroundColor: "#fff",
            borderRadius: borderRadius.small,
            width: "100%",
          }}
        >
          <DownloadCard />
        </Card>
      ) : (
        <DownloadServiceCard />
      )}

      <DataAccessPanel mode={MODE.COMPACT} type={TYPE.DATA_ACCESS} />
      <SpatialCoverageCard
        onSpatialCoverageLayerClick={onSpatialCoverageLayerClick}
      />
      <CitationPanel mode={MODE.COMPACT} />
    </Stack>
  );
};

export default SideSection;
