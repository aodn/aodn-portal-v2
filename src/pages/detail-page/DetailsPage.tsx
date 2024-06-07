import { useLocation } from "react-router-dom";
import {
  fetchResultByUuidNoStore,
  OGCCollection,
} from "../../components/common/store/searchReducer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../components/common/store/store";

import Layout from "../../components/layout/layout";
import { Box, Grid } from "@mui/material";
import { padding } from "../../styles/constants";
import HeaderPanel from "./subpages/HeaderPanel";

import SidePanel from "./subpages/SidePanel";
import ContentUpperSection from "./subpages/ContentUpperSection";
import ContentLowerSection from "./subpages/ContentLowerSection";
import Fallback from "../Fallback";
import { DetailPageProvider } from "./context/detail-page-provider";

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
            backgroundImage: "url(/landing_page_bg.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Box sx={{ width: "1200px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <HeaderPanel />
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <ContentUpperSection />
                  </Grid>
                  <Grid item xs={12}>
                    <ContentLowerSection />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <SidePanel />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DetailPageProvider>
    </Layout>
  );
};

export default DetailsPage;
