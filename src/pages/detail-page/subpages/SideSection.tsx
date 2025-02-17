import { FC } from "react";
import { Card, Stack } from "@mui/material";
import { borderRadius } from "../../../styles/constants";
import DownloadCard from "./side-cards/DownloadCard";
import SpatialCoverageCard, {
  SpatialCoverageCardProps,
} from "./side-cards/SpatialCoverageCard";
import TimePeriodCard from "./side-cards/TimePeriodCard";
import ThemesCard from "./side-cards/ThemesCard";
import { useDetailPageContext } from "../context/detail-page-context";
import CitationPanel from "./tab-panels/CitationPanel";
import { MODE } from "../../../components/list/CommonDef";

interface SideSectionProps extends SpatialCoverageCardProps {}

const SideSection: FC<SideSectionProps> = ({ onSpatialCoverageLayerClick }) => {
  const { isCollectionNotFound, collection } = useDetailPageContext();

  return (
    <Stack
      direction={{ xs: "column", sm: "row", md: "column" }}
      gap={2}
      flexWrap="wrap"
    >
      {collection?.hasSummaryFeature() && (
        <Card
          sx={{
            backgroundColor: "#fff",
            borderRadius: borderRadius.small,
            width: "100%",
          }}
        >
          <DownloadCard />
        </Card>
      )}
      {!isCollectionNotFound && (
        <>
          <SpatialCoverageCard
            onSpatialCoverageLayerClick={onSpatialCoverageLayerClick}
          />
          <TimePeriodCard />
          <ThemesCard />
          <CitationPanel mode={MODE.COMPACT} />
        </>
      )}
    </Stack>
  );
};

export default SideSection;
