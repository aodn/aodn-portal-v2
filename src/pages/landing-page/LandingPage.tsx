import { FC, useCallback } from "react";
import { Box } from "@mui/material";
import landingImageUrl from "@/assets/images/bg_landing_page.png";
import Layout from "../../components/layout/layout";
import BannerOpenAccess from "./subpages/banner/BannerOpenAccess";
import Searchbar from "../../components/search/Searchbar";
import SmartPanel from "./subpages/smartpanel/SmartPanel";
import StoryBoardPanel from "./subpages/storyboard/StoryBoardPanel";
import { color } from "../../styles/constants";
import Logos from "./subpages/logo-list/LogoList";
import News from "./subpages/news/News";
import SectionContainer from "../../components/layout/components/SectionContainer";
import {
  BANNER_HEIGHT,
  SMART_PANEL_CONTAINER_HEIGHT,
  SMART_PANEL_CONTAINER_WIDTH,
} from "./constants";
import {
  formatToUrlParam,
  ParameterState,
  updateDateTimeFilterRange,
  updateImosOnly,
  updateParameterVocabs,
  updateSearchText,
  updateUpdateFreq,
} from "../../components/common/store/componentParamReducer";
import { useAppDispatch } from "../../components/common/store/hooks";
import store, { getComponentState } from "../../components/common/store/store";
import { useNavigate } from "react-router-dom";
import { pageDefault } from "../../components/common/constants";

const LandingPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const redirectSearch = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());
    navigate(pageDefault.search + "?" + formatToUrlParam(componentParam), {
      state: {
        fromNavigate: true,
        requireSearch: true,
        referer: "SmartPanel",
      },
    });
  }, [navigate]);

  // This is a simple click smart card function that with update search input text and clear all the filters
  // Can be change to a function-switcher if any other functions are designed in the future
  const handleClickSmartCard = useCallback(
    (value: string) => {
      dispatch(updateParameterVocabs([]));
      dispatch(updateDateTimeFilterRange({}));
      dispatch(updateImosOnly(false));
      dispatch(updateUpdateFreq(undefined));
      dispatch(updateSearchText(value));
      redirectSearch();
    },
    [dispatch, redirectSearch]
  );

  return (
    <Layout>
      <SectionContainer
        sectionAreaStyle={{
          backgroundImage: `url(${landingImageUrl})`,
          backgroundSize: "cover",
        }}
        contentAreaStyle={{
          height: BANNER_HEIGHT,
        }}
      >
        <BannerOpenAccess />
        <Searchbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box
            width={SMART_PANEL_CONTAINER_WIDTH}
            height={SMART_PANEL_CONTAINER_HEIGHT}
          >
            <SmartPanel handleClickSmartCard={handleClickSmartCard} />
          </Box>
        </Box>
      </SectionContainer>
      <SectionContainer sectionAreaStyle={{ backgroundColor: "#fff" }}>
        <StoryBoardPanel />
      </SectionContainer>
      <SectionContainer
        sectionAreaStyle={{ backgroundColor: color.blue.extraDark }}
      >
        <News />
      </SectionContainer>
      <SectionContainer
        sectionAreaStyle={{ backgroundColor: color.blue.light }}
      >
        <Logos />
      </SectionContainer>
    </Layout>
  );
};

export default LandingPage;
