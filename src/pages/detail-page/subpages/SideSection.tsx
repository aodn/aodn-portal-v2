import { Card, Stack } from "@mui/material";
import { borderRadius } from "../../../styles/constants";
import DownloadCard from "./side-cards/DownloadCard";
import OverviewCard from "./side-cards/OverviewCard";
import SpatialExtendCard from "./side-cards/SpatialExtendCard";
import TemporalExtentCard from "./side-cards/TemporalExtentCard";
import AssociatedCategoriesCard from "./side-cards/AssociatedCategoriesCard";
import RatingsAndCommentsCard from "./side-cards/RatingsAndCommentsCard";

const SideSection = () => {
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
      <OverviewCard />
      <SpatialExtendCard />
      <TemporalExtentCard />
      <AssociatedCategoriesCard />
      <RatingsAndCommentsCard />
    </Stack>
  );
};

export default SideSection;
