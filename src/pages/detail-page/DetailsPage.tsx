import Layout from "../../components/layout/layout";
import { Box, Grid } from "@mui/material";
import { color, padding } from "../../styles/constants";
import HeaderSection from "./subpages/HeaderSection";
import SideSection from "./subpages/SideSection";
import { DetailPageProvider } from "./context/detail-page-provider";
import ContentSection from "./subpages/ContentSection";
import { OGCCollection } from "../../components/common/store/OGCCollectionDefinitions";
import SectionContainer from "../../components/layout/components/SectionContainer";

export interface DetailsProps {
  collection?: OGCCollection;
}

const DetailsPage = () => {
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
            <Grid item xs={9}>
              <ContentSection />
            </Grid>
            <Grid item xs={3}>
              <SideSection />
            </Grid>
          </Grid>
        </SectionContainer>
      </DetailPageProvider>
    </Layout>
  );
};

export default DetailsPage;
