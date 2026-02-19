import { FC } from "react";
import { Stack } from "@mui/material";
import { useDetailPageContext } from "../context/detail-page-context";
import { MODE } from "../../../components/list/CommonDef";
import ParametersCard from "./side-cards/ParametersCard";
import DownloadCard from "./side-cards/download-card/DownloadCard";
import DataAccessPanel, { TYPE } from "./tab-panels/DataAccessPanel";
import SpatialCoverageCard, {
  SpatialCoverageCardProps,
} from "./side-cards/SpatialCoverageCard";
import CitationPanel from "./tab-panels/CitationPanel";

interface SideSectionProps extends SpatialCoverageCardProps {}

const SideSection: FC<SideSectionProps> = ({ onSpatialCoverageLayerClick }) => {
  const { isCollectionNotFound } = useDetailPageContext();

  if (isCollectionNotFound) return null;

  return (
    <Stack
      direction={{ xs: "column", sm: "row", md: "column" }}
      gap={2}
      flexWrap="wrap"
    >
      <ParametersCard />
      <DownloadCard />
      <DataAccessPanel mode={MODE.COMPACT} type={TYPE.DATA_ACCESS} />
      <SpatialCoverageCard
        onSpatialCoverageLayerClick={onSpatialCoverageLayerClick}
      />
      <CitationPanel mode={MODE.COMPACT} />
    </Stack>
  );
};

export default SideSection;
