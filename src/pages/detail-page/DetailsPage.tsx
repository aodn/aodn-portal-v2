import Layout from "../../components/layout/layout";
import { Grid } from "@mui/material";
import { color, padding } from "../../styles/constants";
import HeaderSection from "./subpages/HeaderSection";
import SideSection from "./subpages/SideSection";
import { DetailPageProvider } from "./context/detail-page-provider";
import ContentSection from "./subpages/ContentSection";
import SectionContainer from "../../components/layout/components/SectionContainer";
import { LngLatBounds, MapEvent, MapMouseEvent } from "mapbox-gl";
import { useCallback, useState } from "react";
import { MapEventEnum } from "../../components/map/mapbox/constants";

const DetailsPage = () => {
  const [bbox, setBbox] = useState<LngLatBounds | undefined>(undefined);

  const onSpatialCoverageLayerClick = useCallback(
    (evt: MapMouseEvent) => {
      if (evt.type === "click" && evt.lngLat) {
        // Magic number 10 to move to a bound area given the lnglat
        const bounds = evt.lngLat.toBounds(10);
        setBbox(bounds);
      }
    },
    [setBbox]
  );

  const onMapMoveEnd = useCallback(
    (evt: MapEvent) => {
      if ((evt as any)?.originalEvent) {
        if (evt.type === MapEventEnum.MOVE_END) {
          const b = evt?.target.getBounds();
          setBbox(b!);
        }
      }
    },
    [setBbox]
  );

  return (
    <Layout>
      <DetailPageProvider>
        <SectionContainer
          sectionAreaStyle={{
            paddingY: padding.large,
            backgroundColor: color.blue.light,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <HeaderSection />
            </Grid>
            <Grid item xs={12} md={9}>
              <ContentSection mapFocusArea={bbox} onMapMoveEnd={onMapMoveEnd} />
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
