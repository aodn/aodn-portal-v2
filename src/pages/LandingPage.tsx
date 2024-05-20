import MainMenu from "../components/menu/MainMenu";
import BannerOpenAccess from "../components/banner/BannerOpenAccess";
import ComplexTextSearch from "../components/search/ComplexTextSearch";
import StoryBoardPanel from "../components/storyboard/StoryBoardPanel";
import ShortCutSmartPanel from "../components/smartpanel/ShortCutSmartPanel";
import PromotionSmartPanel from "../components/smartpanel/PromotionSmartPanel";
import { useState } from "react";
import {
  createSearchParamForImosRealTime,
  //createSearchParamFrom,
  fetchResultWithStore,
} from "../components/common/store/searchReducer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../components/common/store/store";
import { Box } from "@mui/material";
import { CARD_ID } from "../components/smartpanel/utils";
import Layout from "../components/layout/layout";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onCardClick = (id: number) => {
    switch (id) {
      case CARD_ID.ADVANCED_SEARCH:
        break;
      case CARD_ID.SATELITE:
        dispatch(fetchResultWithStore(createSearchParamForImosRealTime()))
          .unwrap()
          .then(() => navigate("/search"));

        break;
      default:
        break;
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          backgroundImage: "url(/bg_landing_page.png)",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MainMenu />
        <BannerOpenAccess />
        <Box sx={{ width: "66.5%" }}>
          <ComplexTextSearch />
        </Box>

        <ShortCutSmartPanel onCardClicked={onCardClick} />
      </Box>
      <StoryBoardPanel />
      <PromotionSmartPanel />
    </Layout>
  );
};

export default LandingPage;
