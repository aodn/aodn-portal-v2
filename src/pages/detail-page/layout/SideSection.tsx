import { FC } from "react";
import { Stack } from "@mui/material";
import { useDetailPageContext } from "../context/detail-page-context";
import { MODE } from "../../../components/list/CommonDef";
// import ParametersCard from "../features/ParametersCard";
import DownloadCard from "../features/download/DownloadCard";
import DataAccessPanel, { TYPE } from "../features/DataAccessPanel";
import SpatialCoverageCard, {
  SpatialCoverageCardProps,
} from "../features/SpatialCoverageCard";
import CitationPanel from "../features/CitationPanel";

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
      {/* TODO: Needs further discussion. See https://github.com/aodn/backlog/issues/6962 */}
      {/* <ParametersCard /> */}
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
