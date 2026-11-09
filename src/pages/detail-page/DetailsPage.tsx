import { Alert, Grid } from "@mui/material";
import { color, padding } from "@/styles/constants";
import HeaderSection from "./layout/HeaderSection";
import SideSection from "./layout/SideSection";
import { DetailPageProvider } from "./context/detail-page-provider";
import ContentSection from "./layout/ContentSection";
import SectionContainer from "@/components/common/container/SectionContainer";
import { PAGE_CONTENT_WIDTH_DETAIL } from "@/app/layout/constant";
import { LngLatBounds } from "mapbox-gl";
import { FC, useCallback, useState } from "react";
import { useDetailPageContext } from "@/pages/detail-page/context/detail-page-context";
import DetailPageSeo from "@/pages/detail-page/features/DetailPageSeo";

const DetailPageContent: FC = () => {
  const { isTemporaryError } = useDetailPageContext();
  const [bbox, setBbox] = useState<LngLatBounds | undefined>(undefined);
  const onSpatialCoverageLayerClick = useCallback(
    (bounds: LngLatBounds) => {
      if (bounds) {
        setBbox(bounds);
      }
    },
    [setBbox]
  );

  if (isTemporaryError) {
    return (
      <Alert severity="error">
        Unable to load this dataset at the moment. Please try again later.
      </Alert>
    );
  }

  return (
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
  );
};

const DetailsPage: FC = () => (
  <DetailPageProvider>
    <DetailPageSeo />
    <DetailPageContent />
  </DetailPageProvider>
);

export default DetailsPage;
