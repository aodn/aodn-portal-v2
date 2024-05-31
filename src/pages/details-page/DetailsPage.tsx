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
import HeaderPanel from "./sub-pages/HeaderPanel";

import SidePanel from "./sub-pages/SidePanel";
import ContentUpperSection from "./sub-pages/ContentUpperSection";
import ContentLowerSection from "./sub-pages/ContentLowerSection";

const DetailsPage = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [collection, setCollection] = useState<OGCCollection | undefined>(
    undefined
  );

  useEffect(() => {
    const uuid = new URLSearchParams(location.search).get("uuid");
    dispatch(fetchResultByUuidNoStore(uuid))
      .unwrap()
      .then((collection) => {
        setCollection(collection);
      });
  }, [dispatch, location.search]);

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingY: padding.double,
        }}
      >
        <Box sx={{ width: "1200px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <HeaderPanel />
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid container item xs={9} spacing={2}>
                <Grid item xs={12}>
                  <ContentUpperSection />
                </Grid>
                <Grid item xs={12}>
                  <ContentLowerSection />
                </Grid>
              </Grid>
              <Grid container item xs={3} spacing={2}>
                <SidePanel />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default DetailsPage;
