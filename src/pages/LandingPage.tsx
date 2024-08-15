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
import { Box, Stack } from "@mui/material";
import { CARD_ID } from "../components/smartpanel/utils";
import Layout from "../components/layout/layout";
import landingImageUrl from "@/assets/images/bg_landing_page.png";
import SmartPanel from "../components/smartpanel/SmartPanel";

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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            minWidth: "1020px",
            width: "80%",
            maxWidth: "1270px",
          }}
        >
          <BannerOpenAccess />
          <ComplexTextSearch />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "80px 30px",
            }}
          >
            <Box width="1000px" height="160px">
              <ShortCutSmartPanel onCardClicked={onCardClick} />
              {/* <SmartPanel /> */}
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          direction="column"
          sx={{
            minWidth: "1020px",
            width: "80%",
            maxWidth: "1270px",
          }}
        >
          <StoryBoardPanel />
          <PromotionSmartPanel />
        </Stack>
      </Box>
    </Layout>
  );
};

export default LandingPage;
