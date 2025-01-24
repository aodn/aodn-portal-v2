import Layout from "../../components/layout/layout";
import { Grid } from "@mui/material";
import { color, padding } from "../../styles/constants";
import HeaderSection from "./subpages/HeaderSection";
import SideSection from "./subpages/SideSection";
import { DetailPageProvider } from "./context/detail-page-provider";
import ContentSection from "./subpages/ContentSection";
import SectionContainer from "../../components/layout/components/SectionContainer";
import { LngLatBounds, MapLayerMouseEvent } from "mapbox-gl";
import { useCallback, useState } from "react";

const DetailsPage = () => {
  const [bbox, setBbox] = useState<LngLatBounds | undefined>(undefined);
  const onSpatialCoverageLayerClick = useCallback(
    (evt: MapLayerMouseEvent) => {
      if (evt.type === "click" && evt.lngLat) {
        // Magic number 10 to move to a bound area given the lnglat
        const bounds = evt.lngLat.toBounds(10);
        setBbox(bounds);
      }
    },
    [setBbox]
  );

  return (
    <Layout>
      <DetailPageProvider>
        <SectionContainer
          sectionAreaStyle={{
            paddingY: padding.double,
            backgroundColor: color.blue.light,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <HeaderSection />
            </Grid>
            <Grid item xs={12} md={9}>
              <ContentSection mapFocusArea={bbox} />
            </Grid>
            <Grid item xs={12} md={3}>
              <SideSection
                onSpatialCoverageLayerClick={onSpatialCoverageLayerClick}
              />
            </Grid>
          </Grid>
        </SectionContainer>
      </DetailPageProvider>
    </Layout>
  );
};

export default DetailsPage;
