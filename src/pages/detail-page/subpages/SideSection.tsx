import { Card, Grid, Stack } from "@mui/material";
import { borderRadius, padding } from "../../../styles/constants";
import DownloadCard from "./side-cards/DownloadCard";
import OverviewCard from "./side-cards/OverviewCard";
import SpatialExtendCard from "./side-cards/SpatialExtendCard";
import TemporalExtentCard from "./side-cards/TemporalExtentCard";
import AssociatedCategoriesCard from "./side-cards/AssociatedCategoriesCard";
import RatingsAndCommentsCard from "./side-cards/RatingsAndCommentsCard";

const SideSection = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="column" spacing={2}>
          <Card
            sx={{
              backgroundColor: "white",
              borderRadius: borderRadius.small,
            }}
          >
            <DownloadCard />
          </Card>
          <Card
            sx={{
              backgroundColor: "white",
              borderRadius: borderRadius.small,
            }}
          >
            <OverviewCard />
          </Card>
          <Card
            sx={{
              backgroundColor: "white",
              borderRadius: borderRadius.small,
            }}
          >
            <SpatialExtendCard />
          </Card>
          <Card
            sx={{
              backgroundColor: "white",
              borderRadius: borderRadius.small,
            }}
          >
            <TemporalExtentCard />
          </Card>
          <Card
            sx={{
              backgroundColor: "white",
              borderRadius: borderRadius.small,
            }}
          >
            <AssociatedCategoriesCard />
          </Card>
          <Card
            sx={{
              backgroundColor: "white",
              borderRadius: borderRadius.small,
            }}
          >
            <RatingsAndCommentsCard />
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SideSection;
