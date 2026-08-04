import { Grid } from "@mui/material";
import { color, padding } from "@/styles/constants";
import HeaderSection from "./layout/HeaderSection";
import SideSection from "./layout/SideSection";
import { DetailPageProvider } from "./context/detail-page-provider";
import ContentSection from "./layout/ContentSection";
import SectionContainer from "@/components/common/container/SectionContainer";
import { PAGE_CONTENT_WIDTH_DETAIL } from "@/app/layout/constant";
import { LngLatBounds } from "mapbox-gl";
import { useCallback, useState } from "react";

const DetailsPage = () => {
  const [bbox, setBbox] = useState<LngLatBounds | undefined>(undefined);
  const onSpatialCoverageLayerClick = useCallback(
    (bounds: LngLatBounds) => {
      if (bounds) {
        setBbox(bounds);
      }
    },
    [setBbox]
  );

  return (
    <DetailPageProvider>
      <SectionContainer
        sectionAreaStyle={{
          paddingY: padding.large,
          backgroundColor: color.blue.light,
        }}
        contentAreaStyle={{
          width: PAGE_CONTENT_WIDTH_DETAIL,
          // SectionContainer defaults to alignItems: center. Grid2 no longer
          // forces width:100% on containers, so centered children shrink and
          // column/row spacing collapses. Stretch so the page grid fills the
          // content width like legacy Grid did.
          alignItems: "stretch",
        }}
      >
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid size={12}>
            <HeaderSection />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 9,
            }}
          >
            <ContentSection mapFocusArea={bbox} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <SideSection
              onSpatialCoverageLayerClick={onSpatialCoverageLayerClick}
            />
          </Grid>
        </Grid>
      </SectionContainer>
    </DetailPageProvider>
  );
};

export default DetailsPage;
