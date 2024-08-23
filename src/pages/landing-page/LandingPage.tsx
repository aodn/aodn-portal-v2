import { FC } from "react";
import { Box } from "@mui/material";
import landingImageUrl from "@/assets/images/bg_landing_page.png";
import Layout from "../../components/layout/layout";
import BannerOpenAccess from "./subpages/banner/BannerOpenAccess";
import ComplexTextSearch from "../../components/search/ComplexTextSearch";
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

const LandingPage: FC = () => {
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
        <ComplexTextSearch />
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
            <SmartPanel />
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
