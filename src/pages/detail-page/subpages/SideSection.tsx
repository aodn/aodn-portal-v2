import { FC } from "react";
import { Stack } from "@mui/material";
import DownloadCard from "./side-cards/DownloadCard";
import SpatialCoverageCard, {
  SpatialCoverageCardProps,
} from "./side-cards/SpatialCoverageCard";
import { useDetailPageContext } from "../context/detail-page-context";
import DataAccessPanel, { TYPE } from "./tab-panels/DataAccessPanel";
import CitationPanel from "./tab-panels/CitationPanel";
import { MODE } from "../../../components/list/CommonDef";

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
      <DownloadCard hasSummaryFeature={collection?.hasSummaryFeature()} />
      <DataAccessPanel mode={MODE.COMPACT} type={TYPE.DATA_ACCESS} />
      <SpatialCoverageCard
        onSpatialCoverageLayerClick={onSpatialCoverageLayerClick}
      />
      <CitationPanel mode={MODE.COMPACT} />
    </Stack>
  );
};

export default SideSection;
