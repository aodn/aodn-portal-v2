import MainMenu from "../components/menu/MainMenu";
import BannerOpenAccess from "../components/banner/BannerOpenAccess";
import ComplexTextSearch from "../components/search/ComplexTextSearch";
import StoryBoardPanel from "../components/storyboard/StoryBoardPanel";
import ShortCutSmartPanel from "../components/smartpanel/ShortCutSmartPanel";
import PromotionSmartPanel from "../components/smartpanel/PromotionSmartPanel";
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
import landingImageUrl from "@/assets/images/bg_landing_page.png";

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
          backgroundImage: `url(${landingImageUrl})`,
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MainMenu />
          <BannerOpenAccess />
          <ComplexTextSearch />
          <ShortCutSmartPanel onCardClicked={onCardClick} />
        </Box>
      </Box>
      <StoryBoardPanel />
      <PromotionSmartPanel />
    </Layout>
  );
};

export default LandingPage;
