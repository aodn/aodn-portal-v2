import { FC } from "react";
import { Card, Stack } from "@mui/material";
import { borderRadius } from "../../../styles/constants";
import DownloadCard from "./side-cards/DownloadCard";
import OverviewCard from "./side-cards/OverviewCard";
import SpatialCoverageCard, {
  SpatialCoverageCardProps,
} from "./side-cards/SpatialCoverageCard";
import TimePeriodCard from "./side-cards/TimePeriodCard";
import ThemesCard from "./side-cards/ThemesCard";
import RatingsAndCommentsCard from "./side-cards/RatingsAndCommentsCard";
import { useDetailPageContext } from "../context/detail-page-context";

interface SideSectionProps extends SpatialCoverageCardProps {}

const SideSection: FC<SideSectionProps> = ({ onSpatialCoverageLayerClick }) => {
  const { isCollectionNotFound } = useDetailPageContext();
  return (
    <Stack direction="column" spacing={2}>
      <Card
        sx={{
          backgroundColor: "#fff",
          borderRadius: borderRadius.small,
        }}
      >
        <DownloadCard />
      </Card>
      {!isCollectionNotFound && (
        <>
          <OverviewCard />
          <SpatialCoverageCard
            onSpatialCoverageLayerClick={onSpatialCoverageLayerClick}
          />
          <TimePeriodCard />
          <ThemesCard />
          <RatingsAndCommentsCard />
        </>
      )}
    </Stack>
  );
};

export default SideSection;
