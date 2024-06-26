import { OGCCollection } from "../../components/common/store/searchReducer";
import Layout from "../../components/layout/layout";
import { Box, Grid } from "@mui/material";
import { color, padding } from "../../styles/constants";
import HeaderSection from "./subpages/HeaderSection";
import SideSection from "./subpages/SideSection";
import { DetailPageProvider } from "./context/detail-page-provider";
import ContentSection from "./subpages/ContentSection";

export interface DetailsProps {
  collection?: OGCCollection;
}

const DetailsPage = () => {
  return (
    <Layout>
      <DetailPageProvider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingY: padding.double,
            backgroundColor: color.blue.light,
          }}
        >
          <Box sx={{ minWidth: "1020px", width: "70%", maxWidth: "1228px" }}>
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
          </Box>
        </Box>
      </DetailPageProvider>
    </Layout>
  );
};

export default DetailsPage;
